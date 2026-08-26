import { useMemo, useState, useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { Bell, Menu, X } from 'lucide-react'
import { AGENT_NAV_ITEMS, AGENT_NAV_GROUPS, BENEF_NAV_ITEMS } from '@/constants/routes'
import { useAuthStore } from '@/store/useAuthStore'

import { HeaderLogo } from './HeaderLogo'
import { HeaderNavLink } from './HeaderNavLink'
import { NavGroupDropdown } from './NavGroupDropdown'
import { UserProfileMenu } from './UserProfileMenu'

export function HeaderNav() {
  const isBenef = useAuthStore((s) => s.space() === 'entreprise')
  const can = useAuthStore((s) => s.can)
  const permissions = useAuthStore((s) => s.permissions)
  const router = useRouterState()
  const currentPath = router.location.pathname

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [currentPath])

  const visibleAgentItems = useMemo(
    () => AGENT_NAV_ITEMS.filter((item) => !item.module || can(item.module, 'v')),
    [can, permissions],
  )

  return (
    <header className="sticky top-0 z-50 bg-[#131C29] text-[#cdd7e4] flex items-center gap-[6px] px-5 h-[60px] shadow-lg shrink-0 before:absolute before:inset-x-0 before:bottom-0 before:h-[3px] before:bg-gradient-to-r before:from-[#E7722B] before:via-white before:to-[#20A83A]">
      <HeaderLogo />

      {/* Main Nav */}
      <nav className={`
        lg:static lg:flex lg:flex-row lg:items-center lg:gap-[2px] lg:h-full lg:p-0 lg:bg-transparent lg:shadow-none lg:transform-none lg:overflow-visible lg:z-auto
        fixed top-[60px] left-0 right-0 bg-[#131C29] flex flex-col items-stretch p-3 gap-1 h-auto max-h-[calc(100vh-60px)] overflow-y-auto shadow-2xl z-40 transition-transform duration-200
        ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-[150%] lg:translate-y-0'}
      `}>
        {isBenef ? (
          BENEF_NAV_ITEMS.map((item) => (
            <HeaderNavLink key={item.key} item={item} currentPath={currentPath} />
          ))
        ) : (
          AGENT_NAV_GROUPS.map((group) => {
            const items = visibleAgentItems.filter((item) => item.group === group)
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
      <div className="flex items-center gap-4 ml-auto relative z-50 bg-[#131C29]">
        {/* Notifications */}
        <button className="hidden lg:flex items-center justify-center w-[38px] h-[38px] rounded-[9px] text-[#7f8fa4] hover:bg-white/[0.08] hover:text-white transition-colors relative">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-[8px] right-[8px] w-2 h-2 rounded-full bg-[#E7722B]" />
        </button>

        {/* User Profile */}
        <UserProfileMenu />

        {/* Hamburger Menu Toggle */}
        <button 
          className="lg:hidden flex items-center justify-center w-[38px] h-[38px] rounded-[9px] bg-white/[0.08] text-white hover:bg-white/[0.12] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </header>
  )
}
