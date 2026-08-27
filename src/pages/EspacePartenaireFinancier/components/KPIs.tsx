import { CheckCircle2, XCircle, Layers, CreditCard } from 'lucide-react'
import { KpiCard } from './KpiCard'

interface KPIsProps {
  kpis: {
    lotsEnCoursCount: number
    lotsTotal: number
    dossiersApprouvesCount: number
    dossiersTotal: number
    plansEnValidation: number
    plansTotal: number
    impayes: number
  }
}

export function KPIs({ kpis }: KPIsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <KpiCard
        label="Lots en cours"
        value={kpis.lotsEnCoursCount}
        trend={`${kpis.lotsTotal} lot(s) total`}
        trendUp
        icon={Layers}
        iconColor="#2D6BD4"
        iconBg="#E5EDFB"
      />
      <KpiCard
        label="Dossiers approuvés"
        value={kpis.dossiersApprouvesCount}
        trend={`sur ${kpis.dossiersTotal} dossiers`}
        trendUp
        icon={CheckCircle2}
        iconColor="#20A83A"
        iconBg="#E3F6E7"
      />
      <KpiCard
        label="Plans en validation"
        value={kpis.plansEnValidation}
        trend={`${kpis.plansTotal} plan(s) total`}
        trendUp={kpis.plansEnValidation === 0}
        icon={CreditCard}
        iconColor="#E7722B"
        iconBg="#FBEADE"
      />
      <KpiCard
        label="Impayés"
        value={kpis.impayes}
        trend={kpis.impayes > 0 ? 'action requise' : 'Aucun impayé'}
        trendUp={kpis.impayes === 0}
        icon={kpis.impayes > 0 ? XCircle : CheckCircle2}
        iconColor={kpis.impayes > 0 ? '#D6453B' : '#20A83A'}
        iconBg={kpis.impayes > 0 ? '#FBE7E5' : '#E3F6E7'}
      />
    </div>
  )
}
