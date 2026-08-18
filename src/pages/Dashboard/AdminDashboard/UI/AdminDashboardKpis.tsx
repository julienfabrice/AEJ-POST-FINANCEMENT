import { MOCK_ADMIN_KPIS } from '@/mock/dashboard'
import * as Icons from 'lucide-react'

export function AdminDashboardKpis() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {MOCK_ADMIN_KPIS.map(kpi => {
        const Icon = (Icons as any)[kpi.icon]
        return (
          <div key={kpi.id} className="bg-white border border-[#E5EAF1] rounded-[7px] py-4 px-[17px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col">
            <div className="w-[38px] h-[38px] rounded-[10px] grid place-items-center mb-3" style={{ background: kpi.bg, color: kpi.color }}>
              {Icon && <Icon className="w-[19px] h-[19px]" />}
            </div>
            <div className="text-[12px] text-[#5A6B80] font-medium leading-tight">
              {kpi.label}
            </div>
            <div className="font-extrabold text-[26px] tracking-[-0.02em] text-[#131C29] mt-[2px] leading-tight">
              {kpi.value} {kpi.suffix && <small className="text-[13px] text-[#5A6B80] font-semibold">{kpi.suffix}</small>}
            </div>
            <div className={`text-[11.5px] mt-[7px] font-semibold inline-flex items-center gap-1 ${kpi.up ? 'text-[#20A83A]' : 'text-[#D6453B]'}`}>
              {kpi.desc}
            </div>
          </div>
        )
      })}
    </div>
  )
}
