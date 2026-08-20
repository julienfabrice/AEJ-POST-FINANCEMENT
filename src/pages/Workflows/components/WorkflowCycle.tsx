import { Edit2, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WorkflowSubCycle } from './WorkflowSubCycle'

interface WorkflowCycleProps {
  numero: number
  code: string
  titre: string
  sousEtapes: any[]
  isLast?: boolean
}

export function WorkflowCycle({ numero, code, titre, sousEtapes, isLast }: WorkflowCycleProps) {
  return (
    <div className="relative pb-1.5 pl-10 mb-1.5">
      {/* Ligne verticale de connexion */}
      {!isLast && (
        <div className="absolute left-[13px] top-[34px] -bottom-1.5 w-[2px] bg-[#E5EAF1]" />
      )}
      
      {/* Numéro */}
      <div className="absolute left-0 top-0.5 w-7 h-7 rounded-[9px] bg-[#131C29] text-white flex items-center justify-center font-bold text-[13px] z-10">
        {numero}
      </div>
      
      {/* Carte du cycle */}
      <div className="bg-white border border-[#E5EAF1] rounded-[7px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        
        {/* Header */}
        <div className="px-4 py-[13px] flex items-center flex-wrap gap-2.5 cursor-default">
          <div className="flex-1 min-w-0">
            <h4 className="text-[14px] font-bold text-[#131C29]">{titre}</h4>
            <div className="text-[11px] text-[#5A6B80] font-mono">{code}</div>
          </div>
          <div className="flex items-center gap-1">
            <button className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-[#131C29] hover:bg-slate-100 transition-colors" title="Modifier l'étape">
              <Edit2 className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Supprimer l'étape">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Body */}
        <div className="px-4 pb-4 border-t border-[#EEF2F7] block">
          {(!sousEtapes || sousEtapes.length === 0) ? (
            <div className="text-slate-500 text-sm py-2">Aucune sous-étape</div>
          ) : (
            sousEtapes.map((sousEtape, index) => (
              <WorkflowSubCycle 
                key={index}
                titre={sousEtape.titre}
                roles={sousEtape.roles}
                documents={sousEtape.documents}
                duree={sousEtape.duree}
              />
            ))
          )}
          
          <div className="mt-4">
            <Button variant="outline" size="sm" className="h-8 text-xs font-medium text-slate-600">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Ajouter une sous-étape
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
