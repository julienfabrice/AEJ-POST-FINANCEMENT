import { DashboardStatCard } from '../../shared/components/DashboardStatCard'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

interface Props {
  projet?: MICRO_PROJET_T
}

export function BenefDashboardKpis({ projet }: Props) {
  const montant = projet?.montant_total
    ? new Intl.NumberFormat('fr-FR').format(Number(projet.montant_total))
    : '-'

  const stats = [
    { label: "Mon micro-projet", value: projet?.code ?? '-', suffix: projet?.intitule, color: '#131C29' },
    { label: "Statut du dossier", value: projet?.statut ?? '-', color: '#131C29' },
    { label: "Montant financé", value: montant, suffix: projet?.montant_total ? 'F' : undefined, color: '#131C29' },
    { label: "Pièces déposées", value: '--/--', color: '#5A6B80' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <DashboardStatCard key={i} label={s.label} value={s.value} suffix={s.suffix} color={s.color} />
      ))}
    </div>
  )
}
