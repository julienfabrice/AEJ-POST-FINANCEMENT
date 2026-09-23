import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAutoriserNumero } from '../../hooks/actions/autoriser/useAutoriserNumero'

interface AutoriserModalProps {
  hook: ReturnType<typeof useAutoriserNumero>
}

export function AutoriserModal({ hook }: AutoriserModalProps) {
  const { isOpen, isSubmitting, numeroToAuth, closeAutoriserModal, submitAutorisation } = hook
  const [dateAuth, setDateAuth] = useState('')
  const [justifFile, setJustifFile] = useState<File | null>(null)

  useEffect(() => {
    if (isOpen) {
      setDateAuth(new Date().toISOString().split('T')[0])
      setJustifFile(null)
    }
  }, [isOpen])

  const handleConfirm = () => {
    // Dans une implémentation réelle on uploaderait le fichier et on récupérerait son ID ou URL.
    // Ici on envoie juste le nom du fichier à notre mutation.
    submitAutorisation(dateAuth, justifFile?.name || 'justificatif.pdf')
  }

  const isFormValid = !!dateAuth && !!justifFile

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && closeAutoriserModal()}>
      <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden bg-white">
        <DialogHeader className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-base font-semibold text-aej-ink flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-amber-600" />
            Autoriser le décaissement (N°{numeroToAuth})
          </DialogTitle>
        </DialogHeader>

        <div className="p-5 space-y-4">
          <p className="text-[13px] text-slate-500 leading-relaxed">
            Vous êtes sur le point d'autoriser toutes les lignes rattachées au numéro {numeroToAuth}.
            Le projet pourra ensuite passer en exécution de décaissement par l'agence régionale.
          </p>

          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dateAuth" className="text-[13px] font-medium text-aej-ink">
                Date d'autorisation *
              </Label>
              <Input
                id="dateAuth"
                type="date"
                value={dateAuth}
                onChange={(e) => setDateAuth(e.target.value)}
                className="w-full text-[13px] h-9 focus-visible:ring-1 focus-visible:ring-amber-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="justifFile" className="text-[13px] font-medium text-aej-ink">
                Justificatif (ordre de virement validé, etc.) *
              </Label>
              <Input
                id="justifFile"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setJustifFile(e.target.files?.[0] || null)}
                className="w-full text-[13px] file:text-[13px] file:font-medium file:text-slate-600 focus-visible:ring-1 focus-visible:ring-amber-500 h-9 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <Button 
            variant="ghost" 
            onClick={closeAutoriserModal} 
            disabled={isSubmitting}
            className="text-slate-600 hover:text-slate-800"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!isFormValid || isSubmitting}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Check className="w-4 h-4 mr-1.5" />
            Autoriser
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
