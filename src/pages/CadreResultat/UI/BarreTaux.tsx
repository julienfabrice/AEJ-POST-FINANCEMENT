import { formatTaux } from '../utils/format'

/**
 * BARRE DE TAUX D'ATTEINTE — transposition Tailwind de `.taux-cell` /
 * `.track.sm` / `.fill` de la maquette (aej-demo.html l. 9806, CSS l. 3796).
 *
 * La maquette n'a pas d'écran « cadre de résultat » ; ce composant est donc
 * NOUVEAU, mais il ne réinvente rien : c'est exactement le rendu de la colonne
 * « Taux » de l'onglet « Planification & taux » des indicateurs, seul précédent
 * de la maquette pour un rapport réalisé/cible.
 *
 * Correspondances, une pour une :
 *   .taux-cell   → flex, items-center, gap-8px
 *   .track.sm    → h-[6px] rounded-[5px] bg-[#EEF2F7] min-w-[70px] overflow-hidden
 *   .fill        → h-full rounded-[5px], couleur selon le seuil
 *   .taux        → font-mono font-bold, même couleur que le remplissage
 *
 * Les trois seuils sont ceux de la maquette (`t >= 75 ? 'g' : (t >= 40 ? '' : 'r')`)
 * et les trois couleurs celles de la palette produit : vert #20A83A / #178A2E,
 * orange #E7722B / #C85E18, rouge #D6453B. Aucune couleur hors palette.
 */

/** Seuils de la maquette — au-dessus : vert ; en dessous de 40 : rouge. */
const SEUIL_VERT = 75
const SEUIL_ROUGE = 40

/**
 * Couleur de la piste ET du texte, choisies ensemble : dissocier les deux
 * produirait un pourcentage vert au-dessus d'une barre rouge.
 *
 * Classes littérales et non composées (`bg-[${couleur}]`) : Tailwind ne génère
 * que les classes qu'il trouve écrites en toutes lettres dans le source — une
 * classe construite à l'exécution n'existerait tout simplement pas dans la
 * feuille de style. Même règle que `ETAT_ACTIVITE_BADGE_STYLES`.
 */
function classesSelonTaux(taux: number): { barre: string; texte: string } {
  if (taux >= SEUIL_VERT) return { barre: 'bg-[#20A83A]', texte: 'text-[#178A2E]' }
  if (taux >= SEUIL_ROUGE) return { barre: 'bg-[#E7722B]', texte: 'text-[#C85E18]' }
  return { barre: 'bg-[#D6453B]', texte: 'text-[#D6453B]' }
}

interface Props {
  /**
   * Taux en pourcentage, ou `null` quand il n'est pas calculable (cible nulle
   * ou absente — cf. `tauxAtteinte`). NON borné : un dépassement vaut plus de
   * 100 et doit s'afficher tel quel.
   */
  taux: number | null
}

export function BarreTaux({ taux }: Props) {
  // Taux incalculable : ni barre ni pourcentage. Afficher une piste vide se
  // lirait comme « 0 % », c'est-à-dire comme une contre-performance, alors
  // qu'il n'y a simplement rien à comparer.
  if (taux === null) {
    return <span className="text-[12.5px] text-slate-500">—</span>
  }

  const { barre, texte } = classesSelonTaux(taux)
  // Le REMPLISSAGE est borné à 100 % — sinon la barre déborderait de sa piste
  // sur un dépassement de cible —, mais le NOMBRE affiché ne l'est pas :
  // « 142 % » reste lisible à côté d'une barre pleine. C'est exactement ce que
  // fait la maquette (`width:${Math.min(100, t)}%` avec `${t}%` en texte).
  const remplissage = Math.max(0, Math.min(100, taux))

  return (
    <div className="flex h-full items-center gap-2">
      <div className="h-[6px] min-w-[70px] flex-1 overflow-hidden rounded-[5px] bg-[#EEF2F7]">
        <div
          className={`h-full rounded-[5px] transition-[width] duration-500 ${barre}`}
          style={{ width: `${remplissage}%` }}
        />
      </div>
      <b className={`font-mono text-[12.5px] font-bold whitespace-nowrap ${texte}`}>
        {formatTaux(taux)}
      </b>
    </div>
  )
}
