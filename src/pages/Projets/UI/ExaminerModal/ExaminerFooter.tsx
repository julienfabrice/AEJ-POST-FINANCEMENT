import { Button } from '@/components/ui/button'
import { FolderOpen, X, Check } from 'lucide-react'

interface ExaminerFooterProps {
  handleClose: () => void
}

export function ExaminerFooter({ handleClose }: ExaminerFooterProps) {
  return (
    <div className="shrink-0 border-t border-slate-100 bg-slate-50 px-5 py-3 flex items-center gap-2 flex-wrap">
      <Button variant="outline" size="sm" onClick={handleClose}>
        Fermer
      </Button>
      <Button variant="ghost" size="sm" className="text-slate-600">
        <FolderOpen className="w-4 h-4 mr-1.5" />
        Voir le dossier
      </Button>
      <div className="flex-1" />
      {/* Actions de décision (visibles selon le rôle — statiques pour l'instant) */}
      <Button
        size="sm"
        variant="destructive"
        className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-none"
      >
        <X className="w-4 h-4 mr-1" />
        Ajourner
      </Button>
      <Button
        size="sm"
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <Check className="w-4 h-4 mr-1" />
        Valider
      </Button>
    </div>
  )
}
