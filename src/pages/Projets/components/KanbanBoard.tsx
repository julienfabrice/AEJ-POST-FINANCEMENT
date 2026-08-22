import { Badge } from '@/components/ui/badge'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { Eye } from 'lucide-react'

dayjs.locale('fr')

const STATUSES = [
  { key: 'BROUILLON', label: 'Brouillon', color: 'bg-slate-100 text-slate-800' },
  { key: 'EN_SOUMISSION', label: 'En Soumission', color: 'bg-indigo-100 text-indigo-800' },
  { key: 'EN_COURS', label: 'En Cours', color: 'bg-blue-100 text-blue-800' },
  { key: 'EN_ANALYSE', label: 'En Analyse', color: 'bg-purple-100 text-purple-800' },
  { key: 'EN_ATTENTE', label: 'En Attente', color: 'bg-orange-100 text-orange-800' },
  { key: 'ANNULE', label: 'Annulé', color: 'bg-red-100 text-red-800' },
  { key: 'NON_APPROUVE', label: 'Non Approuvé', color: 'bg-red-200 text-red-900' },
  { key: 'APPROUVE', label: 'Approuvé', color: 'bg-teal-100 text-teal-800' },
  { key: 'EN_FORMATION', label: 'En Formation', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'EN_FINANCEMENT', label: 'En Financement', color: 'bg-amber-100 text-amber-800' },
  { key: 'EN_DECAISSEMENT', label: 'En Décaissement', color: 'bg-cyan-100 text-cyan-800' },
  { key: 'EN_SUIVI', label: 'En Suivi', color: 'bg-emerald-100 text-emerald-800' },
  { key: 'EN_REMBOURSEMENT', label: 'En Remboursement', color: 'bg-green-100 text-green-800' },
  { key: 'TERMINE', label: 'Terminé', color: 'bg-gray-200 text-gray-800' },
]

interface KanbanBoardProps {
  projets: MICRO_PROJET_T[]
  onViewDetails: (projet: MICRO_PROJET_T) => void
}

export function KanbanBoard({ projets, onViewDetails }: KanbanBoardProps) {
  // Find dynamic statuses that are not in our hardcoded list
  const existingKeys = STATUSES.map(s => s.key)
  const otherKeys = Array.from(new Set(projets.map(p => p.statut).filter(Boolean))).filter(k => !existingKeys.includes(k))
  
  const allStatuses = [
    ...STATUSES,
    ...otherKeys.map(k => ({ key: k, label: k.replace(/_/g, ' '), color: 'bg-gray-100 text-gray-800' }))
  ]

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 h-[calc(100vh-420px)] min-h-[400px]">
      {allStatuses.map(status => {
        const projetsInStatus = projets.filter(p => (p.statut || 'BROUILLON') === status.key)
        
        // Don't show empty columns for 'ANNULE', 'NON_APPROUVE', or dynamic ones to save horizontal space,
        // but keep the main pipeline columns visible even if empty
        const isHiddenIfEmpty = ['ANNULE', 'NON_APPROUVE', 'TERMINE'].includes(status.key) || !existingKeys.includes(status.key);
        if (projetsInStatus.length === 0 && isHiddenIfEmpty) return null;

        return (
          <div key={status.key} className="flex-shrink-0 w-80 flex flex-col bg-slate-50/50 rounded-xl border border-slate-200 h-full">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-white rounded-t-xl shrink-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status.color.split(' ')[0].replace('100', '500').replace('200', '600')}`} />
                <h3 className="font-semibold text-[13px] text-slate-700 capitalize">{status.label}</h3>
              </div>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-mono text-xs">
                {projetsInStatus.length}
              </Badge>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
              {projetsInStatus.map(projet => (
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
                      {projet.montant_total ? new Intl.NumberFormat('fr-FR').format(parseFloat(projet.montant_total)) : '0'} F
                    </span>
                  </div>
                  
                  {/* Bouton pour ouvrir le Drawer (flottant en hover ou visible tout le temps, on peut le mettre en bas ou en haut à droite) */}
                  <button 
                    onClick={() => onViewDetails(projet)}
                    className="absolute top-9 right-3 p-1.5 bg-slate-50 hover:bg-[#E7722B] hover:text-white text-slate-400 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    title="Voir les détails"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
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
