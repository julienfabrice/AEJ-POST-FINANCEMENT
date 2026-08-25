import type { ICellRendererParams } from 'ag-grid-community'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getRandomAvatarColor } from '@/helpers/getRandomAvatarColor'
import type { PROMOTEUR_T } from '@/types/promoteurs.types'

export const ProfileCellRenderer = (params: ICellRendererParams<PROMOTEUR_T>) => {
  if (!params.data) return null
  const { prenom, nom } = params.data
  
  const color = getRandomAvatarColor()
  const initials = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase()

  return (
    <div className="flex items-center gap-3 h-full">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="text-white text-xs font-bold" style={{ backgroundColor: color }}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="font-semibold text-[#131C29]">
        {prenom} {nom}
      </span>
    </div>
  )
}
