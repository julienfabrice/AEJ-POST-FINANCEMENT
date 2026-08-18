import { LogOut, ChevronDown, User as UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/store/useAuthStore'

export function UserProfileMenu() {
  const { user, clearSession } = useAuthStore()

  const initials = user
    ? `${user.prenoms?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase()
    : 'AJ'
  const displayName = user ? `${user.prenoms} ${user.nom}` : 'Utilisateur'
  const roleName = user?.roleLibelle ?? ''

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 h-[38px] px-2 rounded-[9px] hover:bg-white/[0.08] transition-colors outline-none">
          <Avatar className="w-[26px] h-[26px] rounded-full">
            <AvatarFallback className="text-[11px] font-bold bg-[#E7722B] text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start min-w-0 max-w-[120px] text-left">
            <b className="text-[12.5px] font-semibold text-white leading-tight truncate w-full">{displayName}</b>
            <span className="text-[10px] text-[#7f8fa4] leading-tight truncate w-full">{roleName}</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#7f8fa4] ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[230px] bg-white rounded-xl shadow-lg mt-2 p-2 border-slate-200">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <Avatar className="w-10 h-10 rounded-full">
            <AvatarFallback className="font-bold bg-[#E7722B] text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <b className="text-[13.5px] font-semibold text-[#131C29] truncate w-full">{displayName}</b>
            <span className="text-[12px] text-muted-foreground truncate w-full">{user?.email}</span>
          </div>
        </div>
        <DropdownMenuSeparator className="mb-2" />
        <DropdownMenuItem className="cursor-pointer mb-1 h-9 rounded-lg text-[#5f7086]">
          <UserIcon className="mr-2 h-[18px] w-[18px]" />
          Mon profil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={clearSession} className="cursor-pointer text-destructive focus:text-destructive focus:bg-red-50 h-9 rounded-lg">
          <LogOut className="mr-2 h-[18px] w-[18px]" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
