import type { ElementType } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export interface DashboardTask {
  id: string
  titre: string
  desc: string
  icon: ElementType
  bg: string
  text: string
  to?: string
}

interface Props {
  task: DashboardTask
}

/**
 * Ligne de tâche interactive standard.
 * Affiche une icône colorée, un titre, une description et une flèche de navigation.
 * Utilisée dans BenefDashboardTasks et tout futur composant de liste d'actions.
 */
export function DashboardTaskItem({ task }: Props) {
  const Icon = task.icon

  return (
    <Link
      to={task.to ?? '/dashboard'}
      className="flex items-center gap-4 p-4 hover:bg-[#F8FAFC] transition-colors group"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: task.bg, color: task.text }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-[#131C29]">{task.titre}</div>
        <div className="text-xs text-[#5A6B80] mt-0.5">{task.desc}</div>
      </div>
      <ChevronRight className="w-5 h-5 text-[#94A3B8] group-hover:text-[#131C29] transition-colors" />
    </Link>
  )
}
