import { Button } from '@/components/ui/button'
import { FileText, Lock, FileSignature, Receipt } from 'lucide-react'

interface ProjetSheetFooterProps {
  onClose: () => void
}

export function ProjetSheetFooter({ onClose }: ProjetSheetFooterProps) {
  return (
    <div className="shrink-0 border-t border-aej-line px-6 py-4 bg-white flex items-center gap-2 flex-wrap shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
      <Button variant="outline" size="sm" onClick={onClose} className="h-9">
        Fermer
      </Button>
      <Button variant="ghost" size="sm" className="h-9 text-[13px] text-aej-slate hover:bg-aej-line-2">
        <FileText className="w-4 h-4 mr-1.5" />
        Fiche synoptique
      </Button>
      <Button variant="ghost" size="sm" className="h-9 text-[13px] text-aej-slate hover:bg-aej-line-2">
        <Receipt className="w-4 h-4 mr-1.5" />
        Plan de décaissement
      </Button>
      <div className="flex-1" />
      <Button size="sm" className="h-9 bg-aej-green hover:bg-aej-green-deep text-white shadow-none">
        <FileSignature className="w-4 h-4 mr-1.5" />
        Convention de prêt signée
      </Button>
      <Button size="sm" variant="destructive" className="h-9 bg-aej-red-soft text-aej-red border border-aej-red-soft hover:bg-aej-red-soft shadow-none">
        <Lock className="w-4 h-4 mr-1.5" />
        Annulation du prêt
      </Button>
    </div>
  )
}
