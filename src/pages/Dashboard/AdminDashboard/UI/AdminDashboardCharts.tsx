import { DashboardCard } from '../../shared/components/DashboardCard'
import { DashboardBarChart } from '../../shared/components/DashboardBarChart'
import { DashboardHBarChart } from '../../shared/components/DashboardHBarChart'
import { DashboardStatCard } from '../../shared/components/DashboardStatCard'
import { MOCK_ETAPES_BARS, MOCK_REGIONS_HBARS, MOCK_AGENCES_HBARS, MOCK_SUIVI_TERRAIN } from '@/mock'

export function AdminDashboardCharts() {
  const etapeItems = MOCK_ETAPES_BARS.map(s => ({
    label: s.label,
    value: s.value,
    highlighted: ['SUIVI', 'REMBOURSEMENT'].includes(s.label),
  }))

  const regionItems = MOCK_REGIONS_HBARS.map(s => ({
    label: s.label,
    value: s.nb,
    meta: `${s.nb} · ${s.montant}`,
  }))

  const agenceItems = MOCK_AGENCES_HBARS.map(s => ({
    label: s.label,
    value: s.nb,
    meta: `${s.nb} · ${s.montant}`,
  }))

  const suiviStats = [
    { label: "En bonne voie", value: MOCK_SUIVI_TERRAIN.bonneVoie, color: '#20A83A' },
    { label: "En difficulté", value: MOCK_SUIVI_TERRAIN.difficulte, color: '#D6453B' },
    { label: "Non visités", value: MOCK_SUIVI_TERRAIN.nonVisites, color: '#5A6B80' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Micro-projets par étape du parcours">
          <DashboardBarChart items={etapeItems} />
        </DashboardCard>

        <DashboardCard title="Projets financés par région">
          <DashboardHBarChart items={regionItems} />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Projets financés par agence">
          <DashboardHBarChart items={agenceItems} />
        </DashboardCard>

        <DashboardCard title="Situation du suivi terrain">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px]">
            {suiviStats.map((s, i) => (
              <DashboardStatCard key={i} label={s.label} value={s.value} color={s.color} />
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
