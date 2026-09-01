import * as Icons from 'lucide-react'
import { DashboardKpiCard } from '../../shared/components/DashboardKpiCard'
import { useAdminKpis } from '../hooks/useAdminKpis'

function formatAmount(value: number) {
  return new Intl.NumberFormat('fr-FR').format(value)
}

export function AdminDashboardKpis() {
  const { nbPromoteurs, nbProjets, montantDecaisse, nbDecaissements, tauxRemboursement } = useAdminKpis()

  const kpis = [
    { id: 'enroles', label: "Promoteurs enrôlés", value: nbPromoteurs, desc: "Sur l'ensemble du territoire", icon: "Users", color: "#E7722B", bg: "#fef1e8" },
    { id: 'actifs', label: "Micro-projets", value: nbProjets, desc: "Tous statuts confondus", icon: "FolderOpen", color: "#2D6BD4", bg: "#eff6ff" },
    { id: 'decaisse', label: "Montant décaissé", value: formatAmount(montantDecaisse), suffix: "F", desc: `${nbDecaissements} décaissements`, icon: "Banknote", color: "#20A83A", bg: "#ebf8ee" },
    { id: 'rembourse', label: "Taux de remboursement", value: `${tauxRemboursement}%`, desc: "Recouvrement national", icon: "TrendingUp", color: "#8a6503", bg: "#fef3c7" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map(kpi => (
        <DashboardKpiCard key={kpi.id} {...kpi} up Icons={Icons as any} />
      ))}
    </div>
  )
}
