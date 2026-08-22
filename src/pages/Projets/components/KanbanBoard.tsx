import { MOCK_PROJETS } from '@/mock'
import { Badge } from '@/components/ui/badge'

const STATUSES = [
  { key: 'SOUMISSION', label: 'Soumission', color: 'bg-slate-100 text-slate-800' },
  { key: 'ANALYSE', label: 'Analyse', color: 'bg-blue-100 text-blue-800' },
  { key: 'CERTIFICATION', label: 'Certification', color: 'bg-indigo-100 text-indigo-800' },
  { key: 'FINANCEMENT', label: 'Financement', color: 'bg-amber-100 text-amber-800' },
  { key: 'DECAISSEMENT', label: 'Décaissement', color: 'bg-orange-100 text-orange-800' },
  { key: 'SUIVI', label: 'Suivi', color: 'bg-teal-100 text-teal-800' },
  { key: 'REMBOURSEMENT', label: 'Remboursement', color: 'bg-green-100 text-green-800' },
]

export function KanbanBoard() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 h-[calc(100vh-250px)] min-h-[400px]">
      {STATUSES.map(status => {
        const projetsInStatus = MOCK_PROJETS.filter(p => p.statut === status.key)
        
        return (
          <div key={status.key} className="flex-shrink-0 w-80 flex flex-col bg-slate-50/50 rounded-xl border border-slate-200 h-full">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-white rounded-t-xl shrink-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status.color.split(' ')[0].replace('100', '500')}`} />
                <h3 className="font-semibold text-[13px] text-slate-700">{status.label}</h3>
              </div>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-mono text-xs">
                {projetsInStatus.length}
              </Badge>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
              {projetsInStatus.map(projet => (
                <div key={projet.id} className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm hover:border-[#E7722B]/50 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {projet.ref}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{projet.date}</span>
                  </div>
                  
                  <h4 className="font-bold text-sm text-[#131C29] mb-1 leading-snug group-hover:text-[#E7722B] transition-colors">
                    {projet.titre}
                  </h4>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-600">
                      {projet.promoteur.charAt(0)}
                    </div>
                    <span className="text-xs text-slate-600 font-medium truncate">
                      {projet.promoteur}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <Badge variant="outline" className="text-[10px] text-slate-500 font-normal">
                      {projet.dispositif}
                    </Badge>
                    <span className="font-bold text-xs text-[#131C29]">
                      {new Intl.NumberFormat('fr-FR').format(projet.montant)} F
                    </span>
                  </div>
                </div>
              ))}
              
              {projetsInStatus.length === 0 && (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg shrink-0">
                  <span className="text-xs text-slate-400 font-medium">Aucun projet</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
