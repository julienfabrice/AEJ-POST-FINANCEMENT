import type { ICellRendererParams } from 'ag-grid-community'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getRandomAvatarColor } from '@/helpers/getRandomAvatarColor'
import type { PROMOTEUR_T } from '@/types/promoteurs.types'

export const ProfileCellRenderer = (params: ICellRendererParams<PROMOTEUR_T>) => {
  if (!params.data) return null
  const { prenom = '', nom = '', matriculeaej } = params.data

  const color = getRandomAvatarColor()
  const initials = `${prenom?.charAt(0) ?? ''}${nom?.charAt(0) ?? ''}`.toUpperCase() || 'P'
  const fullName = `${prenom ?? ''} ${nom ?? ''}`.trim() || '—'

  return (
    <div className="flex items-center gap-3 h-full py-1 min-w-0">
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className="text-white text-xs font-bold" style={{ backgroundColor: color }}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center min-w-0">
        <span className="font-semibold text-[#131C29] text-sm leading-tight truncate" title={fullName}>
          {fullName}
        </span>
        <span className="font-mono text-xs text-slate-500 leading-tight truncate" title={matriculeaej || undefined}>
          {matriculeaej || '—'}
        </span>
      </div>
    </div>
  )
}

