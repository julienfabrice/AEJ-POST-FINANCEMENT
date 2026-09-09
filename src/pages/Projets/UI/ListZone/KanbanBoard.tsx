import { Badge } from '@/components/ui/badge'

import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { Eye } from 'lucide-react'
import { useKanbanData } from '../../hooks/useKanbanData'
import { useProjetsStore } from '@/store/useProjetsStore'
import { configurationServices } from '@/services/configurations.services'

dayjs.locale('fr')

export function KanbanBoard() {
  const { projets, setSelectedProjet } = useProjetsStore()
  const { columns } = useKanbanData(projets)
  const { data: configuration } = configurationServices.useGet()

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 h-[calc(100vh-420px)] min-h-[400px]">
      {columns.map(column => (
        <div key={column.key} className="flex-shrink-0 w-80 flex flex-col bg-slate-50/50 rounded-xl border border-slate-200 h-full">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-white rounded-t-xl shrink-0">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${column.color.split(' ')[0].replace('100', '500').replace('200', '600')}`} />
              <h3 className="font-semibold text-[13px] text-slate-700 capitalize">{column.label}</h3>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-mono text-xs">
              {column.items.length}
            </Badge>
          </div>
          
          <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {column.items.map(projet => (
              <div key={projet.id} className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm hover:border-[#E7722B]/50 hover:shadow-md transition-all group relative">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {projet.code}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {projet.created_at ? dayjs(projet.created_at).format('DD/MM/YYYY') : ''}
                  </span>
                </div>
                
                <h4 className="font-bold text-sm text-[#131C29] mb-1 leading-snug group-hover:text-[#E7722B] transition-colors pr-6">
                  {projet.intitule}
                </h4>
                
                {projet.promoteur && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-600">
                      {projet.promoteur.nom.charAt(0)}
                    </div>
                    <span className="text-xs text-slate-600 font-medium truncate">
                      {projet.promoteur.prenom} {projet.promoteur.nom}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <Badge variant="outline" className="text-[10px] text-slate-500 font-normal">
                    {projet.stade_projet || 'N/A'}
                  </Badge>
                  <span className="font-bold text-xs text-[#131C29]">
                    {projet.montant_total ? new Intl.NumberFormat('fr-FR').format(parseFloat(projet.montant_total)) : '0'} {configuration?.sigle_monnaie_pays || 'FCFA'}
                  </span>
                </div>
                
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setSelectedProjet(projet)}
                    className="p-1.5 bg-white shadow-sm rounded-md text-slate-400 hover:text-[#131C29] transition-colors"
                    title="Voir les détails"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {column.items.length === 0 && (
              <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg shrink-0">
                <span className="text-xs text-slate-400 font-medium">Aucun projet</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
