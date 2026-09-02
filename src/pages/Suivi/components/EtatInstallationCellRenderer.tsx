import type { ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'
import {
  ETAT_INSTALLATION_BADGE_STYLES,
  ETAT_INSTALLATION_LABELS,
  type ETAT_INSTALLATION_T,
  type EXPLOITATION_T,
} from '@/types'

/**
 * État d'installation — badge GRIS, avec « — » en repli.
 *
 * Pourquoi un renderer local plutôt que le `BadgeCellRenderer` mutualisé :
 * ce dernier renvoie `null` quand la valeur est vide, ce qui laisse une cellule
 * VIDE. La maquette, elle, rend toujours un badge et met « — » dedans quand
 * l'état manque (`badge(r.installation || '—', 'gy')`, l.6472) ; c'est aussi la
 * convention de repli du reste du module. On reproduit donc ce comportement,
 * en CONSOMMANT la table `ETAT_INSTALLATION_BADGE_STYLES` de `@/types` (une
 * table de styles que personne ne lit serait du code mort).
 */

/** Gris de repli, identique aux trois entrées de la table (`.badge.gy`). */
const BADGE_GRIS = 'bg-slate-100 text-slate-600 hover:bg-slate-100 border-0'

export const EtatInstallationCellRenderer = (params: ICellRendererParams<EXPLOITATION_T>) => {
  // On lit l'ENUM BRUT sur la ligne, pas `params.value` : la colonne expose le
  // libellé français au tri et au filtre, mais le style se choisit sur l'ENUM.
  const etat: ETAT_INSTALLATION_T | null | undefined = params.data?.etat_installation
  const connu = !!etat && etat in ETAT_INSTALLATION_LABELS

  return (
    <div className="flex h-full items-center">
      <Badge className={connu ? ETAT_INSTALLATION_BADGE_STYLES[etat] : BADGE_GRIS}>
        {connu ? ETAT_INSTALLATION_LABELS[etat] : '—'}
      </Badge>
    </div>
  )
}
