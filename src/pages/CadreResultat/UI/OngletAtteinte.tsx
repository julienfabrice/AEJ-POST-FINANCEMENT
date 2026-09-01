import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  cibleIndicateurServices,
  indicateurCadreResultatServices,
  suiviIndicateurServices,
} from '@/services/cadreResultat.services'
import { CADRE_RESULTAT_API_PRETE, MESSAGE_BANDEAU_API_NON_BRANCHEE } from '../constants'
import { anneeDe, formatValeur, tauxAtteinte, versNombre } from '../utils/format'
import { BarreTaux } from './BarreTaux'

/**
 * ONGLET DE SYNTHÈSE « Atteinte des cibles » — la raison d'être du module.
 *
 * Les cinq autres onglets SAISISSENT (l'arborescence, les indicateurs, leurs
 * cibles annuelles, leurs réalisations) ; celui-ci ne saisit rien et se
 * contente de RAPPROCHER, pour un exercice donné, la cible annuelle de chaque
 * indicateur du cumul de ses réalisations. C'est la seule vue du module qui
 * réponde à la question « où en est-on ? ».
 *
 * ══════════════════════════════════════════════════════════════════════
 *  LES QUATRE DÉCISIONS DE CALCUL, ET POURQUOI
 * ══════════════════════════════════════════════════════════════════════
 *
 * 1. LA CIBLE D'UN INDICATEUR EST UNE SOMME, pas une lecture.
 *    La contrainte d'unicité de `cibles_indicateur_cadre_resultat` porte sur
 *    (indicateur, programme, UG, année) : un MÊME indicateur peut donc avoir
 *    PLUSIEURS cibles pour le MÊME exercice, une par programme et par unité de
 *    gestion. Prendre « la » cible reviendrait à choisir arbitrairement l'une
 *    d'elles et à sous-estimer l'objectif de tous les autres programmes. On
 *    cumule, exactement comme on cumule les réalisations — les deux membres du
 *    rapport sont ainsi agrégés sur le même périmètre.
 *
 * 2. LE RÉALISÉ EST UNE SOMME DÉFENSIVE.
 *    `valeur_realisee_istr` et `valeur_cible_indcateur_istr` sont des NUMERIC
 *    que Laravel sérialise en CHAÎNE : additionnées telles quelles, « 12 » et
 *    « 30 » donneraient « 1230 ». `versNombre` ramène chaque terme à un nombre
 *    fini (jamais `NaN`, jamais de signe perdu — cf. `utils/format`).
 *
 * 3. DIVISION PAR ZÉRO PROTÉGÉE — « — », jamais « 0 % » ni « ∞ ».
 *    Une cible absente pour l'exercice, ou une cible cumulée nulle, ne permet
 *    AUCUN taux interprétable : `tauxAtteinte` renvoie `null` et `BarreTaux`
 *    affiche un cadratin. Écrire « 0 % » se lirait comme une contre-performance
 *    de l'équipe alors qu'il n'y a simplement rien à comparer, et c'est le
 *    genre de chiffre qui se retrouve dans un rapport de pilotage.
 *
 * 4. LA BARRE EST BORNÉE À 100 %, LA VALEUR AFFICHÉE NE L'EST PAS.
 *    Distinction portée par `BarreTaux` et volontairement conservée ici : le
 *    REMPLISSAGE est plafonné parce qu'un rectangle ne peut pas dépasser sa
 *    piste sans casser la mise en page, mais le NOMBRE reste brut (« 142 % »).
 *    Plafonner le nombre effacerait le dépassement de cible, c'est-à-dire
 *    précisément l'information qu'un pilote cherche sur cet écran.
 *
 * ══════════════════════════════════════════════════════════════════════
 *  PAS DE LIGNE DE TOTAL — abstention assumée
 * ══════════════════════════════════════════════════════════════════════
 * Un pied « total réalisé / total cible » serait FAUX ici. Les indicateurs d'un
 * cadre de résultat n'ont pas d'unité commune : la table
 * `indicateurs_cadre_resultat` ne porte d'ailleurs aucune colonne d'unité qui
 * permettrait seulement de le vérifier. Additionner des bénéficiaires, des
 * hectares et des pourcentages produirait un nombre sans référent, et le « taux
 * global » qu'on en tirerait serait dominé par l'indicateur aux plus gros
 * ordres de grandeur. Un taux moyen non pondéré serait tout aussi trompeur (il
 * donnerait le même poids à un indicateur national et à un indicateur de
 * détail). L'écran s'en tient donc au dénombrement des lignes, seule
 * agrégation exacte disponible.
 *
 * ── État vide ──
 * C'est le cas NORMAL tant que l'API du module n'est pas branchée : les trois
 * lectures sont `enabled: false` et renvoient `[]`. L'onglet le dit avec les
 * mots du bandeau de la page plutôt qu'en affirmant « aucun indicateur
 * enregistré », qui serait une information sur les DONNÉES là où il n'y a
 * qu'une attente de BRANCHEMENT.
 */

/* ------------------------------------------------------------------ *
 * Vocabulaire visuel                                                  *
 * ------------------------------------------------------------------ *
 * Mêmes classes que les cartes de synthèse déjà livrées (`RapportsPage`), qui
 * traduisent les `.card/.hd` de la maquette. `py-0 gap-0` neutralise le
 * `py-6`/`gap-6` par défaut du composant `Card` : la maquette ne met aucun
 * padding sur la carte elle-même, tout est porté par l'en-tête et le corps. */
const CARTE_CLASS = 'gap-0 rounded-[7px] border-[#E5EAF1] py-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
const ENTETE_CLASS = 'flex flex-wrap items-center gap-3 border-b border-[#EEF2F7] px-4 py-3'
const TITRE_CLASS = 'text-[14px] font-bold text-[#131C29]'

/**
 * Déclencheur du sélecteur d'exercice — bordure et rayon de `.field select` de
 * la maquette (repris de `RapportsFilters`), en hauteur compacte : il vit dans
 * un en-tête de carte, pas dans une barre de filtres.
 *
 * ⚠️ La HAUTEUR n'est PAS dans cette chaîne : elle se règle par `size="sm"` sur
 * le déclencheur, et pas autrement. `SelectTrigger` porte
 * `data-[size=default]:h-9`, dont le sélecteur CSS compilé
 * (`.\[data-size\=default\]\:h-9[data-size=default]`) est plus SPÉCIFIQUE qu'un
 * simple `.h-8` — et `tailwind-merge` ne peut pas arbitrer, les deux classes
 * n'appartenant pas à la même clé (l'une est modifiée par un variant, l'autre
 * non). Un `h-8` écrit ici serait donc silencieusement sans effet : le
 * déclencheur resterait à 36 px. On passe par l'API de taille du composant,
 * qui déclare `data-[size=sm]:h-8` au même niveau de spécificité.
 */
const SELECT_CLASS =
  'w-[104px] rounded-[9px] border-[1.5px] border-[#E5EAF1] bg-white px-2.5 text-[13px] text-[#131C29] shadow-none focus-visible:border-[#E7722B] focus-visible:ring-[3px] focus-visible:ring-[#E7722B]/15'

/** Repli d'affichage — cadratin, comme dans tout le dépôt. */
const REPLI = '—'

/**
 * Identifiant du libellé « Exercice », relié au déclencheur par
 * `aria-labelledby` : le sélecteur n'affiche qu'un nombre, un lecteur d'écran
 * annoncerait « 2024, bouton » sans dire de quoi il s'agit.
 */
const ID_LABEL_EXERCICE = 'cadre-resultat-atteinte-exercice'

/** Une ligne de la synthèse : un indicateur confronté à son exercice. */
interface LIGNE_ATTEINTE_T {
  id: number
  code: string
  intitule: string
  /**
   * Cible cumulée de l'exercice, ou `null` quand AUCUNE cible n'a été saisie.
   * Distinct d'un `0` : « pas d'objectif fixé » et « objectif fixé à zéro » ne
   * se lisent pas de la même façon, même si les deux rendent le taux
   * incalculable.
   */
  cible: number | null
  /** Cumul des réalisations de l'exercice — `0` quand il n'y en a aucune. */
  realise: number
  /** Taux non borné, ou `null` s'il n'est pas calculable (cf. décision 3). */
  taux: number | null
}

interface Props {
  /**
   * Exercice choisi par l'utilisateur — `null` tant qu'il n'a rien choisi, la
   * valeur effective étant alors dérivée des cibles disponibles.
   *
   * ── Pourquoi une prop et pas un état local ──
   * Radix démonte le contenu des `TabsContent` inactifs (aucun `forceMount`).
   * Un état local serait donc détruit à chaque aller-retour vers un onglet de
   * saisie, et l'écran retomberait sur l'exercice le plus récent sans que
   * l'utilisateur ait rien demandé. L'intention doit survivre au démontage :
   * elle vit dans `CadreResultatPage`, au-dessus des onglets.
   */
  annee: number | null
  onAnneeChange: (annee: number) => void
}

export function OngletAtteinte({ annee: anneeSelectionnee, onAnneeChange }: Props) {
  // Les trois ressources du rapprochement. Aucune requête n'est émise tant que
  // `CADRE_RESULTAT_API_PRETE` est bas ; TanStack Query mutualise ensuite ces
  // lectures avec celles des onglets de grille, qui interrogent les mêmes clés.
  const {
    data: indicateurs = [],
    isLoading: chargementIndicateurs,
    isError: erreurIndicateurs,
  } = indicateurCadreResultatServices.useGetAll()
  const {
    data: cibles = [],
    isLoading: chargementCibles,
    isError: erreurCibles,
  } = cibleIndicateurServices.useGetAll()
  const {
    data: suivis = [],
    isLoading: chargementSuivis,
    isError: erreurSuivis,
  } = suiviIndicateurServices.useGetAll()

  // Une seule cellule vaut pour les trois : une synthèse partiellement chargée
  // afficherait des taux faux (des réalisations sans leurs cibles, ou
  // l'inverse), ce qui est pire qu'un instant de squelette.
  const isLoading = chargementIndicateurs || chargementCibles || chargementSuivis
  const isError = erreurIndicateurs || erreurCibles || erreurSuivis

  /**
   * Exercices proposés — DÉRIVÉS DES CIBLES, jamais codés en dur.
   *
   * Pourquoi les cibles et non les réalisations : cet onglet mesure l'atteinte
   * d'un OBJECTIF. Un exercice sans aucune cible ne produirait qu'une colonne
   * de cadratins, et l'ouvrir dans le sélecteur laisserait croire à une panne
   * de calcul. Les réalisations, elles, sont lues pour l'exercice choisi quel
   * qu'il soit — elles ne définissent simplement pas la liste.
   *
   * Aucune cible du tout (cas normal avant branchement) → l'année courante,
   * pour que le sélecteur ne soit jamais vide ni figé sur une année arbitraire.
   */
  const anneeCourante = new Date().getFullYear()
  const anneesDisponibles = useMemo(() => {
    const annees = new Set<number>()
    for (const cible of cibles) {
      const annee = anneeDe(cible.annee)
      if (annee !== null) annees.add(annee)
    }
    if (annees.size === 0) return [anneeCourante]
    // Décroissant : l'exercice en cours est celui qu'on consulte, pas le plus
    // ancien de l'historique.
    return [...annees].sort((a, b) => b - a)
  }, [cibles, anneeCourante])

  /**
   * Exercice affiché = choix de l'utilisateur, VALIDÉ contre la liste.
   *
   * L'état ne porte qu'une INTENTION (`null` = « pas encore choisi ») et la
   * valeur effective est dérivée à chaque rendu. Deux raisons :
   *  • les données arrivent APRÈS le premier rendu — un état initialisé sur la
   *    liste vide resterait bloqué sur l'année courante une fois les cibles
   *    chargées ;
   *  • synchroniser l'état dans un `useEffect` serait un `setState` dans un
   *    effet (cascade de rendus, et refus de `react-hooks/set-state-in-effect`).
   * La validation couvre aussi le cas où l'exercice choisi DISPARAÎT de la
   * liste (dernière cible de l'année supprimée dans un autre onglet).
   */
  // ⚠️ L'intention est REÇUE EN PROP, elle ne vit pas ici — voir l'en-tête du
  // composant. Radix démonte le contenu des onglets inactifs : un `useState`
  // local serait perdu dès que l'utilisateur passe sur un onglet de saisie et
  // revient, et l'exercice retomberait silencieusement sur le plus récent.
  const anneeActive =
    anneeSelectionnee !== null && anneesDisponibles.includes(anneeSelectionnee)
      ? anneeSelectionnee
      : (anneesDisponibles[0] ?? anneeCourante)

  /** Cible cumulée par indicateur pour l'exercice affiché (cf. décision 1). */
  const ciblesParIndicateur = useMemo(() => {
    const cumul = new Map<number, number>()
    for (const cible of cibles) {
      if (anneeDe(cible.annee) !== anneeActive) continue
      // ⚠️ `code_indicateur_istr` est ici un ENTIER pointant vers
      // `indicateurs_cadre_resultat.id_indicateur_str`, et NON le code textuel
      // « R002 » qui porte pourtant le même nom dans la table des indicateurs.
      const precedent = cumul.get(cible.code_indicateur_istr) ?? 0
      cumul.set(cible.code_indicateur_istr, precedent + versNombre(cible.valeur_cible_indcateur_istr))
    }
    return cumul
  }, [cibles, anneeActive])

  /** Réalisations cumulées par indicateur pour l'exercice affiché. */
  const realisesParIndicateur = useMemo(() => {
    const cumul = new Map<number, number>()
    for (const suivi of suivis) {
      // `Date_suivi` est une DATE de mesure : c'est son ANNÉE qui rattache la
      // réalisation à un exercice. `anneeDe` en lit les quatre premiers
      // caractères sans construire de `Date`, pour qu'un horodatage UTC ne
      // fasse pas basculer un 1er janvier sur l'exercice précédent.
      if (anneeDe(suivi.Date_suivi) !== anneeActive) continue
      const precedent = cumul.get(suivi.code_indicateur_istr) ?? 0
      cumul.set(suivi.code_indicateur_istr, precedent + versNombre(suivi.valeur_realisee_istr))
    }
    return cumul
  }, [suivis, anneeActive])

  /**
   * Une ligne par indicateur — y compris ceux SANS cible pour l'exercice.
   *
   * Les masquer rendrait invisible l'omission la plus coûteuse d'un cadre de
   * résultat : un indicateur suivi mais jamais planifié. Sa ligne s'affiche
   * donc avec « — » en cible et un taux vide, ce qui se voit immédiatement.
   */
  const lignes = useMemo<LIGNE_ATTEINTE_T[]>(() => {
    return indicateurs
      .map((indicateur) => {
        const cible = ciblesParIndicateur.get(indicateur.id_indicateur_str) ?? null
        const realise = realisesParIndicateur.get(indicateur.id_indicateur_str) ?? 0
        return {
          id: indicateur.id_indicateur_str,
          code: indicateur.code_indicateur_istr,
          intitule: indicateur.intitule_indicateur_istr,
          cible,
          realise,
          taux: tauxAtteinte(realise, cible),
        }
      })
      // Tri sur le CODE : c'est l'ordre de lecture d'un cadre de résultat
      // (« R001 », « R002 », « R010 »…), et l'ordre de la liste reçue n'est
      // garanti par aucun `ORDER BY`. `numeric` évite que « R10 » passe avant
      // « R2 ».
      .sort((a, b) => a.code.localeCompare(b.code, 'fr', { numeric: true }))
  }, [indicateurs, ciblesParIndicateur, realisesParIndicateur])

  /**
   * Aucune cible saisie pour l'exercice affiché alors que des indicateurs
   * existent : toute la colonne des taux sera vide, et il faut dire pourquoi —
   * sans quoi l'écran passerait pour cassé.
   */
  const aucuneCiblePourExercice = lignes.length > 0 && ciblesParIndicateur.size === 0

  return (
    <Card className={CARTE_CLASS}>
      <div className={ENTETE_CLASS}>
        <h2 className={TITRE_CLASS}>Atteinte des cibles</h2>
        {/* Dénombrement des lignes — seule agrégation exacte possible ici
            (cf. l'en-tête du fichier sur l'absence de ligne de total). */}
        {!isLoading && !isError && lignes.length > 0 && (
          <span className="text-[12px] text-[#8595A8]">
            {lignes.length} {lignes.length > 1 ? 'indicateurs' : 'indicateur'}
          </span>
        )}
        <div className="flex-1" />
        {/* Légende de l'ordre des deux chiffres : « 120 / 200 » est ambigu sans
            elle, et l'inversion réalisé/cible change complètement la lecture. */}
        <span className="hidden text-[12px] text-[#8595A8] sm:inline">réalisé / cible</span>
        <div className="flex items-center gap-2">
          <span id={ID_LABEL_EXERCICE} className="text-[12.5px] font-medium text-[#5A6B80]">
            Exercice
          </span>
          <Select
            value={String(anneeActive)}
            onValueChange={(valeur) => onAnneeChange(Number(valeur))}
          >
            <SelectTrigger
              size="sm"
              aria-labelledby={ID_LABEL_EXERCICE}
              className={SELECT_CLASS}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {anneesDisponibles.map((annee) => (
                <SelectItem key={annee} value={String(annee)}>
                  {annee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isError ? (
        <BlocErreur />
      ) : isLoading ? (
        <SqueletteSynthese />
      ) : lignes.length === 0 ? (
        <BlocVide />
      ) : (
        <div>
          {aucuneCiblePourExercice && (
            <p className="border-b border-[#F2F5F9] bg-[#F6F8FB] px-4 py-2.5 text-[12px] leading-snug text-[#5A6B80]">
              Aucune cible n&apos;est définie pour l&apos;exercice {anneeActive} : les taux
              d&apos;atteinte ne peuvent pas être calculés.
            </p>
          )}
          {lignes.map((ligne) => (
            <LigneAtteinte key={ligne.id} ligne={ligne} />
          ))}
        </div>
      )}
    </Card>
  )
}

/**
 * Une ligne = l'indicateur au-dessus, sa barre en dessous.
 *
 * Deux niveaux plutôt qu'une rangée de colonnes : les intitulés d'indicateurs
 * sont longs (colonne TEXT, pas VARCHAR) et une barre de progression a besoin
 * de toute la largeur pour rester comparable d'une ligne à l'autre. C'est la
 * disposition de l'onglet « Planification & taux » du dépôt, seul précédent
 * pour ce rapprochement.
 */
function LigneAtteinte({ ligne }: { ligne: LIGNE_ATTEINTE_T }) {
  return (
    <div className="space-y-2 border-b border-[#F2F5F9] px-4 py-3.5 last:border-b-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {/* Code en badge orange monospace — même convention que la colonne
            « Code » des grilles du module (`CodeBadgeCellRenderer`). */}
        <Badge className="shrink-0 border-0 bg-[#FBEADE] font-mono text-[11px] font-semibold text-[#C85E18] hover:bg-[#FBEADE]">
          {ligne.code}
        </Badge>
        <span className="text-[13.5px] font-semibold text-[#131C29]">{ligne.intitule}</span>
        <div className="flex-1" />
        <span className="font-mono text-[12.5px] whitespace-nowrap">
          <span className="font-semibold text-[#131C29]">{formatValeur(ligne.realise)}</span>
          <span className="text-[#8595A8]"> / </span>
          {/* Cible absente : cadratin, et non « 0 » — un objectif non fixé
              n'est pas un objectif nul. */}
          <span className="text-[#5A6B80]">
            {ligne.cible === null ? REPLI : formatValeur(ligne.cible)}
          </span>
        </span>
      </div>
      <BarreTaux taux={ligne.taux} />
    </div>
  )
}

/** Squelette de chargement — même gabarit que les cartes de `RapportsPage`. */
function SqueletteSynthese({ lignes = 5 }: { lignes?: number }) {
  return (
    <div className="space-y-5 p-4">
      {Array.from({ length: lignes }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-[52px]" />
            <Skeleton className="h-4 w-[220px]" />
            <div className="flex-1" />
            <Skeleton className="h-4 w-[90px]" />
          </div>
          <Skeleton className="h-[6px] w-full" />
        </div>
      ))}
    </div>
  )
}

/** Bloc d'erreur — repris de `SuiviPage` / `RapportsPage` pour rester homogène. */
function BlocErreur() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-16 text-red-600">
      <span className="text-sm font-medium">Impossible de charger la synthèse</span>
      <span className="max-w-[420px] text-center text-xs text-red-500">
        Les indicateurs, leurs cibles ou leurs réalisations n&apos;ont pas pu être lus. Réessayez
        dans un instant.
      </span>
    </div>
  )
}

/**
 * État vide EXPLICITE. Deux formulations, parce que les deux situations n'ont
 * rien à voir : tant que l'API n'est pas branchée, on ne sait RIEN des données
 * et affirmer « aucun indicateur enregistré » serait faux ; une fois branchée,
 * une liste vide est une vraie information sur la saisie.
 */
function BlocVide() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <span className="text-[13.5px] font-semibold text-[#243244]">
        Aucun indicateur à confronter
      </span>
      <span className="max-w-[460px] text-[12px] leading-relaxed text-[#5A6B80]">
        {CADRE_RESULTAT_API_PRETE
          ? "La synthèse se remplira dès qu'un indicateur et sa cible annuelle auront été enregistrés dans les onglets « Indicateurs » et « Cibles annuelles »."
          : MESSAGE_BANDEAU_API_NON_BRANCHEE}
      </span>
    </div>
  )
}
