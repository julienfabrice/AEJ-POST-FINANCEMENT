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
  readonly?: boolean;
  readonlyMessage?: string;
}

export const ActionsCellRenderer = (params: ActionsCellRendererParams) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isReadonly = params.readonly === true
  const readonlyMessage = params.readonlyMessage || "Cette action n'est pas autorisée."

  const handleEdit = () => {
    if (isReadonly) return
    if (params.onEdit && params.data) {
      params.onEdit(params.data)
    }
  }

  const handleChangePassword = () => {
    if (isReadonly) return
    if (params.onChangePassword && params.data) {
      params.onChangePassword(params.data)
    }
  }

  const confirmDelete = () => {
    setIsAlertOpen(false)
    
    if (isReadonly || !params.onDelete || !params.data) return

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

  const EditButton = (
    <button 
      onClick={handleEdit}
      disabled={isReadonly}
      className={`flex items-center justify-center w-8 h-8 rounded transition-colors ${
        isReadonly 
          ? 'text-slate-300 cursor-not-allowed' 
          : 'text-slate-400 hover:text-[#131C29] hover:bg-slate-100'
      }`}
    >
      <Pencil className="w-4 h-4" />
    </button>
  )

  const DeleteButton = (
    <button 
      disabled={isReadonly}
      className={`flex items-center justify-center w-8 h-8 rounded transition-colors ${
        isReadonly
          ? 'text-slate-300 cursor-not-allowed'
          : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
      }`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center justify-end gap-1 h-full">
        {params.onChangePassword && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-block">
                <button 
                  onClick={handleChangePassword}
                  disabled={isReadonly}
                  className={`flex items-center justify-center w-8 h-8 rounded transition-colors ${
                    isReadonly
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <Key className="w-4 h-4" />
                </button>
              </div>
            </TooltipTrigger>
            <TooltipContent>{isReadonly ? readonlyMessage : "Modifier le mot de passe"}</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-block">
              {EditButton}
            </div>
          </TooltipTrigger>
          <TooltipContent>{isReadonly ? readonlyMessage : "Modifier"}</TooltipContent>
        </Tooltip>

        {isReadonly ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-block">
                {DeleteButton}
              </div>
            </TooltipTrigger>
            <TooltipContent>{readonlyMessage}</TooltipContent>
          </Tooltip>
        ) : (
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  {DeleteButton}
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
        )}
      </div>
    </TooltipProvider>
  )
}
