import { Button } from '@/components/ui/button'
import { FileText, Receipt } from 'lucide-react'
import { useProjetsStore } from '@/store/useProjetsStore'

interface ProjetSheetFooterProps {
  onClose: () => void
}

export function ProjetSheetFooter({ onClose }: ProjetSheetFooterProps) {
  const { selectedProjet, setFicheSynoptiqueModalProjet } = useProjetsStore()

  return (
    <div className="shrink-0 border-t border-aej-line px-6 py-4 bg-white flex items-center gap-2 flex-wrap shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
      <Button variant="outline" size="sm" onClick={onClose} className="h-9">
        Fermer
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-9 text-[13px] text-aej-slate hover:bg-aej-line-2"
        onClick={() => setFicheSynoptiqueModalProjet(selectedProjet)}
      >
        <FileText className="w-4 h-4 mr-1.5" />
        Fiche synoptique
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-9 text-[13px] text-aej-slate hover:bg-aej-line-2"
        onClick={() => {
          if (selectedProjet) {
            useProjetsStore.getState().setPlanDecaissementViewerProjet(selectedProjet)
          }
        }}
      >
        <Receipt className="w-4 h-4 mr-1.5" />
        Plan de décaissement
      </Button>
      <div className="flex-1" />
    </div>
  )
}
