import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check, AlertTriangle } from 'lucide-react'
import type { DecisionType } from '@/pages/Projets/hooks/actions/examiner/useDecision'

interface DecisionModalProps {
  isOpen: boolean
  decisionType: DecisionType
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (motif: string) => void
  projetCode?: string
}

export function DecisionModal({
  isOpen,
  decisionType,
  isSubmitting,
  onClose,
  onSubmit,
  projetCode
}: DecisionModalProps) {
  const [motif, setMotif] = useState('')

  useEffect(() => {
    if (isOpen) {
      setMotif('')
    }
  }, [isOpen])

  const isValide = decisionType === 'VALIDE'
  const title = isValide ? 'Valider le dossier' : 'Ajourner le dossier'
  const displayCode = projetCode ? ` — ${projetCode}` : ''
  
  const handleConfirm = () => {
    onSubmit(motif)
  }

  const isFormValid = isValide || motif.trim().length > 0

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden bg-white">
        <DialogHeader className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-base font-semibold text-aej-ink flex items-center gap-2">
            {!isValide && <AlertTriangle className="w-5 h-5 text-red-500" />}
            {title}{displayCode}
          </DialogTitle>
        </DialogHeader>

        <div className="p-5">
          <p className="text-[13px] text-slate-500 mb-4 leading-relaxed">
            {isValide 
              ? "Cette validation fera avancer le dossier à l'étape suivante dans le parcours du workflow."
              : "Le dossier retournera à la première étape pour correction. Veuillez indiquer le motif de ce rejet."}
          </p>

          <div className="space-y-2">
            <label htmlFor="motif" className="text-[13px] font-medium text-aej-ink">
              {isValide ? "Observation (facultatif)" : "Motif de l'ajournement *"}
            </label>
            <textarea
              id="motif"
              rows={3}
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              placeholder={isValide ? "Ajouter une note ou un commentaire..." : "Expliquez pourquoi le dossier est ajourné..."}
              className="w-full text-[13px] p-3 border border-aej-line rounded-md focus:outline-none focus:ring-1 focus:ring-aej-blue focus:border-aej-blue placeholder:text-slate-400 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            disabled={isSubmitting}
            className="text-slate-600 hover:text-slate-800"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!isFormValid || isSubmitting}
            variant={isValide ? 'default' : 'destructive'}
            className={isValide ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700"}
          >
            <Check className="w-4 h-4 mr-1.5" />
            {isValide ? "Valider la décision" : "Confirmer l'ajournement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
