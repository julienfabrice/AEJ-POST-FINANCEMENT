import { useRouterState } from '@tanstack/react-router'
import { Bell } from 'lucide-react'
import { AGENT_NAV_ITEMS, AGENT_NAV_GROUPS, BENEF_NAV_ITEMS } from '@/constants/routes'
import { useAuthStore } from '@/store/useAuthStore'

import { HeaderLogo } from './HeaderLogo'
import { HeaderNavLink } from './HeaderNavLink'
import { NavGroupDropdown } from './NavGroupDropdown'
import { UserProfileMenu } from './UserProfileMenu'

export function HeaderNav() {
  const { user } = useAuthStore()
  const router = useRouterState()
  const currentPath = router.location.pathname
  const isBenef = user?.kind === 'benef'

  return (
    <header className="sticky top-0 z-40 bg-[#131C29] text-[#cdd7e4] flex items-center gap-[6px] px-5 h-[60px] shadow-lg shrink-0 before:absolute before:inset-x-0 before:bottom-0 before:h-[3px] before:bg-gradient-to-r before:from-[#E7722B] before:via-white before:to-[#20A83A]">
      <HeaderLogo />

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

            return (
              <NavGroupDropdown 
                key={group} 
                group={group} 
                items={items} 
                currentPath={currentPath} 
              />
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
        <UserProfileMenu />
      </div>
    </header>
  )
}
