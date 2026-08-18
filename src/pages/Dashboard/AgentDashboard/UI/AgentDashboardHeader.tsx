import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AgentDashboardHeader() {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29]">Tableau de bord</h1>
        <p className="text-sm text-[#5A6B80] mt-1">Vue d'ensemble de la plateforme AEJ</p>
      </div>
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
    </div>
  )
}
