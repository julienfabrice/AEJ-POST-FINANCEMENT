import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import { DashboardPageHeader } from '../../shared/components/DashboardPageHeader'

interface Props {
  agencyId?: string | null
}

export function AgentDashboardHeader({ agencyId }: Props) {
  const user = useAuthStore((s) => s.user)
  const subtitle = agencyId && user?.agence
    ? `Dossiers de ${user.agence.libelle}`
    : "Vue d'ensemble de la plateforme AEJ"

  return (
    <DashboardPageHeader
      title="Tableau de bord"
      subtitle={subtitle}
      right={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau dossier
          </Button>
        </div>
      }
    />
  )
}
