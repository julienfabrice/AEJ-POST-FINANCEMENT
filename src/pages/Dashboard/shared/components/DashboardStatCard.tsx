import { Card } from '@/components/ui/card'

interface Props {
  label: string
  value: string | number
  suffix?: string
  color?: string
}

/**
 * Mini carte statistique : label + grande valeur colorée.
 * Utilisée dans AdminDashboardGlobalSituation et le bloc SuiviTerrain.
 */
export function DashboardStatCard({ label, value, suffix, color = '#131C29' }: Props) {
  return (
    <Card
      className="border-[#E5EAF1] rounded-[7px] py-4 px-[17px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] gap-0 flex flex-col justify-center"
    >
      <div className="text-[12px] text-[#5A6B80] font-medium leading-tight">{label}</div>
      <div
        className="font-extrabold text-[26px] tracking-[-0.02em] mt-[2px] leading-tight"
        style={{ color }}
      >
        {value}
        {suffix && <small className="text-[13px] font-semibold ml-1" style={{ color }}>{suffix}</small>}
      </div>
    </Card>
  )
}
