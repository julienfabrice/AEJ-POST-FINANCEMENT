import { TimerReset } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCountdown } from '@/constants/security'

interface SessionWarningDialogProps {
  open: boolean
  remainingSeconds: number
  onExtend: () => void
  onLogout: () => void
}

/**
 * Avertissement avant déconnexion pour inactivité.
 *
 * Volontairement NON refermable au clic extérieur ni à l'échap
 */
export function SessionWarningDialog({
  open,
  remainingSeconds,
  onExtend,
  onLogout,
}: SessionWarningDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-md"
      >
        <DialogHeader className="items-center">
          <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-amber-500/10">
            <TimerReset className="size-7 text-amber-600" />
          </div>
          <DialogTitle className="text-center">Vous allez être déconnecté</DialogTitle>
          <DialogDescription className="text-center">
            Faute d’activité, votre session prendra fin dans{' '}
            <span className="font-semibold text-foreground">
              {formatCountdown(remainingSeconds)}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={onLogout}
            className="cursor-pointer"
          >
            Se déconnecter
          </Button>
          <Button
            type="button"
            onClick={onExtend}
            className="cursor-pointer bg-[#E7722B] font-semibold text-white hover:bg-[#C85E18]"
          >
            Rester connecté
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
