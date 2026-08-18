import { Plus, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ProjetsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29]">Micro-projets</h1>
        <p className="text-sm text-[#5A6B80] mt-1">Suivi des dossiers de financement des jeunes promoteurs</p>
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
