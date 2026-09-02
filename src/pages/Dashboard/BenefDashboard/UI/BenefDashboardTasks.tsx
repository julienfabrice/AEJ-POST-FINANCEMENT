import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { DashboardTaskItem, type DashboardTask } from '../../shared/components/DashboardTaskItem'
import { MOCK_BENEF_TASKS } from '@/mock'
import * as LucideIcons from 'lucide-react'

// Mapping des icônes mock → composants Lucide
const ICON_MAP: Record<string, LucideIcons.LucideIcon> = {
  doc: LucideIcons.FileText,
  flow: LucideIcons.GitMerge,
  chart: LucideIcons.BarChart3,
  repay: LucideIcons.Banknote,
  users: LucideIcons.User,
}

// Mapping des couleurs mock → valeurs CSS
const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  amber: { bg: '#fef3c7', text: '#d97706' },
  orange: { bg: '#fef1e8', text: '#E7722B' },
  blue: { bg: '#eff6ff', text: '#2D6BD4' },
  red: { bg: '#fef2f2', text: '#ef4444' },
  green: { bg: '#ebf8ee', text: '#20A83A' },
}

export function BenefDashboardTasks() {
  const tasks: DashboardTask[] = MOCK_BENEF_TASKS.map(t => {
    const c = COLOR_MAP[t.color] ?? COLOR_MAP.blue
    return {
      id: t.id,
      titre: t.titre,
      desc: t.desc,
      icon: ICON_MAP[t.icon] ?? LucideIcons.CheckCircle,
      bg: c.bg,
      text: c.text,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ce que vous devez faire</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-[#E5EAF1]">
          {tasks.map(task => (
            <DashboardTaskItem key={task.id} task={task} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
