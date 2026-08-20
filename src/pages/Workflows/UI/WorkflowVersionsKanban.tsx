import { Plus, MoreVertical, Info, Pencil, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WorkflowTimeline } from './WorkflowTimeline'

export interface WorkflowVersion {
  id: string
  name: string
  status: 'brouillon' | 'actif' | 'archive'
  date: string
  author: string
}

const mockVersions: WorkflowVersion[] = [
  { id: 'v1', name: 'Version 1.0', status: 'actif', date: '01/10/2023', author: 'Marie C.' },
  { id: 'v2', name: 'Version 2.0', status: 'brouillon', date: '15/11/2023', author: 'Jean D.' },
]

interface WorkflowVersionsKanbanProps {
  etapes: any[] // We pass the steps here for the mock
}

export function WorkflowVersionsKanban({ etapes }: WorkflowVersionsKanbanProps) {
  
  const renderColumn = (version: WorkflowVersion) => (
    <div key={version.id} className="min-w-[550px] w-[550px] bg-slate-50 border border-slate-200 rounded-xl flex flex-col h-[calc(100vh-280px)]">
      {/* Header de la colonne */}
      <div className="p-4 border-b border-slate-200 bg-white rounded-t-xl flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-800 text-lg">
            {version.name}
          </h3>
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
            version.status === 'actif' ? 'bg-orange-100 text-orange-700' :
            version.status === 'brouillon' ? 'bg-slate-200 text-slate-600' :
            'bg-slate-200 text-slate-600'
          }`}>
            {version.status === 'actif' ? 'Active' : 
             version.status === 'brouillon' ? 'Brouillon' : 'Archivée'}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem className="cursor-pointer">
              <Info className="mr-2 h-4 w-4" />
              <span>Infos de la version</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4" />
              <span>Modifier</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="bg-[#E7722B] text-white focus:bg-[#C85E18] focus:text-white cursor-pointer my-1">
              <Plus className="mr-2 h-4 w-4" />
              <span>Ajouter une option</span>
            </DropdownMenuItem>
            {version.status !== 'actif' && (
              <DropdownMenuItem className="text-orange-600 focus:text-orange-700 focus:bg-orange-50 cursor-pointer">
                <CheckCircle className="mr-2 h-4 w-4" />
                <span>Activer cette version</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Contenu de la colonne (Workflow Timeline) */}
      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        <WorkflowTimeline etapes={etapes} />
      </div>
    </div>
  )

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 h-full no-scrollbar">
      
      {/* Colonnes des versions */}
      {mockVersions.map(renderColumn)}

      {/* Colonne Ajouter une version */}
      <div className="min-w-[400px] w-[400px] border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-[#E7722B] hover:text-[#E7722B] hover:bg-orange-50/30 transition-all cursor-pointer h-[calc(100vh-280px)]">
        <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Plus className="h-7 w-7" />
        </div>
        <span className="font-semibold text-xl">Ajouter une version</span>
        <span className="text-sm text-slate-400 mt-2 text-center px-6">
          Créer un nouveau brouillon de workflow
        </span>
      </div>

    </div>
  )
}
