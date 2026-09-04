import { useMemo } from 'react'
import { agenceRegionaleServices } from '@/services/agences-regionales.services'
import { dashboardServices } from '@/services/dashboard.services'
import { dispositifServices } from '@/services/dispositifs.services'
import { projetsServices, type COUNT_BUCKET_T } from '@/services/projets.services'
import { referentialsServices } from '@/services/referentials.services'
import { refLabel } from '@/types/referentials.types'
import { PROJECT_STATUSES } from '@/constants/PROJECT_STATUSES'
import { toNumber } from '@/helpers/numbers'
import {
  RAPPORTS_PAR_CLE,
  RAPPORT_PAR_DEFAUT,
  STADES_PROJET,
  TYPES_PORTAGE,
  filtreEstApplicable,
  type RAPPORT_CLE_T,
  type RAPPORT_FILTRE_T,
  type RAPPORT_TYPE_T,
} from '../constants'

/**
 * MOTEUR DE RAPPORT
 * =================
 * Un seul hook, deux familles de sources, une sortie normalisée :
 *
 *   type de rapport + filtres
 *        ├─ source AGREGAT  → 1 requête `/dashboard/*` (agrégation serveur)
 *        └─ source COMPTAGE → N requêtes `/projets?…&per_page=1` en parallèle
 *                             (aucune agrégation serveur n'existe sur ces
 *                              dimensions — cf. `projetsServices.useCounts`)
 *        ↓
 *   RAPPORT_LIGNE_T[] trié par mesure principale décroissante
 *
 * ── Ce que ce moteur ne fera JAMAIS ──
 * Inventer une ligne, estimer un montant, extrapoler un total. Si la source ne
 * renvoie rien, `lignes` est VIDE et l'écran affiche un état vide explicite
 * (`MESSAGE_VIDE_DIMENSION`). C'est le comportement attendu aujourd'hui pour
 * toutes les dimensions dont la clé étrangère est nulle en base (dispositif,
 * secteur, agence…) : le code est juste, il s'allumera seul quand la donnée
 * sera saisie.
 */

/* ------------------------------------------------------------------ *
 * Sortie                                                              *
 * ------------------------------------------------------------------ */

/** Filtres de la barre de filtres, tels que l'écran les tient en état. */
export interface RAPPORT_FILTRES_T {
  /** Clé de `PROJECT_STATUSES` (ex. `EN_SUIVI`). Chaîne vide = « Tous ». */
  statut?: string
  /**
   * Identifiant d'agence régionale, en chaîne. Dans ce système
   * « région » ≡ « agence régionale » : `/aej/agences-regionales` et
   * `/aej/division-regionale` renvoient les mêmes 33 entrées.
   */
  agenceId?: string
  /** Identifiant de dispositif (le « Guichet » de la maquette). */
  dispositifId?: string
}

/**
 * Une ligne de rapport, quelle que soit la source.
 * `montant` est ABSENT — et non pas `0` — quand la source n'en produit pas :
 * un zéro laisserait croire à un financement nul là où il s'agit d'une mesure
 * indisponible. C'est `aMontant` qui tranche l'affichage de la colonne.
 *
 * ⚠️ `n` est un nombre SIMPLE (jamais `undefined`) pour ne pas obliger les cinq
 * consommateurs — barres, donut, tableau, CSV, fiche — à gérer un cas absent
 * dans chaque calcul. En contrepartie, sa valeur n'a de sens QUE si `aNombre`
 * est vrai : quand il est faux, `n` vaut 0 par remplissage et NE DOIT PAS être
 * affiché (cf. `aNombre` dans `RAPPORT_DATA_T`).
 */
export interface RAPPORT_LIGNE_T {
  cle: string
  label: string
  n: number
  montant?: number
}

export interface RAPPORT_DATA_T {
  /** L'entrée de catalogue résolue — libellés, dimension, filtres applicables. */
  rapport: RAPPORT_TYPE_T
  lignes: RAPPORT_LIGNE_T[]
  /** Somme des dénombrements. Vaut 0 quand `aNombre` est faux — ne pas l'afficher alors. */
  totalN: number
  /** Somme des montants. Vaut 0 quand `aMontant` est faux — ne pas l'afficher alors. */
  totalMontant: number
  /**
   * L'API a-t-elle RÉELLEMENT fourni des montants pour ce rapport ?
   * Pilote l'affichage de la colonne « Montant engagé » de la maquette, du
   * donut « part du montant » et du choix de la mesure principale.
   *
   * « RÉELLEMENT fourni » signifie : au moins une ligne porte un montant LU
   * dans la réponse. Une liste de lignes sans clé de montant reconnaissable ne
   * suffit pas — sinon la colonne s'afficherait à « 0 F » partout, ce qui est
   * un chiffre inventé et non une mesure indisponible.
   */
  aMontant: boolean
  /**
   * Symétrique de `aMontant`, côté DÉNOMBREMENT : l'API a-t-elle réellement
   * fourni un nombre de dossiers pour ce rapport ?
   *
   * Vrai pour tous les rapports sauf, éventuellement, « par agence » / « par
   * région » : ce sont les deux seuls qui fusionnent DEUX agrégats distincts,
   * dont l'un peut manquer sans que l'autre manque. Pilote l'affichage de la
   * colonne « Nb dossiers », exactement comme `aMontant` pilote « Montant
   * engagé ». Faux ⇒ `n` et `totalN` ne veulent rien dire, ne les affichez pas.
   */
  aNombre: boolean
  isLoading: boolean
  isError: boolean
  /** Provenance exacte du chiffre, affichable pour la traçabilité. */
  sourceLabel: string
}

/* ------------------------------------------------------------------ *
 * Conversions défensives                                              *
 * ------------------------------------------------------------------ */

/**
 * Forme EXACTE sous laquelle Laravel sérialise un entier ou un DECIMAL :
 * `"110000"`, `"2783414198498.94"`, `"-1000.50"`. La virgule est acceptée en
 * séparateur décimal pour couvrir une éventuelle locale FR côté serveur.
 */
const FORME_NUMERIQUE_LARAVEL = /^-?\d+(\.\d+)?$/

/**
 * Laravel sérialise les DECIMAL en CHAÎNE (`"2783414198498.94"`) et les
 * compteurs tantôt en nombre, tantôt en chaîne. Toute lecture numérique passe
 * donc par ce garde-fou : jamais de `NaN` dans un total, jamais d'`undefined`
 * dans une largeur de barre.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ POURQUOI ON NE PASSE PLUS SYSTÉMATIQUEMENT PAR `toNumber`
 * ══════════════════════════════════════════════════════════════════════════
 * `toNumber` (src/helpers/numbers.ts) s'appuie sur `parseNumberInput`, qui
 * applique `.replace(/[^\d.]/g, '')` : le SIGNE MOINS est purement SUPPRIMÉ.
 * `toNumber('-1000.50')` renvoie donc `1000.5`, et une valeur négative
 * s'afficherait avec le signe inversé — dans un total, une largeur de barre, un
 * pourcentage ou un montant de fiche IMPRIMÉE, sans le moindre signal.
 * Les candidats existent réellement : `montant_recupere` de
 * `/dashboard/partenaires/evolution-remboursements` (régularisation, avoir), et
 * les clés de montant de `/dashboard/agences/financement-agence`, dont la forme
 * n'a jamais pu être relevée en live.
 *
 * Le helper n'est PAS corrigé à la source : il est préexistant, hors du
 * périmètre de ce lot, et il sert de normaliseur de SAISIE à des champs de
 * formulaire d'autres écrans, où l'effacement du `-` est un comportement
 * délibéré (on n'y saisit pas de montant négatif). Le corriger changerait le
 * comportement de ces écrans sans qu'ils l'aient demandé.
 *
 * La lecture se fait donc en deux temps :
 *  1. nombre natif, ou chaîne de la forme réelle des DECIMAL Laravel ⇒ lecture
 *     directe, SIGNE PRÉSERVÉ ;
 *  2. toute autre forme (chaîne déjà formatée, séparateurs de milliers, unité
 *     collée…) ⇒ repli sur `toNumber`, qui sait les nettoyer.
 */
export const nombreSur = (valeur: unknown): number => {
  // Cas 1a — nombre natif. `toNumber(-1000)` renvoyait 1000 lui aussi : le
  // helper sérialise son argument en chaîne avant de le nettoyer.
  if (typeof valeur === 'number') return Number.isFinite(valeur) ? valeur : 0

  if (typeof valeur === 'string') {
    // Cas 1b — chaîne numérique brute, telle que l'API la produit.
    const brut = valeur.trim().replace(',', '.')
    if (FORME_NUMERIQUE_LARAVEL.test(brut)) {
      const n = Number(brut)
      return Number.isFinite(n) ? n : 0
    }
  }

  // Cas 2 — formes exotiques : le helper partagé reste le meilleur outil.
  return toNumber(valeur as string | number | null | undefined) ?? 0
}

/** Libellés français des 14 statuts — source unique : `PROJECT_STATUSES`. */
const LIBELLES_STATUT = new Map<string, string>(
  PROJECT_STATUSES.map((s) => [s.key as string, s.label]),
)

/** Statut inconnu ⇒ on affiche la clé brute plutôt que de masquer la ligne. */
const libelleStatut = (cle: string): string => LIBELLES_STATUT.get(cle) ?? cle

/** Comparaison de libellés insensible à la casse et aux accents. */
const normaliserTexte = (valeur: string): string =>
  valeur
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()

/* ------------------------------------------------------------------ *
 * Lecture TOLÉRANTE des agrégats « par agence »                       *
 * ------------------------------------------------------------------ *
 * `/dashboard/agences/projets-agence` et `/financement-agence` répondent
 * `{"data":[]}` aujourd'hui : leurs clés n'ont JAMAIS pu être relevées en live.
 * Plutôt que de figer un contrat inventé — qui casserait l'écran le jour où la
 * donnée arrivera sous un autre nom —, on lit la PREMIÈRE clé présente parmi
 * les noms plausibles au vu des conventions des autres endpoints `/dashboard/*`.
 * Ce n'est pas une donnée devinée : c'est une lecture robuste d'une donnée
 * réelle dont seul le nom de colonne est incertain.
 */

const CLES_ID_AGENCE = ['agence_id', 'id'] as const
const CLES_LABEL_AGENCE = ['agence', 'nom', 'libelle', 'nom_agence', 'agence_nom', 'code'] as const
const CLES_NOMBRE_AGENCE = ['nombre_projets', 'nombre', 'count', 'total', 'nb_projets'] as const
const CLES_MONTANT_AGENCE = [
  'montant',
  'montant_finance',
  'montant_financé',
  'montant_engage',
  'montant_engagé',
  'montant_total',
  'total_montant',
] as const

const premiereChaine = (
  ligne: Record<string, unknown>,
  cles: readonly string[],
): string | null => {
  for (const cle of cles) {
    const valeur = ligne[cle]
    if (typeof valeur === 'string' && valeur.trim() !== '') return valeur.trim()
  }
  return null
}

const premierNombre = (
  ligne: Record<string, unknown>,
  cles: readonly string[],
): number | null => {
  for (const cle of cles) {
    const valeur = ligne[cle]
    if (valeur === undefined || valeur === null || valeur === '') continue
    const n = toNumber(valeur as string | number)
    if (n !== null) return n
  }
  return null
}

interface LIGNE_AGENCE_T {
  cle: string
  label: string
  /**
   * `null` = AUCUNE des clés attendues n'était présente sur la ligne, donc la
   * mesure est INCONNUE. C'est volontairement distinct de `0`, qui signifie
   * « la source a répondu zéro ». Confondre les deux reviendrait à afficher un
   * financement nul là où l'on ne sait simplement pas lire la colonne — le
   * chiffre inventé que la règle d'arbitrage interdit.
   */
  valeur: number | null
}

/**
 * Normalise une ligne d'agrégat par agence. Renvoie `null` si la ligne ne porte
 * ni identifiant ni libellé exploitable : mieux vaut l'écarter que de lui
 * fabriquer un nom, ce qui reviendrait à afficher une donnée inventée.
 */
const normaliserLigneAgence = (
  brut: unknown,
  clesValeur: readonly string[],
): LIGNE_AGENCE_T | null => {
  if (brut === null || typeof brut !== 'object') return null
  const ligne = brut as Record<string, unknown>
  const id = premierNombre(ligne, CLES_ID_AGENCE)
  const nom = premiereChaine(ligne, CLES_LABEL_AGENCE)
  if (id === null && nom === null) return null
  return {
    // La jointure nombre ↔ montant se fait sur l'identifiant quand il existe,
    // sinon sur le libellé normalisé : les deux endpoints décrivent les mêmes
    // 33 agences, ils doivent produire la même clé.
    cle: id !== null ? String(id) : normaliserTexte(nom as string),
    label: nom ?? `Agence #${id}`,
    // Pas de `?? 0` ici : la nuance « inconnue » vs « nulle » est remontée
    // telle quelle à l'appelant, qui seul sait quoi en faire.
    valeur: premierNombre(ligne, clesValeur),
  }
}

/* ------------------------------------------------------------------ *
 * Le moteur                                                           *
 * ------------------------------------------------------------------ */

export function useRapportData(
  cle: RAPPORT_CLE_T,
  filtres: RAPPORT_FILTRES_T = {},
): RAPPORT_DATA_T {
  // Clé inconnue (URL bidouillée, état obsolète) ⇒ repli sur le rapport par
  // défaut plutôt qu'un écran cassé.
  const rapport = RAPPORTS_PAR_CLE[cle] ?? RAPPORTS_PAR_CLE[RAPPORT_PAR_DEFAUT]

  // Un filtre n'est transmis QUE s'il est applicable à ce rapport. La chaîne
  // vide (« Tous ») devient `undefined` : elle ne doit ni partir sur le réseau,
  // ni entrer dans la clé de cache.
  const estApplicable = (f: RAPPORT_FILTRE_T) => filtreEstApplicable(rapport, f)
  const statutActif = estApplicable('statut') ? filtres.statut || undefined : undefined
  const agenceActive = estApplicable('region') ? filtres.agenceId || undefined : undefined
  const dispositifActif = estApplicable('dispositif')
    ? filtres.dispositifId || undefined
    : undefined

  const estParStatut = rapport.cle === 'par_statut'
  const estParAgence = rapport.cle === 'par_agence' || rapport.cle === 'par_region'
  const estComptage = rapport.source === 'COMPTAGE'

  /* --- Sources d'AGRÉGATION -------------------------------------- *
   * Tous les hooks sont appelés à chaque rendu (règle des hooks) mais
   * `enabled` coupe le réseau : seul le rapport sélectionné déclenche
   * réellement une requête.                                          */
  const qStatut = dashboardServices.useProjetsParStatut(
    { statut: statutActif, agence_id: agenceActive },
    estParStatut,
  )
  const qProjetsAgence = dashboardServices.useProjetsParAgence(estParAgence)
  const qFinancementAgence = dashboardServices.useFinancementParAgence(estParAgence)
  const qEmploisSecteur = dashboardServices.useEmploisParSecteur(
    rapport.cle === 'emplois_secteur',
  )
  const qTypesEmplois = dashboardServices.useTypesEmplois(rapport.cle === 'emplois_type')
  const qTopRecruteuses = dashboardServices.useTopRecruteuses(
    rapport.cle === 'top_recruteuses',
  )

  /**
   * Référentiel des agences : sert à résoudre le filtre « Région » côté client
   * sur les agrégats par agence. Chargé via le service dédié pour PARTAGER le
   * cache avec la barre de filtres de l'écran — aucune requête supplémentaire.
   */
  const qAgences = agenceRegionaleServices.useGetAll()

  /**
   * Référentiel des SECTEURS. Passer une chaîne vide DÉSACTIVE la requête (cf.
   * `referentialsServices.useGetReferential`) : on ne télécharge les 49 secteurs
   * que si le rapport « par secteur » est effectivement affiché.
   *
   * ⚠️ Ce service générique est réservé à `/aej/secteurs`, le SEUL référentiel
   * du catalogue qui n'ait pas de service dédié dans le dépôt.
   */
  const qSecteurs = referentialsServices.useGetReferential(
    rapport.cle === 'par_secteur' ? '/aej/secteurs' : '',
  )

  /**
   * Référentiel des DISPOSITIFS (« guichets »).
   *
   * ── Pourquoi PAS `useGetReferential('/dispositifs')` ──
   * Il produisait la clé de cache `['referential', '/dispositifs']`, alors que
   * la barre de filtres de l'écran lit le MÊME endpoint via
   * `dispositifServices.useGetAll()` → clé `['dispositifs']`. Deux entrées de
   * cache distinctes pour une ressource unique, donc DEUX requêtes réseau
   * simultanées dès que le rapport « par guichet » était sélectionné, avec deux
   * `staleTime` divergents (30 min ici, défaut là-bas).
   *
   * On appelle donc le service dédié, exactement comme pour les agences
   * ci-dessus : une seule entrée de cache, aucune requête supplémentaire. Ce
   * hook n'a pas de paramètre `enabled`, mais c'est sans conséquence : la barre
   * de filtres de l'écran le monte déjà de façon inconditionnelle, la requête
   * est donc émise de toute façon — et une seule fois.
   */
  const qDispositifs = dispositifServices.useGetAll()

  /**
   * État de chargement du référentiel de la dimension COMPTÉE, quel que soit le
   * service qui le fournit. Les autres rapports n'attendent aucun référentiel.
   */
  const qDimension =
    rapport.cle === 'par_dispositif'
      ? { isLoading: qDispositifs.isLoading, isError: qDispositifs.isError }
      : rapport.cle === 'par_secteur'
        ? { isLoading: qSecteurs.isLoading, isError: qSecteurs.isError }
        : { isLoading: false, isError: false }

  /* --- Source de COMPTAGE PARALLÈLE ------------------------------- *
   * Un bucket = une valeur de la dimension = une requête `per_page=1`.
   * Tableau vide ⇒ aucune requête émise.                              */
  const secteurs = qSecteurs.data
  const dispositifs = qDispositifs.data
  const buckets = useMemo<COUNT_BUCKET_T[]>(() => {
    if (rapport.cle === 'par_dispositif') {
      const tous = (dispositifs ?? []).map((item) => ({
        cle: String(item.id),
        label: item.intitule,
        filtres: { dispositif_id: item.id },
      }))
      /**
       * Filtrage par la DIMENSION ANALYSÉE (cf. la règle homogène du
       * catalogue). Il ne peut pas passer par `filtresTransverses` : dans
       * `useCounts`, les filtres du bucket ÉCRASENT les filtres transverses —
       * `dispositif_id` du bucket l'emporterait, et le filtre choisi par
       * l'utilisateur serait silencieusement ignoré. On le traduit donc en
       * restriction de la liste des buckets, ce qui produit exactement le
       * résultat d'un `?dispositif_id=…` côté serveur : une seule ligne.
       */
      return dispositifActif ? tous.filter((b) => b.cle === dispositifActif) : tous
    }
    if (rapport.cle === 'par_secteur') {
      // `refLabel` résout `libelle` (secteurs) comme `intitule` : les endpoints
      // `/aej/*` ne nomment pas tous leur étiquette de la même façon.
      return (secteurs ?? []).map((item) => ({
        cle: String(item.id),
        label: refLabel(item),
        filtres: { secteur_id: item.id },
      }))
    }
    if (rapport.cle === 'par_stade') {
      return STADES_PROJET.map((s) => ({
        cle: s.cle,
        label: s.label,
        filtres: { stade_projet: s.cle },
      }))
    }
    if (rapport.cle === 'par_type') {
      return TYPES_PORTAGE.map((t) => ({
        cle: t.cle,
        label: t.label,
        filtres: { type_projet: t.cle },
      }))
    }
    return []
  }, [rapport.cle, dispositifs, secteurs, dispositifActif])

  /**
   * Filtres TRANSVERSES du comptage. `dispositif_id` y figure pour les rapports
   * dont le guichet n'est PAS la dimension analysée (secteur, stade, type) ;
   * sur `par_dispositif` il a déjà été appliqué en restreignant les buckets
   * ci-dessus, et la valeur transmise ici est identique à celle du bucket — le
   * doublon est donc sans effet.
   */
  const comptages = projetsServices.useCounts(buckets, {
    statut: statutActif,
    agence_id: agenceActive,
    dispositif_id: dispositifActif,
  })

  /* --- Normalisation ---------------------------------------------- *
   * Calcul direct, sans `useMemo` : au plus quelques dizaines de lignes
   * à trier, pour un tableau de dépendances qui serait long et fragile. */
  let lignes: RAPPORT_LIGNE_T[] = []
  let aMontant = false
  /**
   * Vrai par DÉFAUT, à l'inverse de `aMontant` : toutes les autres sources du
   * catalogue ont été observées en live et portent toutes un dénombrement à un
   * nom connu (`count`, `nombre`, `nombre_emplois`, `pagination.total`). Seule
   * la fusion des deux agrégats « par agence » peut le faire retomber à faux,
   * parce que la forme de ces deux endpoints-là n'a jamais pu être relevée.
   */
  let aNombre = true
  let isLoading = false
  let isError = false

  if (estParStatut) {
    isLoading = qStatut.isLoading
    isError = qStatut.isError
    // `{ statut, count }` : un dénombrement, jamais un montant.
    lignes = (qStatut.data ?? []).map((r) => ({
      cle: r.statut,
      label: libelleStatut(r.statut),
      n: nombreSur(r.count),
    }))
  } else if (estParAgence) {
    isLoading = qProjetsAgence.isLoading || qFinancementAgence.isLoading

    /**
     * ── Pourquoi PAS `&&` entre les deux `isError` ──
     * Ce rapport fusionne DEUX agrégats indépendants, mais un ET logique rendait
     * l'écran INCAPABLE de signaler une panne : `/financement-agence` répond
     * `{"data":[]}` avec un 200 (état réel du 30/08/2026), donc un
     * `/projets-agence` en échec donnait `true && false === false`, une liste
     * vide, et l'écran affichait « Aucune donnée pour cette dimension… » —
     * c'est-à-dire une explication FAUSSE et rassurante devant une panne serveur
     * (500, coupure réseau, session expirée).
     *
     * Le DÉNOMBREMENT est la source principale des deux rapports (« Activité par
     * agence » comme « Financement par région » listent d'abord des agences) :
     * son échec est l'échec du rapport, et il doit se voir comme tel. L'échec
     * des MONTANTS, lui, reste une dégradation partielle : il fait retomber
     * `aMontant` à faux et le rapport demeure juste, exprimé en dossiers.
     */
    isError = qProjetsAgence.isError

    /**
     * Une requête EN ÉCHEC ne produit RIEN : ni ligne, ni valeur de
     * remplacement. Sans ce garde-fou, des montants arrivés seuls auraient
     * fabriqué des lignes à `n: 0` — un « Total général : 0 dossiers » calculé
     * à partir d'une source en erreur, exactement ce que l'arbitrage interdit.
     * (`data` vaut aussi `undefined` pendant le chargement, mais ce cas-là est
     * couvert par `isLoading`, qui court-circuite l'affichage des lignes.)
     */
    const nombres = qProjetsAgence.isError
      ? []
      : (qProjetsAgence.data ?? [])
          .map((r) => normaliserLigneAgence(r, CLES_NOMBRE_AGENCE))
          .filter((r): r is LIGNE_AGENCE_T => r !== null)
    const montants = qFinancementAgence.isError
      ? []
      : (qFinancementAgence.data ?? [])
          .map((r) => normaliserLigneAgence(r, CLES_MONTANT_AGENCE))
          .filter((r): r is LIGNE_AGENCE_T => r !== null)

    /**
     * « L'API a RÉELLEMENT fourni des montants » — et non « l'API a renvoyé des
     * lignes ». La nuance est capitale : la forme de `/financement-agence` n'a
     * jamais pu être relevée en live (réponse vide), donc le nom de sa colonne
     * de montant est incertain (cf. `CLES_MONTANT_AGENCE`, liste plausible).
     * Le jour où la donnée arrivera sous un nom non anticipé
     * (`montant_alloue`, `somme_financement`…), `valeur` vaudrait `null` sur
     * TOUTES les lignes ; activer la colonne afficherait alors « 0 F » sur les
     * 33 agences, un donut à 0 %, et une fiche IMPRIMÉE annonçant « un montant
     * total engagé de 0 F ». Un chiffre inventé qui circule hors de
     * l'application est pire qu'un état vide : on n'active donc la mesure que
     * si AU MOINS UN montant a été effectivement lu.
     */
    aMontant = montants.some((l) => l.valeur !== null)

    /** Exactement le même raisonnement, côté dénombrement. */
    aNombre = nombres.some((l) => l.valeur !== null)

    const parCle = new Map<string, RAPPORT_LIGNE_T>()
    for (const l of nombres) {
      parCle.set(l.cle, {
        cle: l.cle,
        label: l.label,
        // `?? 0` de remplissage : la ligne existe (l'agence est bien listée),
        // seul son compte est illisible. C'est `aNombre` — faux dans ce cas —
        // qui empêche ce zéro d'être présenté comme un dénombrement.
        n: l.valeur ?? 0,
        ...(aMontant ? { montant: 0 } : {}),
      })
    }
    for (const l of montants) {
      // Montant illisible : rien à fusionner, et surtout pas un `0` qui se
      // ferait passer pour un financement nul.
      if (l.valeur === null) continue
      const existante = parCle.get(l.cle)
      if (existante) {
        existante.montant = l.valeur
        continue
      }
      /**
       * Agence financée que l'agrégat des dossiers ne liste pas.
       *  - Si cet agrégat a RÉPONDU, son silence sur cette agence se lit
       *    « 0 dossier compté » : la ligne est créée avec `n: 0`, qui est bien
       *    la réponse de la source et non une invention.
       *  - S'il est EN ÉCHEC, on ne sait rien de ce compte : la ligne n'est pas
       *    créée du tout. Le rapport est déjà en erreur (`isError`), il ne doit
       *    pas en plus laisser derrière lui des lignes à « 0 dossier » qui
       *    partiraient telles quelles dans un CSV ou une fiche imprimée.
       */
      if (!qProjetsAgence.isError) {
        parCle.set(l.cle, { cle: l.cle, label: l.label, n: 0, montant: l.valeur })
      }
    }
    lignes = [...parCle.values()]

    // Filtre « Région » appliqué CÔTÉ CLIENT : l'endpoint n'accepte aucun
    // paramètre vérifiable, et il renvoie au plus 33 lignes — le coût est nul.
    if (agenceActive) {
      isLoading = isLoading || qAgences.isLoading
      const selection = (qAgences.data ?? []).find((a) => String(a.id) === agenceActive)
      const nomSelection = selection ? normaliserTexte(selection.nom) : null
      lignes = lignes.filter(
        (l) =>
          l.cle === agenceActive ||
          (nomSelection !== null && normaliserTexte(l.label) === nomSelection),
      )
    }
  } else if (rapport.cle === 'emplois_secteur') {
    isLoading = qEmploisSecteur.isLoading
    isError = qEmploisSecteur.isError
    lignes = (qEmploisSecteur.data ?? []).map((r, i) => ({
      // `secteur` est nullable et vaut `null` aujourd'hui : nommer explicitement
      // ce vide est la traduction honnête d'un NULL, pas une donnée inventée.
      cle: r.secteur ?? `sans-secteur-${i}`,
      label: r.secteur ?? 'Secteur non renseigné',
      n: nombreSur(r.nombre_emplois),
    }))
  } else if (rapport.cle === 'emplois_type') {
    isLoading = qTypesEmplois.isLoading
    isError = qTypesEmplois.isError
    lignes = (qTypesEmplois.data ?? []).map((r, i) => ({
      cle: r.type_emploi ?? `sans-type-${i}`,
      label: r.type_emploi ?? 'Type non renseigné',
      n: nombreSur(r.nombre),
    }))
  } else if (rapport.cle === 'top_recruteuses') {
    isLoading = qTopRecruteuses.isLoading
    isError = qTopRecruteuses.isError
    lignes = (qTopRecruteuses.data ?? []).map((r) => ({
      cle: String(r.id),
      label: r.raison_sociale,
      n: nombreSur(r.nombre_emplois),
    }))
  } else if (estComptage) {
    // Le référentiel de la dimension doit être chargé avant que les comptages
    // aient un sens : tant qu'il l'est, la répartition serait partielle.
    isLoading = qDimension.isLoading || comptages.isLoading
    isError = qDimension.isError || comptages.isError
    lignes = comptages.rows.map((r) => ({ cle: r.cle, label: r.label, n: r.n }))
  }

  /**
   * Les lignes à zéro sont retirées : dans un rapport de RÉPARTITION elles
   * pèsent 0 %, n'apparaissent ni dans le donut ni dans les barres, et
   * allongeraient le détail chiffré de 49 secteurs vides. C'est aussi ce qui
   * fait que l'écran bascule proprement sur l'état vide explicite tant que les
   * clés étrangères ne sont pas saisies en base.
   *
   * Corollaire : une ligne dont les DEUX mesures sont inconnues (`aNombre` et
   * `aMontant` faux) disparaît elle aussi, et l'écran affiche l'état vide plutôt
   * qu'une liste de libellés sans un seul chiffre.
   */
  const mesurePrincipale = (l: RAPPORT_LIGNE_T) => (aMontant ? (l.montant ?? 0) : l.n)
  lignes = lignes
    .filter((l) => l.n > 0 || (l.montant ?? 0) > 0)
    .sort(
      (a, b) =>
        mesurePrincipale(b) - mesurePrincipale(a) ||
        // Départage stable à mesure égale : évite que l'ordre saute d'un rendu
        // à l'autre quand plusieurs lignes portent la même valeur.
        a.label.localeCompare(b.label, 'fr'),
    )

  // Chaque total suit sa propre disponibilité : sommer des zéros de remplissage
  // produirait un « Total général » présenté comme un fait mesuré.
  const totalN = aNombre ? lignes.reduce((somme, l) => somme + l.n, 0) : 0
  const totalMontant = aMontant
    ? lignes.reduce((somme, l) => somme + (l.montant ?? 0), 0)
    : 0

  return {
    rapport,
    lignes,
    totalN,
    totalMontant,
    aMontant,
    aNombre,
    isLoading,
    isError,
    sourceLabel: rapport.sourceLabel,
  }
}
