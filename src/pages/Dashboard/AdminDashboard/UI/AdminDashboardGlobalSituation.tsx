import { MOCK_SITUATION_GLOBALE } from '@/mock/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AdminDashboardGlobalSituation() {
  const { sollicite, finance, nbFinances, nbTotal, tauxCouverture } = MOCK_SITUATION_GLOBALE

  return (
    <Card className="border-[#E5EAF1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-[7px]">
      <CardHeader className="border-b border-[#EEF2F7] py-3 px-4">
        <CardTitle className="text-[14px] font-bold text-[#131C29]">Situation globale des financements</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px]">
          
          <div className="bg-white border border-[#E5EAF1] rounded-[7px] py-4 px-[17px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="text-[12px] text-[#5A6B80] font-medium leading-tight">Montant total sollicité</div>
            <div className="font-extrabold text-[26px] tracking-[-0.02em] text-[#131C29] mt-[2px] leading-tight">
              {sollicite} <small className="text-[13px] text-[#5A6B80] font-semibold">F</small>
            </div>
          </div>

          <div className="bg-white border border-[#E5EAF1] rounded-[7px] py-4 px-[17px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="text-[12px] text-[#5A6B80] font-medium leading-tight">Montant total financé</div>
            <div className="font-extrabold text-[26px] tracking-[-0.02em] text-[#20A83A] mt-[2px] leading-tight">
              {finance} <small className="text-[13px] text-[#20A83A] font-semibold">F</small>
            </div>
          </div>

          <div className="bg-white border border-[#E5EAF1] rounded-[7px] py-4 px-[17px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="text-[12px] text-[#5A6B80] font-medium leading-tight">Projets financés</div>
            <div className="font-extrabold text-[26px] tracking-[-0.02em] text-[#2D6BD4] mt-[2px] leading-tight">
              {nbFinances} <small className="text-[13px] text-[#2D6BD4] font-semibold">/ {nbTotal}</small>
            </div>
          </div>

          <div className="bg-white border border-[#E5EAF1] rounded-[7px] py-4 px-[17px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="text-[12px] text-[#5A6B80] font-medium leading-tight">Taux de couverture</div>
            <div className="font-extrabold text-[26px] tracking-[-0.02em] text-[#E7722B] mt-[2px] leading-tight">
              {tauxCouverture}%
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
