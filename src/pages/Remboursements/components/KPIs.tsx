import { Card } from '@/components/ui/card'
import { money } from '../../EspacePartenaireFinancier/utils/money'

interface KPIsProps {
  kpis: {
    du: number
    paye: number
    taux: number
    impayes: number
  }
}

export function KPIs({ kpis }: KPIsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card className="p-4 shadow-sm">
        <div className="text-[12px] font-semibold text-[#5A6B80] uppercase tracking-wider mb-1">
          Total dû
        </div>
        <div className="text-[22px] font-bold font-mono text-[#131C29]">
          {money(kpis.du).replace(' CFA', '')} <small className="text-[14px]">CFA</small>
        </div>
      </Card>
      <Card className="p-4 shadow-sm">
        <div className="text-[12px] font-semibold text-[#5A6B80] uppercase tracking-wider mb-1">
          Total remboursé
        </div>
        <div className="text-[22px] font-bold font-mono text-[#0FA958]">
          {money(kpis.paye).replace(' CFA', '')} <small className="text-[14px]">CFA</small>
        </div>
      </Card>
      <Card className="p-4 shadow-sm">
        <div className="text-[12px] font-semibold text-[#5A6B80] uppercase tracking-wider mb-1">
          Taux de recouvrement
        </div>
        <div className="text-[22px] font-bold font-mono text-[#131C29]">{kpis.taux}%</div>
      </Card>
      <Card className="p-4 shadow-sm">
        <div className="text-[12px] font-semibold text-[#5A6B80] uppercase tracking-wider mb-1">
          Échéances impayées
        </div>
        <div className="text-[22px] font-bold font-mono text-[#D6453B]">{kpis.impayes}</div>
      </Card>
    </div>
  )
}
