import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'
import { useImputerAlertModal } from '../hooks/actions/imputater/useImputerAlertModal'

export function ImputerAlertModal() {
  const { projet, isOpen, isAdvancing, agenceName, handleClose, handleAdvance } = useImputerAlertModal()

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Dossier déjà imputé</AlertDialogTitle>
          <AlertDialogDescription>
            Le dossier <strong>{projet?.code}</strong> a déjà été imputé à l'agence <strong>{agenceName}</strong>. 
            Voulez-vous le faire passer à l'étape suivante du workflow ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isAdvancing}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleAdvance()
            }}
            disabled={isAdvancing}
            className="bg-[#E7722B] hover:bg-[#c9601e]"
          >
            {isAdvancing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Passer à l'étape suivante
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
