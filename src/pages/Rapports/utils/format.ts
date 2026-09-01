/**
 * FORMATEURS DE L'ÉCRAN « Rapports & analyses »
 * =============================================
 * Un seul endroit pour toutes les mises en forme chiffrées de la page, parce
 * qu'elles doivent être RIGOUREUSEMENT identiques dans les quatre sorties :
 * les barres, le donut, le détail chiffré, l'export CSV et la fiche de
 * synthèse. Un écart de formatage entre l'écran et la fiche imprimée serait lu
 * comme un écart de chiffre.
 *
 * ── Réutilisation, pas réinvention ──
 * Le dépôt possède déjà deux formateurs officiels, on les branche ici :
 *   • `formatNumber` (src/helpers/numbers.ts) — groupage des milliers fr-FR ;
 *   • `money`        (src/pages/EspacePartenaireFinancier/utils/money.ts) —
 *     `Intl.NumberFormat('fr-FR') + ' F'`, c'est-à-dire EXACTEMENT le
 *     `money = n => fmt(Math.round(n)) + ' F'` de la maquette (l. 4606).
 * L'import inter-feature est assumé : dupliquer une fonction de trois lignes
 * ferait diverger deux écrans qui doivent afficher le même montant.
 */
import { formatNumber } from '@/helpers/numbers'
import { money } from '@/pages/EspacePartenaireFinancier/utils/money'

/**
 * Dénombrement affichable.
 *
 * ⚠️ ARBITRAGE ASSUMÉ vs maquette : la maquette écrit `r.n` BRUT, sans
 * séparateur de milliers (`11059`). Elle travaillait sur une base de
 * démonstration à deux chiffres ; l'API réelle renvoie des comptages à cinq et
 * six chiffres (110 000 micro-projets, 11 059 brouillons). Sans séparateur, la
 * colonne devient illisible et invite à l'erreur de lecture d'un facteur 10.
 * On applique donc le groupage fr-FR du dépôt.
 */
export const formatEntier = (valeur: number): string => formatNumber(Math.round(valeur))

/**
 * Montant en francs : `12 345 678 F`, arrondi à l'entier comme la maquette.
 *
 * ⚠️ NOM DÉLIBÉRÉMENT DIFFÉRENT de `formatMontant`. Le dépôt exporte déjà un
 * `formatMontant(montant: string | null, devise: string | null)` dans
 * `@/helpers/numbers`, de signature ET de sortie différentes (il suffixe la
 * devise et renvoie `null` sur entrée vide). Deux fonctions publiques homonymes
 * dans l'espace des imports, c'est la certitude qu'un import automatique
 * ramènera un jour l'une pour l'autre — et le compilateur ne le signalera que
 * si l'arité diffère à l'appel. L'enveloppe LOCALE porte donc un nom propre ;
 * le helper partagé, lui, n'est pas touché : d'autres écrans en dépendent.
 */
export const montantF = (valeur: number): string => money(Math.round(valeur))

/**
 * Format « X.XXM » de la maquette : deux décimales, point décimal anglo-saxon,
 * pas d'espace avant le `M`. Conservé À L'IDENTIQUE — c'est une étiquette de
 * barre très courte, où la virgule décimale française et un espace insécable
 * casseraient l'alignement monospace prévu par la maquette.
 */
export const formatMillions = (valeur: number): string => `${(valeur / 1e6).toFixed(2)}M`

/**
 * Part entière en pourcentage. Le garde `total ? … : 0` reprend la maquette :
 * un total nul ne doit jamais produire `NaN%`. Les arrondis étant indépendants,
 * la somme des parts peut ne pas faire exactement 100 — c'est le comportement
 * de la maquette, et il est visible dans la ligne « Total général » qui affiche
 * toujours `100%`.
 */
export const partPourcent = (valeur: number, total: number): number =>
  total ? Math.round((valeur / total) * 100) : 0

export interface CENTRE_DONUT_T {
  valeur: string
  sousTitre: string
}

/**
 * Valeur et sous-titre affichés au centre du donut.
 *
 * ── Deux corrections assumées par rapport à la maquette ──
 * 1. La maquette bascule sur « MILLIONS F » dès que le total dépasse le
 *    million, QUELLE QUE SOIT la mesure. Ici le donut peut représenter un
 *    NOMBRE de dossiers (cas majoritaire, l'API n'agrège aucun montant par
 *    dimension) : afficher « MILLIONS F » sous un comptage de dossiers
 *    inventerait une unité monétaire. Le sous-titre reste donc « TOTAL » tant
 *    que la mesure n'est pas un montant.
 * 2. La maquette applique `fmt()` (soit `toLocaleString('fr-FR')`) au RÉSULTAT
 *    de `toFixed(1)`, c'est-à-dire à une CHAÎNE : `String.toLocaleString` la
 *    renvoie inchangée, d'où un « 123.4 » sans séparateur et à point décimal
 *    au milieu d'une interface française. Le bug est corrigé ici par un
 *    `Intl.NumberFormat` appliqué au NOMBRE : « 2 783,4 ».
 */
export function centreDonut(total: number, aMontant: boolean): CENTRE_DONUT_T {
  if (aMontant && total >= 1e6) {
    return {
      valeur: new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(total / 1e6),
      sousTitre: 'MILLIONS F',
    }
  }
  return { valeur: formatEntier(total), sousTitre: 'TOTAL' }
}

/**
 * En-tête de la colonne de dénombrement : « Nb dossiers » ou « Nb emplois ».
 *
 * ⚠️ ARBITRAGE vs maquette : elle écrit « Nb projets » en dur. Trois rapports
 * du catalogue dénombrent des EMPLOIS et non des dossiers (« Emplois créés par
 * secteur », « Emplois par type de contrat », « Top entreprises recruteuses ») :
 * un en-tête « Nb projets » y serait un contresens. L'unité est donc lue sur le
 * catalogue (`uniteN`), seule source de vérité de ce qui est compté.
 */
export const enteteNb = (uniteN: string): string => `Nb ${uniteN}`
