import type { ElementType, ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  icon?: ElementType
  iconColor?: string
  right?: ReactNode
}

/**
 * En-tête de page standard pour les dashboards.
 * Affiche un titre, un sous-titre et une icône optionnelle.
 */
export function DashboardPageHeader({ title, subtitle, icon: Icon, iconColor = '#E7722B', right }: Props) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29] flex items-center gap-2">
          {Icon && <Icon className="w-6 h-6" style={{ color: iconColor }} />}
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[#5A6B80] mt-1">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  )
}
