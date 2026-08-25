import { indicateurs, indicateurs_suivi } from '@/mock'
import { ChartBar, TrendingUp, Target, ListTodo } from 'lucide-react'
import { KPICard } from '@/components/ui/KPICard'

const indicSuivi = (indId: string | number) => {
  return indicateurs_suivi
    .filter((s) => s.indicateur_id.toString() === indId.toString())
    .reduce((a, s) => a + (parseFloat(s.valeur) || 0), 0)
}

const fmt = (num: number) => new Intl.NumberFormat('fr-FR').format(num)

export function IndicateursKPIs() {
  const totalCible = indicateurs.reduce((a, i) => a + (i.valeur_cible || 0), 0)
  const totalSuivi = indicateurs.reduce((a, i) => a + indicSuivi(i.id), 0)
  const globalTaux = totalCible ? Math.round((totalSuivi / totalCible) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <KPICard
        label="Indicateurs planifiés"
        value={indicateurs.length}
        icon={ListTodo}
        color="#2D6BD4"
      />
      <KPICard
        label="Cible cumulée"
        value={fmt(totalCible)}
        icon={Target}
        color="#E0A106"
      />
      <KPICard
        label="Réalisé cumulé"
        value={fmt(totalSuivi)}
        icon={TrendingUp}
        color="#20A83A"
      />
      <KPICard
        label="Taux global"
        value={`${globalTaux}%`}
        icon={ChartBar}
        color={globalTaux >= 75 ? "#20A83A" : globalTaux >= 40 ? "#E0A106" : "#D6453B"}
      />
    </div>
  )
}
