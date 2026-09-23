import { Check, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePlanConventionAction } from '../hooks/actions/usePlanConventionAction'

export function PlanConventionModal() {
  const {
    projet,
    isOpen,
    handleClose,
    handleSubmit,
    referenceConvention,
    setReferenceConvention,
    dateSignature,
    setDateSignature,
    setCvFile,
    isSubmitting,
  } = usePlanConventionAction()

  if (!projet) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Convention de prêt — {projet.code}
          </DialogTitle>
          <DialogDescription className="text-slate-600 mt-2">
            <span className="block font-medium text-slate-800">
              {projet.intitule} — {projet.promoteur?.prenom} {projet.promoteur?.nom}
              {projet.organisme?.nom ? ` · ${projet.organisme.nom}` : ''}
            </span>
            <span className="block mt-1">
              Ajout en parallèle de la saisie du plan de décaissement par l'agence régionale.
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="cvRef" className="font-semibold">
                  Réf. de la convention
                </Label>
                <Input
                  id="cvRef"
                  type="text"
                  value={referenceConvention}
                  onChange={(e) => setReferenceConvention(e.target.value)}
                  placeholder="EX: CONV-001"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cvDate" className="font-semibold">
                  Date de signature
                </Label>
                <Input
                  id="cvDate"
                  type="date"
                  value={dateSignature}
                  onChange={(e) => setDateSignature(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="cvFile" className="font-semibold">
                Convention de prêt signée (PDF) *
              </Label>
              <Input
                id="cvFile"
                type="file"
                accept=".pdf"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                placeholder={`convention_pret_${projet.code}.pdf`}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" className="bg-[#E7722B] hover:bg-[#C85E18] text-white" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Enregistrer la convention
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
