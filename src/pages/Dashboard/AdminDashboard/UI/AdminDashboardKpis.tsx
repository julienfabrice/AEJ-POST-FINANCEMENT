import * as Icons from 'lucide-react'
import { DashboardKpiCard } from '../../shared/components/DashboardKpiCard'
import { useAdminKpis } from '../hooks/useAdminKpis'

export function AdminDashboardKpis() {
  const {
    nbPromoteurs, nbProjets, tauxRemboursement,
    projetsFinances, emploisCreés, nbEntreprises, montantFinance,
  } = useAdminKpis()

  const kpis = [
    { id: 'promoteurs', label: "Promoteurs enrôlés", value: nbPromoteurs, desc: "Total inscrits", icon: "Users", color: "#E7722B", bg: "#fef1e8" },
    { id: 'projets', label: "Micro-projets", value: nbProjets, desc: `${projetsFinances} financés`, icon: "FolderOpen", color: "#2D6BD4", bg: "#eff6ff" },
    { id: 'finance', label: "Montant financé", value: montantFinance, suffix: "F", desc: `${nbEntreprises} entreprises`, icon: "Banknote", color: "#20A83A", bg: "#ebf8ee" },
    { id: 'rembourse', label: "Taux de recouvrement", value: `${tauxRemboursement}%`, desc: `${emploisCreés} emplois créés`, icon: "TrendingUp", color: "#8a6503", bg: "#fef3c7" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map(kpi => (
        <DashboardKpiCard key={kpi.id} {...kpi} up Icons={Icons as any} />
      ))}
    </div>
  )
}
