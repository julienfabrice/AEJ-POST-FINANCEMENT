import { useState, useRef, type ReactNode } from 'react'
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

export interface DeleteConfirmModalProps {
  onConfirm: () => void
  title?: string
  description?: string
  itemLabel?: string
  trigger?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export function DeleteConfirmModal({
  onConfirm,
  title = "Êtes-vous sûr de vouloir supprimer ?",
  description = "Cette action supprimera cet élément de la base de données. Vous aurez 5 secondes pour annuler cette action avant qu'elle ne soit définitive.",
  itemLabel = "cet élément",
  trigger,
  open,
  onOpenChange,
  className
}: DeleteConfirmModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isControlled = open !== undefined && onOpenChange !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen

  const handleConfirm = () => {
    setIsOpen(false)
    
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
      onConfirm()
    }, 5000)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault()
              handleConfirm()
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Continuer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
