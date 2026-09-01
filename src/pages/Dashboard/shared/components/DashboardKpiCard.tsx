import { Card } from '@/components/ui/card'
import type { ElementType } from 'react'

interface Props {
  id: string
  label: string
  value: string | number
  suffix?: string
  desc: string
  up?: boolean
  icon: string
  color: string
  bg: string
  Icons: Record<string, ElementType>
}

/**
 * Carte KPI standard du Dashboard.
 * Affiche une icône colorée, un label, une grande valeur et une description.
 * Utilisée dans Admin, Agent, Partner et Benef dashboards.
 */
export function DashboardKpiCard({ label, value, suffix, desc, up = true, icon, color, bg, Icons }: Props) {
  const Icon = Icons[icon] as ElementType | undefined

  return (
    <Card className="border-[#E5EAF1] rounded-[7px] py-4 px-[17px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col gap-0">
      <div
        className="w-[38px] h-[38px] rounded-[10px] grid place-items-center mb-3"
        style={{ background: bg, color }}
      >
        {Icon && <Icon className="w-[19px] h-[19px]" />}
      </div>
      <div className="text-[12px] text-[#5A6B80] font-medium leading-tight">{label}</div>
      <div className="font-extrabold text-[26px] tracking-[-0.02em] text-[#131C29] mt-[2px] leading-tight">
        {value}{suffix && <small className="text-[13px] text-[#5A6B80] font-semibold ml-1">{suffix}</small>}
      </div>
      <div className={`text-[11.5px] mt-[7px] font-semibold inline-flex items-center gap-1 ${up ? 'text-[#20A83A]' : 'text-[#D6453B]'}`}>
        {desc}
      </div>
    </Card>
  )
}
