import type { ElementType } from 'react'
import { Card, CardContent } from '@/components/ui/card'

export interface KPICardProps {
  label: string
  value: string | number
  change?: string
  icon: ElementType
  color?: string
}

export function KPICard({
  label,
  value,
  change,
  icon: Icon,
  color = '#E7722B', // Default to Orange
}: KPICardProps) {
  return (
    <Card className="border-slate-100 shadow-sm">
      <CardContent className="p-5 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#5A6B80] mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-[#131C29]">{value}</h3>
          {change && (
            <p className="text-xs font-medium mt-1" style={{ color }}>
              {change}
            </p>
          )}
        </div>
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-opacity-10"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </CardContent>
    </Card>
  )
}
