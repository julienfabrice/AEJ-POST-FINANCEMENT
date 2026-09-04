import type { ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

/** Toute ligne portant la relation `micro_projet` (exploitations ET embauches). */
interface AVEC_MICRO_PROJET_T {
  micro_projet?: MICRO_PROJET_T | null
}

/**
 * Micro-projet d'une ligne : CODE en badge orange monospace, puis intitulé en
 * texte atténué — c'est le rendu composite de la COLONNE « Micro-projet » des
 * EMBAUCHES dans la maquette (l.6510,
 * `<span class="mono badge or">code</span> <span class="tmuted">titre</span>`).
 *
 * ⚠️ Réservé à l'onglet « Emplois créés ». La colonne « Projet » des rapports
 * de visite a un rendu DIFFÉRENT dans la maquette (gras couleur encre, libellé
 * complet, l.6469) et passe donc par `PrimaryTextCellRenderer`. Le précédent
 * commentaire citait l.6505, qui est la ligne du FORMULAIRE des embauches et
 * ne justifiait donc rien.
 *
 * La relation `micro_projet` est DÉJÀ embarquée par `GET /embauches` : cette
 * cellule ne déclenche aucune requête. Quand la relation est absente (clé
 * étrangère nulle, que l'API autorise sur `/embauches`), on affiche « — »
 * plutôt que le badge vide de la maquette : un badge orange sans texte ne dit
 * rien à l'utilisateur.
 */
export const MicroProjetCellRenderer = (params: ICellRendererParams<AVEC_MICRO_PROJET_T>) => {
  const projet = params.data?.micro_projet

  if (!projet) {
    return <span className="text-[12.5px] text-slate-500">—</span>
  }

  return (
    <div className="flex h-full min-w-0 items-center gap-2">
      <Badge className="shrink-0 border-0 bg-[#FBEADE] font-mono text-[11px] font-semibold text-[#C85E18] hover:bg-[#FBEADE]">
        {projet.code}
      </Badge>
      <span className="truncate text-[12.5px] text-slate-500" title={projet.intitule}>
        {projet.intitule}
      </span>
    </div>
  )
}
