import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useExecuterNumero } from '../../hooks/actions/executer/useExecuterNumero'

interface ExecuterModalProps {
  hook: ReturnType<typeof useExecuterNumero>
}

export function ExecuterModal({ hook }: ExecuterModalProps) {
  const { isOpen, isSubmitting, numeroToExec, closeExecuterModal, submitExecution } = hook
  const [dateExec, setDateExec] = useState('')
  const [justifFile, setJustifFile] = useState<File | null>(null)

  useEffect(() => {
    if (isOpen) {
      setDateExec(new Date().toISOString().split('T')[0])
      setJustifFile(null)
    }
  }, [isOpen])

  const handleConfirm = () => {
    submitExecution(dateExec, justifFile?.name || 'justificatif.pdf')
  }

  const isFormValid = !!dateExec && !!justifFile

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && closeExecuterModal()}>
      <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden bg-white">
        <DialogHeader className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-base font-semibold text-aej-ink flex items-center gap-2">
            <Send className="w-5 h-5 text-green-600" />
            Exécuter le décaissement (N°{numeroToExec})
          </DialogTitle>
        </DialogHeader>

        <div className="p-5 space-y-4">
          <p className="text-[13px] text-slate-500 leading-relaxed">
            Ce décaissement a été autorisé par le partenaire. Vous pouvez maintenant l'exécuter en renseignant les détails du transfert effectif.
          </p>

          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dateExec" className="text-[13px] font-medium text-aej-ink">
                Date d'exécution *
              </Label>
              <Input
                id="dateExec"
                type="date"
                value={dateExec}
                onChange={(e) => setDateExec(e.target.value)}
                className="w-full text-[13px] h-9 focus-visible:ring-1 focus-visible:ring-green-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="justifFile" className="text-[13px] font-medium text-aej-ink">
                Preuve de paiement (reçu de virement, etc.) *
              </Label>
              <Input
                id="justifFile"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setJustifFile(e.target.files?.[0] || null)}
                className="w-full text-[13px] file:text-[13px] file:font-medium file:text-slate-600 focus-visible:ring-1 focus-visible:ring-green-500 h-9 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <Button 
            variant="ghost" 
            onClick={closeExecuterModal} 
            disabled={isSubmitting}
            className="text-slate-600 hover:text-slate-800"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!isFormValid || isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="w-4 h-4 mr-1.5" />
            Exécuter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
