import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  className?: string
  headerRight?: ReactNode
}

/**
 * Wrapper Card standard pré-stylé avec le design AEJ.
 * Utilisé partout dans le Dashboard pour uniformiser les bordures, ombres et radius.
 */
export function DashboardCard({ title, children, className = '', headerRight }: Props) {
  return (
    <Card className={`border-[#E5EAF1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-[7px] ${className}`}>
      <CardHeader className="border-b border-[#EEF2F7] py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-[14px] font-bold text-[#131C29]">{title}</CardTitle>
        {headerRight}
      </CardHeader>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  )
}
