import { toast } from 'sonner'
import type { RAPPORT_LIGNE_T } from '../hooks/useRapportData'
import type { RAPPORT_TYPE_T } from '../constants'
import { enteteNb, partPourcent } from './format'

/**
 * EXPORT CSV — reprise de `$('#rExport').onclick` (maquette l. 8057-8060).
 *
 * Conservé de la maquette :
 *   • séparateur `;` (convention Excel francophone) ;
 *   • en-tête `<Dimension>;Nb …;Montant engage (FCFA)` — « engage » SANS accent
 *     et unité entre parenthèses, tels quels dans la source ;
 *   • nom de fichier `rapport_<cle>.csv`, sans horodatage ;
 *   • toast de confirmation « Export CSV généré ».
 *
 * ── Quatre corrections assumées ──
 * 1. ÉCHAPPEMENT. La maquette concatène `${r.k};${r.n};${r.m}` sans le moindre
 *    guillemet. Un libellé de secteur contenant un `;`, un guillemet ou un
 *    retour à la ligne — cas réel sur un référentiel de 49 entrées saisies à la
 *    main — produirait un fichier décalé d'une colonne, donc des chiffres faux.
 *    On applique la règle RFC 4180 : guillemets doublés, champ encadré.
 * 2. NEUTRALISATION DES FORMULES (« CSV injection »), cf. `neutraliserFormule`.
 * 3. BOM UTF-8. Sans lui, Excel sous Windows lit le fichier en ANSI et affiche
 *    « RÃ©gion » : les en-têtes accentués de la maquette étaient illisibles.
 * 4. LIBÉRATION DE L'URL. La maquette ne révoque jamais son `createObjectURL`,
 *    ce qui retient le Blob en mémoire pour toute la durée de la session.
 *
 * ── Colonnes ADAPTÉES aux mesures réellement présentes ──
 * « Montant engage (FCFA) » n'est écrite que si l'API a fourni des montants
 * (`aMontant`), et « Nb … » que si elle a fourni un dénombrement (`aNombre`).
 * Une colonne de zéros serait lue comme un financement nul ou un portefeuille
 * vide, alors qu'aucune source de l'API ne sait sommer un montant par statut,
 * secteur, guichet ou type d'emploi — et que la fusion des deux agrégats « par
 * agence » peut légitimement n'en rapporter qu'un des deux. Le fichier exporté
 * doit dire EXACTEMENT ce que l'écran affiche, ni plus ni moins : il est
 * recalculé et rediffusé hors de l'application. La colonne « Part (%) » est
 * ajoutée : la maquette l'omettait, mais sans la colonne des montants le
 * fichier perdrait la mesure de répartition affichée à l'écran.
 */

export interface EXPORT_CSV_PARAMS_T {
  rapport: RAPPORT_TYPE_T
  lignes: RAPPORT_LIGNE_T[]
  aMontant: boolean
  /** L'API a-t-elle fourni un dénombrement ? Cf. `aNombre` dans `useRapportData`. */
  aNombre: boolean
  totalN: number
  totalMontant: number
}

/**
 * Amorces de FORMULE dans Excel, LibreOffice Calc et Google Sheets.
 * Le TAB et le CR sont inclus parce que ces tableurs les ignorent en tête de
 * cellule et évaluent le caractère suivant.
 */
const AMORCES_FORMULE = /^[=+\-@\t\r]/

/**
 * 🔒 SÉCURITÉ — neutralisation de l'injection de formule (« CSV injection »).
 *
 * Les libellés de ce fichier viennent de la BASE et sont saisis par des
 * utilisateurs : `raison_sociale` d'entreprise (rapport « Top entreprises
 * recruteuses »), `libelle` de secteur (49 entrées), `nom` d'agence. Une raison
 * sociale valant `=cmd|'/c calc'!A1` serait écrite telle quelle, et le tableau
 * est ouvert sur le POSTE d'un agent AEJ.
 *
 * L'encadrement RFC 4180 ne protège de rien ici : les guillemets sont consommés
 * par l'analyseur du tableur AVANT l'évaluation de la cellule — une cellule
 * `"=1+1"` est bien évaluée. La seule parade est de faire commencer la valeur
 * par autre chose : une apostrophe, marqueur « texte littéral » universellement
 * compris par les tableurs, qui n'apparaît pas dans la cellule affichée.
 *
 * Elle est posée AVANT l'encadrement, sans quoi elle se retrouverait à
 * l'extérieur des guillemets et casserait le format.
 */
const neutraliserFormule = (texte: string): string =>
  AMORCES_FORMULE.test(texte) ? `'${texte}` : texte

/** Encadre un champ dès qu'il porte un caractère structurant (RFC 4180). */
const champCsv = (valeur: string | number): string => {
  // Les NOMBRES sont produits par le code (comptages, montants, parts) : ils ne
  // peuvent pas porter de formule, et les préfixer d'une apostrophe les rendrait
  // non recalculables — ce qui est précisément la raison d'être d'un CSV. Un
  // montant négatif resterait ainsi un nombre pour le tableur, pas du texte.
  const texte =
    typeof valeur === 'number' ? String(valeur) : neutraliserFormule(String(valeur ?? ''))
  return /[";\n\r]/.test(texte) ? `"${texte.replace(/"/g, '""')}"` : texte
}

/** Construit le contenu du fichier. Exporté pour être testable sans DOM. */
export function construireCsv({
  rapport,
  lignes,
  aMontant,
  aNombre,
  totalN,
  totalMontant,
}: EXPORT_CSV_PARAMS_T): string {
  const total = aMontant ? totalMontant : totalN

  const entetes = [rapport.libelleDimension]
  if (aNombre) entetes.push(enteteNb(rapport.uniteN))
  if (aMontant) entetes.push('Montant engage (FCFA)')
  entetes.push('Part (%)')

  const corps = lignes.map((ligne) => {
    const cellules: (string | number)[] = [ligne.label]
    if (aNombre) cellules.push(ligne.n)
    // Montant BRUT, non formaté : un CSV est fait pour être recalculé, pas lu.
    // (La maquette exportait déjà `r.m` tel quel.)
    if (aMontant) cellules.push(ligne.montant ?? 0)
    cellules.push(partPourcent(aMontant ? (ligne.montant ?? 0) : ligne.n, total))
    return cellules.map(champCsv).join(';')
  })

  // `\r\n` : fin de ligne attendue par Excel. La maquette utilisait `\n` seul.
  return [entetes.map(champCsv).join(';'), ...corps].join('\r\n')
}

/** Déclenche le téléchargement dans le navigateur. */
export function exporterCsv(params: EXPORT_CSV_PARAMS_T): void {
  // BOM UTF-8 (U+FEFF), écrit sous forme d'ÉCHAPPEMENT et non de caractère
  // littéral : un U+FEFF invisible dans le source serait invisible en revue de
  // code, et il doit rester le TOUT PREMIER octet du fichier produit.
  const BOM_UTF8 = '\uFEFF'
  const contenu = `${BOM_UTF8}${construireCsv(params)}`
  const blob = new Blob([contenu], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const lien = document.createElement('a')
  lien.href = url
  lien.download = `rapport_${params.rapport.cle}.csv`
  lien.click()

  // Libération différée : Safari lit le Blob de façon asynchrone après le clic,
  // révoquer immédiatement y annulerait le téléchargement.
  setTimeout(() => URL.revokeObjectURL(url), 1000)

  toast.success('Export CSV généré')
}
