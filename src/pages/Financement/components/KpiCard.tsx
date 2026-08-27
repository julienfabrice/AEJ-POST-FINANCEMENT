import { cn } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  label: string
  value: string | number
  small?: string
  trend?: string
  trendUp?: boolean
  icon: LucideIcon
  iconColor: string
  iconBg: string
  className?: string
}

export function KpiCard({
  label,
  value,
  small,
  trend,
  trendUp,
  icon: Icon,
  iconColor,
  iconBg,
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-[#E5EAF1] rounded-[11px] p-4 shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)] relative overflow-hidden',
        className,
      )}
    >
      {/* Icône */}
      <div
        className="w-[38px] h-[38px] rounded-[10px] grid place-items-center mb-3 flex-none"
        style={{ background: iconBg, color: iconColor }}
      >
        <Icon size={19} />
      </div>

      {/* Label */}
      <div className="text-[12px] text-[#5A6B80] font-medium">{label}</div>

      {/* Valeur */}
      <div className="font-extrabold text-[26px] tracking-tight text-[#131C29] mt-0.5">
        {value}
        {small && (
          <small className="text-[13px] text-[#8595A8] font-semibold ml-1">
            {small}
          </small>
        )}
      </div>

      {/* Tendance */}
      {trend && (
        <div
          className={cn(
            'text-[11.5px] mt-1.5 font-semibold inline-flex items-center gap-1',
            trendUp ? 'text-[#20A83A]' : 'text-[#D6453B]',
          )}
        >
          <TrendingUp size={12} />
          {trend}
        </div>
      )}
    </div>
  )
}
