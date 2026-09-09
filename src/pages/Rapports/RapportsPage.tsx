import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PROJECT_STATUSES } from '@/constants/PROJECT_STATUSES'
import { agenceRegionaleServices } from '@/services/agences-regionales.services'
import { configurationServices } from '@/services/configurations.services'
import { dashboardServices } from '@/services/dashboard.services'
import { dispositifServices } from '@/services/dispositifs.services'
import { useAuthStore } from '@/store/useAuthStore'
import type { CONFIGURATION_T } from '@/types/configurations.types'

import {
  RAPPORT_PAR_DEFAUT,
  filtreEstApplicable,
  libelleRapport,
  messageEtatVide,
  type RAPPORT_CLE_T,
} from './constants'
import { useRapportData, type RAPPORT_FILTRES_T } from './hooks/useRapportData'
import { RapportBarChart } from './UI/RapportBarChart'
import { RapportDonut } from './UI/RapportDonut'
import { RapportTable } from './UI/RapportTable'
import { RapportTrend } from './UI/RapportTrend'
import { RapportsFilters } from './UI/RapportsFilters'
import { exporterCsv } from './utils/exportCsv'
import { genererFicheSynthese } from './utils/ficheSynthese'

/**
 * ÉCRAN « Rapports & analyses »
 * =============================
 * Assemble la barre de filtres, les quatre cartes de la maquette et les deux
 * sorties (export CSV, fiche de synthèse imprimable) autour d'UN SEUL moteur :
 * `useRapportData`, qui choisit la source réelle selon le type de rapport.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * RÈGLE D'ARBITRAGE APPLIQUÉE ICI
 * ══════════════════════════════════════════════════════════════════════════
 * La maquette fait autorité sur la FORME — disposition en deux grilles de deux
 * cartes, barres horizontales, donut + légende, détail chiffré, tendance —,
 * l'API fait autorité sur le FOND. Trois conséquences visibles à l'écran :
 *
 *  1. Le titre de la carte du donut suit la MESURE réellement disponible :
 *     « Répartition (part du montant) » quand l'API fournit des montants,
 *     « Répartition (part des dossiers) » sinon. On ne promet pas une part de
 *     montant là où aucun endpoint ne sait sommer un montant par dimension.
 *  2. La carte de tendance n'affiche PAS la série de la maquette (soumissions
 *     de micro-projets par mois : non agrégée par l'API et hors de portée d'un
 *     calcul client sur 110 000 lignes) mais la seule série mensuelle réelle,
 *     sous son vrai nom. Détail de l'arbitrage dans `RapportTrend`.
 *  3. Une mention de SOURCE est affichée sous chaque carte — ajout assumé par
 *     rapport à la maquette. Il est justifié par l'hétérogénéité des sources :
 *     selon le rapport, le même écran lit un agrégat serveur ou dénombre lui-
 *     même via N requêtes `per_page=1`. Sans cette mention, deux chiffres de
 *     provenance très différente seraient présentés à l'identique, et
 *     l'utilisateur n'aurait aucun moyen de comprendre pourquoi tel rapport
 *     porte des montants et tel autre non.
 */

/* ------------------------------------------------------------------ *
 * Vocabulaire visuel                                                  *
 * ------------------------------------------------------------------ *
 * Traduction Tailwind des `.card/.hd/.bd` de la maquette DÉJÀ VALIDÉE dans le
 * dépôt (`src/pages/Dashboard/AdminDashboard/UI/AdminDashboardCharts.tsx`) :
 * on la réutilise telle quelle plutôt que d'en inventer une seconde.
 * `py-0 gap-0` neutralise le `py-6`/`gap-6` par défaut du composant `Card` du
 * dépôt, que la maquette ne prévoit pas (son `.card` n'a aucun padding propre :
 * tout le padding est porté par `.hd` et `.bd`). */
const CARTE_CLASS = 'gap-0 rounded-[7px] border-[#E5EAF1] py-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
const ENTETE_CLASS = 'flex flex-row items-center gap-3 border-b border-[#EEF2F7] px-4 py-3'
const TITRE_CLASS = 'text-[14px] font-bold text-[#131C29]'

/**
 * Titres FIXES des deux cartes du bas. Déclarés ici plutôt qu'en littéral dans
 * le JSX parce qu'ils servent DEUX fois chacun : au titre visible de la carte,
 * et au nom accessible (`aria-label`) de la zone défilable qu'elle contient.
 * Un seul point de vérité évite que les deux divergent.
 */
const TITRE_DETAIL = 'Détail chiffré'
const TITRE_TENDANCE = 'Évolution mensuelle des remboursements'

/**
 * Mention de provenance, en pied de carte. Volontairement discrète (11 px,
 * gris de second plan) : c'est une information de traçabilité, pas un contenu.
 */
function MentionSource({ source }: { source: string }) {
  return (
    <p className="border-t border-[#F2F5F9] px-4 py-2 text-[11px] leading-snug text-[#8595A8]">
      Source&nbsp;: {source}
    </p>
  )
}

/** Squelette de chargement — même gabarit que `LocalitesPage`. */
function SqueletteCarte({ lignes = 5 }: { lignes?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: lignes }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-4 w-[130px]" />
          <Skeleton className="h-[11px] flex-1" />
          <Skeleton className="h-4 w-[60px]" />
        </div>
      ))}
    </div>
  )
}

/** Bloc d'erreur — repris de `LocalitesPage` pour rester homogène. */
function BlocErreur() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-red-600">
      <span className="text-sm font-medium">Impossible de charger les données</span>
      <span className="max-w-[420px] text-center text-xs text-red-500">
        La source de ce rapport n&apos;a pas répondu. Réessayez dans un instant ou changez de
        type de rapport.
      </span>
    </div>
  )
}

/**
 * État vide EXPLICITE et non anxiogène. C'est le cas NORMAL aujourd'hui pour
 * les rapports par agence, région, guichet et secteur : ces clés étrangères
 * sont nulles sur les 110 000 micro-projets. Ce n'est ni une panne ni un bug,
 * et l'écran doit le dire — jamais une erreur rouge, jamais un chiffre inventé.
 */
function BlocVide({
  message,
  titre = 'Aucune donnée pour cette dimension.',
}: {
  message: string
  /** Le titre par défaut ne vaut que pour les cartes de RAPPORT ; la série
      mensuelle des remboursements n'est pas une « dimension », elle fournit
      donc le sien. */
  titre?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <span className="text-[13.5px] font-semibold text-[#243244]">{titre}</span>
      <span className="max-w-[460px] text-[12px] leading-relaxed text-[#5A6B80]">{message}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * L'écran                                                             *
 * ------------------------------------------------------------------ */

export function RapportsPage() {
  /**
   * État local — la maquette mémorisait le sien sur `window._rep` pour survivre
   * à la navigation ; un `useState` suffit ici, TanStack Router remontant la
   * page à chaque entrée et TanStack Query conservant déjà les données en cache
   * (`staleTime` de 15 min) : le retour sur l'écran est instantané sans qu'on
   * ait à polluer l'objet global.
   */
  const [type, setType] = useState<RAPPORT_CLE_T>(RAPPORT_PAR_DEFAUT)
  const [filtres, setFiltres] = useState<RAPPORT_FILTRES_T>({
    statut: '',
    agenceId: '',
    dispositifId: '',
  })

  // Fusion partielle : chaque select ne pousse QUE sa propre clé, contrairement
  // à la maquette qui relisait les quatre valeurs du DOM à chaque `change`.
  const majFiltres = useCallback(
    (patch: RAPPORT_FILTRES_T) => setFiltres((precedent) => ({ ...precedent, ...patch })),
    [],
  )

  const {
    rapport,
    lignes,
    totalN,
    totalMontant,
    aMontant,
    aNombre,
    isLoading,
    isError,
    sourceLabel,
  } = useRapportData(type, filtres)

  /* --- Référentiels de la barre de filtres ------------------------ *
   * Mêmes hooks — donc même cache TanStack Query — que ceux utilisés par le
   * moteur : afficher la liste des agences ne coûte aucune requête de plus. */
  const qDispositifs = dispositifServices.useGetAll()
  const qAgences = agenceRegionaleServices.useGetAll()

  /* --- Série mensuelle de la carte « Tendance » ------------------- *
   * Indépendante du type de rapport (elle ne porte pas sur la même dimension) :
   * chargée une fois, conservée d'un rapport à l'autre. */
  const qTendance = dashboardServices.useEvolutionRemboursements()

  /* --- Identité pour la fiche de synthèse ------------------------- */
  const qConfig = configurationServices.useGet()
  const utilisateur = useAuthStore((etat) => etat.user)

  /**
   * Sous-titre de la maquette, adapté au profil connecté.
   * La maquette écrivait « …adaptés à votre profil ` + rc + `. » sans aucun
   * garde-fou : un rôle absent y affichait littéralement « votre profil
   * undefined. ». Ici la mention du profil disparaît proprement si le rôle
   * n'est pas connu (session en cours de réhydratation, compte sans rôle).
   */
  const codeRole = utilisateur?.role?.code
  const sousTitre = codeRole
    ? `Tableaux de bord analytiques adaptés à votre profil ${codeRole}.`
    : 'Tableaux de bord analytiques adaptés à votre profil.'

  /**
   * Libellés des filtres RÉELLEMENT appliqués, pour le bandeau de la fiche.
   * Un filtre non applicable au rapport courant n'est pas transmis par le
   * moteur : la fiche doit donc le dire, et non recopier une valeur d'état
   * périmée qui laisserait croire à un périmètre plus étroit qu'il ne l'est.
   */
  const libellesFiltres = useMemo(() => {
    const NON_APPLICABLE = 'Non applicable à ce rapport'

    const guichet = !filtreEstApplicable(rapport, 'dispositif')
      ? NON_APPLICABLE
      : filtres.dispositifId
        ? (qDispositifs.data?.find((d) => String(d.id) === filtres.dispositifId)?.intitule ?? '—')
        : 'Tous les guichets'

    const region = !filtreEstApplicable(rapport, 'region')
      ? NON_APPLICABLE
      : filtres.agenceId
        ? (qAgences.data?.find((a) => String(a.id) === filtres.agenceId)?.nom ?? '—')
        : 'Toutes les régions'

    const statut = !filtreEstApplicable(rapport, 'statut')
      ? NON_APPLICABLE
      : filtres.statut
        ? (PROJECT_STATUSES.find((s) => s.key === filtres.statut)?.label ?? '—')
        : 'Toutes les étapes'

    return { guichet, region, statut }
  }, [rapport, filtres, qDispositifs.data, qAgences.data])

  /**
   * Les deux sorties sont sans objet tant qu'il n'y a rien à écrire : un CSV
   * réduit à sa ligne d'en-tête et une fiche sans chiffre ne sont pas des
   * livrables. L'état vide de l'écran, lui, explique déjà la situation.
   */
  const actionsDesactivees = isLoading || isError || lignes.length === 0

  const surExportCsv = useCallback(() => {
    exporterCsv({ rapport, lignes, aMontant, aNombre, totalN, totalMontant })
  }, [rapport, lignes, aMontant, aNombre, totalN, totalMontant])

  const surGenererFiche = useCallback(() => {
    /**
     * `logo_systeme_url` est renvoyé par `/configurations` (URL ABSOLUE, prête
     * à l'emploi) mais n'est pas déclaré dans `CONFIGURATION_T`, hors périmètre
     * de cette tâche. On le lit donc par une intersection de type locale plutôt
     * que de modifier un type partagé : la valeur est bien réelle, seul son
     * contrat TypeScript est en retard.
     */
    const config = qConfig.data as (CONFIGURATION_T & { logo_systeme_url?: string | null }) | undefined

    const auteur = [utilisateur?.prenom, utilisateur?.nom].filter(Boolean).join(' ').trim()

    genererFicheSynthese({
      rapport,
      lignes,
      totalN,
      totalMontant,
      aMontant,
      aNombre,
      filtres: libellesFiltres,
      // Cadratin : marqueur d'absence de la maquette, pas une donnée inventée.
      auteur: auteur || '—',
      // Le LIBELLÉ du rôle (« Directeur du post-financement »), pas son code.
      role: utilisateur?.role?.libelle ?? '',
      config: {
        intituleStructure: config?.intitule_structure ?? '—',
        intituleSysteme: config?.intitule_systeme ?? '—',
        sigleSysteme: config?.sigle_systeme ?? '',
        logoUrl: config?.logo_systeme_url ?? null,
      },
    })
  }, [
    rapport,
    lignes,
    totalN,
    totalMontant,
    aMontant,
    aNombre,
    libellesFiltres,
    qConfig.data,
    utilisateur,
  ])

  /**
   * Message d'état vide, choisi sur la CAUSE et non sur la simple présence d'un
   * filtre. C'est le texte que l'utilisateur lira le plus souvent aujourd'hui :
   * il doit être juste. Trois cas distingués par `messageEtatVide` — filtre
   * posé sur une clé étrangère non alimentée (région, guichet), filtre
   * réellement discriminant (statut), ou dimension analysée non alimentée.
   */
  const messageVide = messageEtatVide(rapport, {
    statut: filtres.statut,
    region: filtres.agenceId,
    dispositif: filtres.dispositifId,
  })

  const estVide = !isLoading && !isError && lignes.length === 0

  /** Rend le contenu d'une carte de rapport, ou l'état qui en tient lieu. */
  const contenu = (rendu: () => ReactNode, nbLignesSquelette = 5) => {
    if (isLoading) return <SqueletteCarte lignes={nbLignesSquelette} />
    if (isError) return <BlocErreur />
    if (estVide) return <BlocVide message={messageVide} />
    return rendu()
  }

  // Total de la mesure représentée par le donut : montant si l'API en fournit,
  // dénombrement sinon. Le sous-titre central du donut suit (« MILLIONS F » vs
  // « TOTAL »), cf. `centreDonut`.
  const totalMesure = aMontant ? totalMontant : totalN

  /**
   * Titre de la carte principale. Il suit la MESURE réellement affichée, comme
   * le titre du donut : « Financement engagé par région » sur une carte qui ne
   * montre que des nombres de dossiers promettrait ce qu'elle n'affiche pas.
   * Le select « Type de rapport », lui, conserve le libellé du catalogue : il
   * nomme un TYPE de rapport, il ne décrit pas un contenu.
   */
  const titreRapport = libelleRapport(rapport, aMontant)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29]">Rapports &amp; analyses</h1>
        <p className="mt-1 text-sm text-[#5A6B80]">{sousTitre}</p>
      </div>

      <RapportsFilters
        rapport={rapport}
        filtres={filtres}
        onTypeChange={setType}
        onFiltresChange={majFiltres}
        dispositifs={qDispositifs.data ?? []}
        agences={qAgences.data ?? []}
        onExportCsv={surExportCsv}
        onGenererFiche={surGenererFiche}
        actionsDesactivees={actionsDesactivees}
      />

      {/* Grille 1 — barres horizontales | donut + légende (`.grid.g2`).
          Point de rupture à 1050 px : la maquette bascule ses `.grid.g2` en une
          colonne sous `@media(max-width:1050px)` (l. 821-831). Le `lg:` de
          Tailwind (1024 px) laissait deux colonnes entre 1024 et 1050 px. */}
      <div className="grid grid-cols-1 gap-4 min-[1051px]:grid-cols-2">
        <Card className={CARTE_CLASS}>
          <CardHeader className={ENTETE_CLASS}>
            {/* Titre DYNAMIQUE : le libellé du type de rapport, comme la maquette,
                adapté à la mesure réellement disponible (cf. `titreRapport`). */}
            <CardTitle className={TITRE_CLASS}>{titreRapport}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {contenu(() => (
              <div className="p-4">
                <RapportBarChart lignes={lignes} aMontant={aMontant} />
              </div>
            ))}
          </CardContent>
          <MentionSource source={sourceLabel} />
        </Card>

        <Card className={CARTE_CLASS}>
          <CardHeader className={ENTETE_CLASS}>
            <CardTitle className={TITRE_CLASS}>
              {/* La maquette fige « Répartition (part du montant) ». Le titre suit
                  ici la mesure réellement disponible : annoncer une part de
                  montant sur un dénombrement serait un contresens. */}
              {aMontant
                ? 'Répartition (part du montant)'
                : `Répartition (part des ${rapport.uniteN})`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {contenu(
              () => (
                <div className="p-4">
                  <RapportDonut
                    lignes={lignes}
                    aMontant={aMontant}
                    total={totalMesure}
                    uniteN={rapport.uniteN}
                  />
                </div>
              ),
              4,
            )}
          </CardContent>
          <MentionSource source={sourceLabel} />
        </Card>
      </div>

      {/* Grille 2 — détail chiffré | tendance mensuelle. Même point de rupture
          à 1050 px que la première grille (`.grid.g2` de la maquette). */}
      <div className="grid grid-cols-1 gap-4 min-[1051px]:grid-cols-2">
        <Card className={CARTE_CLASS}>
          <CardHeader className={ENTETE_CLASS}>
            <CardTitle className={TITRE_CLASS}>{TITRE_DETAIL}</CardTitle>
            <div className="flex-1" />
            {/* La maquette écrit « ${rows.length} lignes » sans accord, d'où
                « 1 lignes ». L'accord est corrigé — correction VALIDÉE par le
                commanditaire : « 1 lignes » est un artefact de gabarit de la
                maquette, pas un libellé voulu. */}
            <span className="text-[12.5px] text-[#5A6B80]">
              {lignes.length} ligne{lignes.length > 1 ? 's' : ''}
            </span>
          </CardHeader>
          {/* `p-0` : le tableau est collé au bord de la carte, comme dans la
              maquette où `${table}` est posé juste après le `.hd`, sans `.bd`. */}
          <CardContent className="p-0">
            {contenu(() => (
              <RapportTable
                lignes={lignes}
                aMontant={aMontant}
                aNombre={aNombre}
                totalN={totalN}
                totalMontant={totalMontant}
                libelleDimension={rapport.libelleDimension}
                uniteN={rapport.uniteN}
                // Nom accessible de la zone défilable : reprend le titre de la
                // carte, complété par la dimension listée.
                titre={`${TITRE_DETAIL} — ${titreRapport}`}
              />
            ))}
          </CardContent>
          <MentionSource source={sourceLabel} />
        </Card>

        <Card className={CARTE_CLASS}>
          <CardHeader className={ENTETE_CLASS}>
            {/* Titre RETITRÉ : ce n'est pas la « Tendance des soumissions par
                mois » de la maquette (non productible, cf. `RapportTrend`) mais
                la seule série mensuelle réellement agrégée par l'API. */}
            <CardTitle className={TITRE_CLASS}>{TITRE_TENDANCE}</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {qTendance.isLoading ? (
              <div className="flex h-[130px] items-end gap-[10px]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-full flex-1" />
                ))}
              </div>
            ) : qTendance.isError ? (
              <BlocErreur />
            ) : (qTendance.data ?? []).length === 0 ? (
              <BlocVide
                titre="Aucun remboursement enregistré."
                message="La série mensuelle s'affichera dès la première opération de récupération saisie."
              />
            ) : (
              <RapportTrend points={qTendance.data ?? []} titre={TITRE_TENDANCE} />
            )}
          </CardContent>
          {/* Source DIFFÉRENTE des trois autres cartes : cette série ne dépend
              pas du type de rapport sélectionné. La mention le rend visible. */}
          <MentionSource source="Agrégat serveur — /dashboard/partenaires/evolution-remboursements" />
        </Card>
      </div>
    </div>
  )
}
