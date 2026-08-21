import { useState, useRef } from 'react'
import { Pencil, Trash2, Key } from 'lucide-react'
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export interface ActionsCellRendererParams extends ICellRendererParams {
  onDelete?: (id: number | string) => void;
  onEdit?: (row: any) => void;
  onChangePassword?: (row: any) => void;
}

export const ActionsCellRenderer = (params: ActionsCellRendererParams) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEdit = () => {
    if (params.onEdit && params.data) {
      params.onEdit(params.data)
    }
  }

  const handleChangePassword = () => {
    if (params.onChangePassword && params.data) {
      params.onChangePassword(params.data)
    }
  }

  const confirmDelete = () => {
    setIsAlertOpen(false)
    
    if (!params.onDelete || !params.data) return

    const itemId = params.data.id
    const itemLabel = params.data.libelle || params.data.nom || `Élément #${itemId}`

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

    timerRef.current = setTimeout(() => {
      if (params.onDelete) {
        params.onDelete(itemId)
      }
    }, 5000)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center justify-end gap-1 h-full">
        {params.onChangePassword && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={handleChangePassword}
                className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              >
                <Key className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Modifier le mot de passe</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={handleEdit}
              className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-[#131C29] hover:bg-slate-100 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Modifier</TooltipContent>
        </Tooltip>

        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <button 
                  className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Supprimer</TooltipContent>
          </Tooltip>
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
    </TooltipProvider>
  )
}
