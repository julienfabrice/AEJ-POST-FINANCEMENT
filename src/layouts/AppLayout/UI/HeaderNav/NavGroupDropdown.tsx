import { Link } from '@tanstack/react-router'
import { ChevronDown, FolderOpen, Settings, CreditCard, BarChart2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type NavItem } from '@/constants/routes'
import { cn } from '@/lib/utils'

const GROUP_ICONS: Record<string, React.ElementType> = {
  'Opérations': FolderOpen,
  'Administration': Settings,
  'Circuit de financement': CreditCard,
  'Suivi & Évaluation': BarChart2,
}

interface NavGroupDropdownProps {
  group: string
  items: NavItem[]
  currentPath: string
}

export function NavGroupDropdown({ group, items, currentPath }: NavGroupDropdownProps) {
  const GroupIcon = GROUP_ICONS[group] || FolderOpen
  const isGroupActive = items.some((item) => item.path === currentPath)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'inline-flex items-center gap-2 h-[38px] px-3.5 rounded-[9px] text-[#b9c4d3] text-[12px] font-semibold transition-colors whitespace-nowrap outline-none',
            'hover:bg-white/[0.08] hover:text-white',
            isGroupActive && 'bg-gradient-to-b from-[#E7722B]/30 to-[#E7722B]/10 text-white'
          )}
        >
          <GroupIcon className="w-[16px] h-[16px] opacity-85" />
          <span>{group}</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
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
                  'flex items-center gap-2 px-3 text-[12px] font-medium w-full',
                  isActive ? 'bg-[#eef2f7] text-[#131C29] font-semibold' : 'text-[#5f7086] hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <ItemIcon className="w-[16px] h-[16px] opacity-85" />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
