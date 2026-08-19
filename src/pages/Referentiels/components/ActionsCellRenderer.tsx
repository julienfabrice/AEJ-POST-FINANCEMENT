import { useState, useRef } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import type { ICellRendererParams } from 'ag-grid-community'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export interface ActionsCellRendererParams extends ICellRendererParams {
  onDelete?: (id: number | string) => void;
  onEdit?: (id: number | string) => void;
}

export const ActionsCellRenderer = (params: ActionsCellRendererParams) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEdit = () => {
    if (params.onEdit && params.data) {
      params.onEdit(params.data.id)
    }
  }

  const confirmDelete = () => {
    setIsAlertOpen(false)
    
    if (!params.onDelete || !params.data) return

    const itemId = params.data.id
    const itemLabel = params.data.libelle || params.data.nom || `Élément #${itemId}`

    // Toast with 5 seconds timer
    toast.error(`Suppression de "${itemLabel}" programmée`, {
      description: (
        <div className="flex flex-col gap-2 w-full mt-1">
          <span className="text-sm text-slate-500">La suppression sera effective dans 5 secondes.</span>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-red-500 animate-[shrink-x_5s_linear_forwards]" />
          </div>
        </div>
      ),
      duration: 5000,
      action: {
        label: 'Annuler',
        onClick: () => {
          if (timerRef.current) clearTimeout(timerRef.current)
          toast.success("Suppression annulée")
        }
      },
    })

    // Execute deletion after 5 seconds if not cancelled
    timerRef.current = setTimeout(() => {
      if (params.onDelete) {
        params.onDelete(itemId)
      }
    }, 5000)
  }

  // Cleanup timeout on unmount to prevent memory leaks or executing if component is destroyed
  // Wait, if we unmount the cell because of scrolling or grid re-render, we STILL want the delete to execute!
  // AG Grid unmounts cell renderers frequently during scroll. 
  // If we put the timeout in the cell renderer, scrolling away will cancel the delete!
  // So the timeout MUST NOT be cleared on unmount.
  
  return (
    <div className="flex items-center justify-end gap-1 h-full">
      <button 
        onClick={handleEdit}
        className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-[#131C29] hover:bg-slate-100 transition-colors"
        title="Modifier"
      >
        <Pencil className="w-4 h-4" />
      </button>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogTrigger asChild>
          <button 
            className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera cet élément de la base de données. Vous aurez 5 secondes pour annuler cette action avant qu'elle ne soit définitive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Continuer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
