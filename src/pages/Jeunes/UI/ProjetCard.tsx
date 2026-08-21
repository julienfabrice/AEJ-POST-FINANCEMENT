import { Badge } from '@/components/ui/badge'
import {
  PROJET_STADE_OPTIONS,
  PROJET_STATUT_OPTIONS,
  PROJET_TYPE_OPTIONS,
  type FilterOption,
} from '@/constants/promoteurs.filters'
import { formatMontant } from '@/helpers/numbers'
import { cn } from '@/lib/utils'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'


const labelFrom = (options: FilterOption[], code?: string | null) =>
  options.find((o) => o.value === code)?.label ?? code ?? '—'

/** Les statuts terminaux se distinguent visuellement des statuts en cours. */
const statutTone = (statut: string) => {
  if (statut === 'TERMINE') return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  if (statut === 'BROUILLON') return 'border-slate-200 bg-slate-50 text-slate-600'
  return 'border-amber-200 bg-amber-50 text-amber-700'
}



export function ProjetCard({ projet }: { projet: MICRO_PROJET_T }) {
  const montant = formatMontant(projet.montant_total , 'FCFA')

  return (
    <article className="rounded-lg border border-border p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-medium text-foreground">{projet.intitule}</h4>
          <p className="font-mono text-xs text-muted-foreground">{projet.code}</p>
        </div>

        <Badge variant="outline" className={cn('shrink-0', statutTone(projet.statut))}>
          {labelFrom(PROJET_STATUT_OPTIONS, projet.statut)}
        </Badge>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary" className="font-normal">
          {labelFrom(PROJET_STADE_OPTIONS, projet.stade_projet)}
        </Badge>
        <Badge variant="secondary" className="font-normal">
          {labelFrom(PROJET_TYPE_OPTIONS, projet.type_projet)}
        </Badge>
        {montant && (
          <span className="ml-auto text-sm font-semibold text-foreground">{montant}</span>
        )}
      </div>

      {projet.localisation && (
        <p className="mt-2 truncate text-xs text-muted-foreground">{projet.localisation}</p>
      )}
    </article>
  )
}
