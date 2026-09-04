import { formatNumber } from '@/helpers/numbers'

/**
 * CADRE DE RÉSULTAT — mises en forme chiffrées de l'écran.
 *
 * Un seul endroit pour tout ce qui touche aux NUMERIC du module, parce que la
 * même valeur est lue par trois surfaces qui doivent afficher STRICTEMENT la
 * même chose : la grille des cibles, la grille des réalisations et la synthèse
 * « Atteinte des cibles » (qui, elle, en fait en plus une arithmétique). Un
 * écart de formatage entre les deux serait lu comme un écart de chiffre.
 */

/**
 * NUMERIC de l'API → nombre exploitable, JAMAIS `NaN`.
 *
 * ── Pourquoi une conversion défensive est indispensable ici ──
 * `valeur_cible_indcateur_istr` et `valeur_realisee_istr` sont typés
 * `string | number` (cf. l'en-tête de `cadreResultat.types.ts`) : Laravel
 * sérialise les colonnes DECIMAL en CHAÎNE. Une addition directe produirait
 * une concaténation (« 12 » + « 30 » = « 1230 »), et un champ vide ou absent
 * produirait `NaN`, qui contaminerait ensuite tout le calcul de taux et
 * s'afficherait tel quel. On ramène donc toujours à un nombre fini, `0` par
 * défaut.
 *
 * ── Pourquoi PAS `toNumber` de `src/helpers/numbers.ts` ──
 * Le helper partagé existe et a été examiné en premier, comme il se doit. Il ne
 * convient pas ICI : son `parseNumberInput` filtre l'entrée par
 * `replace(/[^\d.]/g, '')`, ce qui SUPPRIME LE SIGNE MOINS. « -12.5 » y devient
 * « 12.5 ». Or les deux colonnes concernées sont des NUMERIC signés, et les
 * schémas zod du module autorisent explicitement les valeurs négatives (une
 * cible de variation peut mesurer une baisse). L'utiliser retournerait donc
 * silencieusement le signe d'une valeur légitime — l'erreur d'affichage la plus
 * grave possible sur un écran de pilotage. Le helper partagé n'est pas modifié
 * pour autant : il est correct pour son usage (saisie de MONTANTS, toujours
 * positifs) et d'autres écrans en dépendent.
 */
export function versNombre(valeur: string | number | null | undefined): number {
  if (typeof valeur === 'number') return Number.isFinite(valeur) ? valeur : 0
  if (valeur === null || valeur === undefined) return 0
  // Espaces (y compris l'insécable d'un copier-coller depuis un tableur) et
  // virgule décimale française : mêmes tolérances que le service, pour que ce
  // qui a pu être ENVOYÉ puisse toujours être RELU.
  const normalise = valeur.replace(/[\s\u00A0\u202F]/g, '').replace(',', '.')
  if (!normalise) return 0
  const converti = Number(normalise)
  return Number.isFinite(converti) ? converti : 0
}

/**
 * NUMERIC → texte groupé à la française (« 1 250,5 »).
 *
 * Le groupage des milliers vient de `formatNumber` (helper PARTAGÉ du dépôt) :
 * on ne réécrit pas une seconde règle de séparateur, qui finirait par diverger
 * de celle des autres écrans. Le SIGNE, lui, est réappliqué localement — pour
 * la raison exposée dans `versNombre`, `formatNumber` le perd.
 */
export function formatValeur(valeur: string | number | null | undefined): string {
  const nombre = versNombre(valeur)
  const signe = nombre < 0 ? '-' : ''
  return `${signe}${formatNumber(Math.abs(nombre))}`
}

/**
 * Taux d'atteinte en POURCENTAGE, arrondi à l'entier.
 *
 * ⚠️ NON BORNÉ : un dépassement de cible doit se VOIR (« 142 % »). C'est la
 * barre de progression, et elle seule, qui borne son remplissage à 100 % —
 * sans quoi elle déborderait de sa piste (cf. `BarreTaux`).
 *
 * Division par zéro protégée : une cible nulle ou absente ne peut produire
 * aucun taux interprétable. On renvoie `null` — et non `0` — pour que l'écran
 * puisse afficher « — » et non un « 0 % » qui se lirait comme une contre-
 * performance alors qu'il n'y a simplement rien à comparer.
 */
export function tauxAtteinte(
  realise: string | number | null | undefined,
  cible: string | number | null | undefined,
): number | null {
  const valeurCible = versNombre(cible)
  if (valeurCible === 0) return null
  return Math.round((versNombre(realise) / valeurCible) * 100)
}

/** Taux prêt à afficher : « 87 % », ou « — » quand il n'est pas calculable. */
export function formatTaux(taux: number | null): string {
  return taux === null ? '—' : `${taux} %`
}

/**
 * Année portée par une colonne DATE, ou `null`.
 *
 * Les colonnes `annee` (cibles) et `Date_suivi` (réalisations) sont des DATE en
 * base alors qu'elles servent d'EXERCICE à l'écran. La chaîne reçue peut être
 * « 2019-01-01 » comme « 2019-01-01T00:00:00.000000Z » : on lit les quatre
 * premiers caractères plutôt que de construire un `Date`, ce qui évite tout
 * décalage de fuseau — un « 2019-01-01T00:00:00Z » interprété en heure locale
 * négative bascule sur 2018 et l'exercice entier change d'année.
 */
export function anneeDe(valeur: string | null | undefined): number | null {
  const brut = valeur?.trim()
  if (!brut || brut.length < 4) return null
  const annee = Number(brut.slice(0, 4))
  return Number.isInteger(annee) ? annee : null
}
