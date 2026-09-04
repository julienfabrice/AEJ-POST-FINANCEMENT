import type { ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'
import type { EMBAUCHE_T } from '@/types'

/** Orange et bleu, les deux teintes de badge que la maquette emploie ici. */
const BADGE_ORANGE = 'border-0 bg-[#FBEADE] text-[#C85E18] hover:bg-[#FBEADE]'
const BADGE_BLEU = 'border-0 bg-[#E5EDFB] text-[#2D6BD4] hover:bg-[#E5EDFB]'

/**
 * Type d'emploi — badge dont la couleur ALTERNE d'un type à l'autre.
 *
 * La maquette codait la règle en dur sur son jeu de démo : orange pour le
 * premier type (`id === 'em1'`), bleu pour tous les autres. Côté API,
 * `/type-emplois` est un référentiel OUVERT (l'utilisateur peut en créer) :
 * une règle sur un identifiant figé n'a plus de sens. On alterne donc sur la
 * PARITÉ de l'identifiant, ce qui conserve l'intention visuelle de la maquette
 * (deux teintes qui distinguent les types au coup d'œil) tout en donnant à
 * chaque type une couleur STABLE dans le temps.
 *
 * La relation `type_emploi` est embarquée par `GET /embauches` : aucune
 * requête sur le référentiel n'est nécessaire pour peupler cette colonne.
 */
export const TypeEmploiCellRenderer = (params: ICellRendererParams<EMBAUCHE_T>) => {
  const type = params.data?.type_emploi

  if (!type) {
    return <span className="text-[12.5px] text-slate-500">—</span>
  }

  return (
    <div className="flex h-full items-center">
      <Badge className={type.id % 2 === 1 ? BADGE_ORANGE : BADGE_BLEU}>{type.libelle}</Badge>
    </div>
  )
}
