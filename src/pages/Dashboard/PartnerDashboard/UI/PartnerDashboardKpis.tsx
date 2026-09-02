import * as Icons from 'lucide-react'
import { DashboardKpiCard } from '../../shared/components/DashboardKpiCard'
import { usePartnerKpis } from '../hooks/usePartnerKpis'

function formatAmount(value: number) {
  return new Intl.NumberFormat('fr-FR').format(value)
}

export function PartnerDashboardKpis() {
  const { nbLots, montantEngage, tauxRemboursement } = usePartnerKpis()

  const kpis = [
    { id: 'lots', label: "Dossiers transmis", value: nbLots, desc: "A analyser", icon: "FolderOpen", color: "#E7722B", bg: "#fef1e8" },
    { id: 'approuves', label: "Dossiers approuvés", value: nbLots, desc: "Total validés", icon: "CheckCircle", color: "#2D6BD4", bg: "#eff6ff" },
    { id: 'engage', label: "Montant engagé", value: formatAmount(montantEngage), suffix: "F", desc: "Pour ces dossiers", icon: "Banknote", color: "#20A83A", bg: "#ebf8ee" },
    { id: 'rembourse', label: "Taux du portefeuille", value: `${tauxRemboursement}%`, desc: "Recouvrement", icon: "TrendingUp", color: "#8a6503", bg: "#fef3c7" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map(kpi => (
        <DashboardKpiCard key={kpi.id} {...kpi} up Icons={Icons as any} />
      ))}
    </div>
  )
}
