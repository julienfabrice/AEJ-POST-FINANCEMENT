import { FileText, Check, Loader2 } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { useJoindrePlanAction } from '../hooks/actions/useJoindrePlanAction'
import { DeliverableUploadSection } from './DeliverableUploadSection'

export function JoindrePlanModal() {
  const { 
    projet,
    isOpen,
    handleClose,
    handleSubmit,
    observation,
    setObservation,
    setPaFile,
    isSubmitting,
    etapeDeliverables,
    isLoadingConfig,
    sources,
    setFile,
    setExistingDocument,
  } = useJoindrePlanAction()

  if (!projet) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Plan d'affaires — {projet.code}
          </DialogTitle>
          <DialogDescription className="text-slate-600 mt-2">
            <span className="block font-medium text-slate-800">
              {projet.intitule} — {projet.promoteur?.prenom} {projet.promoteur?.nom}
            </span>
            <span className="block mt-1">
              Une fois le plan joint, il doit être validé par le chef d'agence régionale avant transmission au chef de service.
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Ancien champ Plan d'affaires obligatoire */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="paFile" className="font-semibold">
                Fichier du plan d'affaires *
              </Label>
              <Input
                id="paFile"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setPaFile(e.target.files?.[0] || null)}
              />
            </div>

            {/* Nouveaux champs livrables génériques */}
            <DeliverableUploadSection
              etapeDeliverables={etapeDeliverables}
              isLoadingConfig={isLoadingConfig}
              sources={sources}
              setFile={setFile}
              setExistingDocument={setExistingDocument}
              microProjetId={projet.id}
            />
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="paObs" className="font-semibold">
                Observation (facultatif)
              </Label>
              <Textarea
                id="paObs"
                rows={3}
                placeholder="Points d'attention relevés lors de l'accompagnement..."
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 bg-blue-50 text-blue-800 p-3 rounded-md text-sm">
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span>
                Le plan d'affaires est produit pendant la formation des promoteurs <em>— cycle PRCO 1.5</em>
              </span>
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
              Joindre et soumettre au CAR
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
