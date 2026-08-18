import { Link } from '@tanstack/react-router'
import { type NavItem } from '@/constants/routes'
import { cn } from '@/lib/utils'

export function HeaderNavLink({ item, currentPath }: { item: NavItem; currentPath: string }) {
  const isActive = currentPath === item.path
  const Icon = item.icon

  return (
    <Link
      to={item.path}
      className={cn(
        'inline-flex items-center gap-2 h-[38px] px-3.5 rounded-[9px] text-[#b9c4d3] text-[12px] font-semibold transition-colors whitespace-nowrap',
        'hover:bg-white/[0.08] hover:text-white',
        isActive && 'bg-gradient-to-b from-[#E7722B]/30 to-[#E7722B]/10 text-white'
      )}
    >
      <Icon className="w-[16px] h-[16px] opacity-85" />
      <span>{item.label}</span>
    </Link>
  )
}
