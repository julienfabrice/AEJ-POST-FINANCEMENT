import { Link, useRouterState } from '@tanstack/react-router'
import { LogOut, ChevronDown, Bell, User as UserIcon, FolderOpen, Settings, CreditCard, BarChart2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IMAGES } from '@/constants/images'
import { AGENT_NAV_ITEMS, AGENT_NAV_GROUPS, BENEF_NAV_ITEMS, type NavItem } from '@/constants/routes'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'

const GROUP_ICONS: Record<string, React.ElementType> = {
  'Opérations': FolderOpen,
  'Administration': Settings,
  'Circuit de financement': CreditCard,
  'Suivi & Évaluation': BarChart2,
}

export function HeaderNav() {
  const { user, clearSession } = useAuthStore()
  const router = useRouterState()
  const currentPath = router.location.pathname

  const initials = user
    ? `${user.prenoms?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase()
    : 'AJ'
  const displayName = user ? `${user.prenoms} ${user.nom}` : 'Utilisateur'
  const roleName = user?.roleLibelle ?? ''
  
  const isBenef = user?.kind === 'benef'

  return (
    <header className="sticky top-0 z-40 bg-[#131C29] text-[#cdd7e4] flex items-center gap-[6px] px-5 h-[60px] shadow-lg shrink-0 before:absolute before:inset-x-0 before:bottom-0 before:h-[3px] before:bg-gradient-to-r before:from-[#E7722B] before:via-white before:to-[#20A83A]">
      {/* Logo */}
      <div className="flex items-center gap-[11px] pr-[14px] mr-[6px] border-r border-white/10 h-[38px]">
        <img src={IMAGES.logo} alt="AEJ" className="h-[34px] w-auto block bg-white rounded-[7px] py-1 px-[7px]" />
      </div>

      {/* Main Nav */}
      <nav className="flex items-center gap-[2px] flex-1 h-full">
        {isBenef ? (
          BENEF_NAV_ITEMS.map((item) => (
            <HeaderNavLink key={item.key} item={item} currentPath={currentPath} />
          ))
        ) : (
          AGENT_NAV_GROUPS.map((group) => {
            const items = AGENT_NAV_ITEMS.filter((item) => item.group === group)
            if (!items.length) return null

            if (group === 'PILOTAGE') {
              return items.map((item) => (
                <HeaderNavLink key={item.key} item={item} currentPath={currentPath} />
              ))
            }

            const GroupIcon = GROUP_ICONS[group] || FolderOpen
            const isGroupActive = items.some((item) => item.path === currentPath)

            return (
              <DropdownMenu key={group}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      'inline-flex items-center gap-2 h-[38px] px-3.5 rounded-[9px] text-[#b9c4d3] text-[13.5px] font-semibold transition-colors whitespace-nowrap outline-none',
                      'hover:bg-white/[0.08] hover:text-white',
                      isGroupActive && 'bg-gradient-to-b from-[#E7722B]/30 to-[#E7722B]/10 text-white'
                    )}
                  >
                    <GroupIcon className="w-[17px] h-[17px] opacity-85" />
                    <span>{group}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[236px] bg-white rounded-xl shadow-lg mt-2 p-2 border-slate-200">
                  {items.map((item) => {
                    const ItemIcon = item.icon
                    const isActive = currentPath === item.path
                    return (
                      <DropdownMenuItem asChild key={item.key} className="cursor-pointer mb-1 last:mb-0 rounded-lg h-9">
                        <Link
                          to={item.path}
                          className={cn(
                            'flex items-center gap-2 px-3 text-[13.5px] font-medium w-full',
                            isActive ? 'bg-[#eef2f7] text-[#131C29] font-semibold' : 'text-[#5f7086] hover:bg-slate-50 hover:text-slate-900'
                          )}
                        >
                          <ItemIcon className="w-[17px] h-[17px] opacity-85" />
                          <span>{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          })
        )}
      </nav>

      {/* User & Notifications */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="flex items-center justify-center w-[38px] h-[38px] rounded-[9px] text-[#7f8fa4] hover:bg-white/[0.08] hover:text-white transition-colors relative">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-[8px] right-[8px] w-2 h-2 rounded-full bg-[#E7722B]" />
        </button>

        {/* User Profile */}
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
      </div>
    </header>
  )
}

function HeaderNavLink({ item, currentPath }: { item: NavItem; currentPath: string }) {
  const isActive = currentPath === item.path
  const Icon = item.icon

  return (
    <Link
      to={item.path}
      className={cn(
        'inline-flex items-center gap-2 h-[38px] px-3.5 rounded-[9px] text-[#b9c4d3] text-[13.5px] font-semibold transition-colors whitespace-nowrap',
        'hover:bg-white/[0.08] hover:text-white',
        isActive && 'bg-gradient-to-b from-[#E7722B]/30 to-[#E7722B]/10 text-white'
      )}
    >
      <Icon className="w-[17px] h-[17px] opacity-85" />
      <span>{item.label}</span>
    </Link>
  )
}
