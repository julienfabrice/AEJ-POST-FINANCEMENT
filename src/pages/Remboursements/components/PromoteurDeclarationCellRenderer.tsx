import type { ICellRendererParams } from 'ag-grid-community'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getRandomAvatarColor } from '@/helpers/getRandomAvatarColor'
import type { REMBOURSEMENT_DECLARATION_T } from '@/types'

export function PromoteurDeclarationCellRenderer(
  params: ICellRendererParams<REMBOURSEMENT_DECLARATION_T>
) {
  if (!params.data) return null

  const promoteur = params.data.promoteur

  if (!promoteur) {
    return (
      <div className="flex items-center h-full">
        <span className="text-xs font-mono text-slate-400">
          #{params.data.promoteur_id ?? '—'}
        </span>
      </div>
    )
  }

  const { prenom = '', nom = '', matriculeaej } = promoteur
  const color = getRandomAvatarColor()
  const initials = `${nom?.charAt(0) ?? ''}${prenom?.charAt(0) ?? ''}`.toUpperCase() || `${prenom?.charAt(0) ?? ''}`.toUpperCase() || 'P'
  const fullName = `${nom ?? ''} ${prenom ?? ''}`.trim() || '—'

  return (
    <div className="flex items-center gap-3 h-full py-1 min-w-0">
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback
          className="text-white text-xs font-bold"
          style={{ backgroundColor: color }}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center min-w-0 leading-tight">
        <span
          className="font-semibold text-[#131C29] text-sm truncate"
          title={fullName}
        >
          {fullName}
        </span>
        <span
          className="font-mono text-xs text-slate-500 truncate"
          title={matriculeaej || undefined}
        >
          {matriculeaej || '—'}
        </span>
      </div>
    </div>
  )
}
