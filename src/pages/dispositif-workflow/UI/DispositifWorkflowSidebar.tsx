import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

interface DispositifWorkflowSidebarProps {
  projects: any[]
  totalMontant: number
  totalProjects: number
  page: number
  setPage: (page: number) => void
  totalPages: number
  isLoading: boolean
}

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount)
}

export function DispositifWorkflowSidebar({ 
  projects, 
  totalMontant,
  totalProjects,
  page,
  setPage,
  totalPages,
  isLoading
}: DispositifWorkflowSidebarProps) {
  return (
    <div className="lg:h-full flex flex-col pb-[60px] lg:pb-0 relative">
      <div className="bg-white border border-[#E5EAF1] rounded-[11px] shadow-[0_1px_2px_rgba(18,28,41,.05),0_6px_20px_rgba(18,28,41,.06)] flex flex-col lg:max-h-full h-full relative">
        <div className="flex-none p-[15px_18px] border-b border-[#EEF2F7] flex items-center gap-[10px]">
          <h3 className="font-bold text-[14.5px] text-[#131C29]">Micro-projets</h3>
          <div className="flex-1" />
          <span className="bg-[#FBEADE] text-[#C85E18] px-[6px] py-[2px] rounded-full text-[10px] font-bold leading-none">
            {totalProjects} au total
          </span>
        </div>
        
        <div className="flex-none p-[12px_18px] border-b border-[#E5EAF1] flex justify-between items-center text-[12px] text-[#5A6B80]">
          <span>Montant (cette page)</span>
          <b className="font-mono text-[#2D6BD4]">{formatMoney(totalMontant)}</b>
        </div>

        <div className="flex-1 p-[10px] space-y-[4px] lg:overflow-y-auto lg:min-h-[120px] relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center z-10 backdrop-blur-[1px]">
              <Loader2 className="h-6 w-6 text-[#2D6BD4] animate-spin mb-2" />
              <span className="text-xs text-[#5A6B80] font-medium">Chargement...</span>
            </div>
          )}
          
          {projects.map(p => (
            <div key={p.id} className="flex items-center gap-[11px] p-[6px_8px] hover:bg-[#F3F5F8] rounded-[8px] cursor-pointer transition-colors group">
              <div className={`w-[8px] h-[8px] rounded-full flex-none ${
                p.statut === 'bl' ? 'bg-[#2D6BD4]' :
                p.statut === 'gr' ? 'bg-[#20A83A]' :
                p.statut === 'or' ? 'bg-[#E7722B]' : 'bg-[#5A6B80]'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[13px] text-[#131C29] truncate">{p.titre}</div>
                <div className="text-[11px] text-[#8595A8] truncate">{p.code} · {p.jeune}</div>
              </div>
              <div className="text-[13px] font-mono text-[#5A6B80]">
                {(p.montant / 1000).toFixed(0)}k
              </div>
            </div>
          ))}

          {!isLoading && projects.length === 0 && (
             <div className="text-center py-8 text-sm text-[#8595A8]">
               Aucun projet trouvé.
             </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex-none p-3 border-t border-[#EEF2F7] flex items-center justify-between bg-white rounded-b-[11px]">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => setPage(page - 1)}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
            </Button>
            <span className="text-xs font-medium text-[#5A6B80]">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages || isLoading}
            >
              Suivant <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}
