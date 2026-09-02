import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useDispositifForm } from '../hooks/useDispositifForm'
import type { DISPOSITIF_T } from '@/types'

interface DispositifModalProps {
  isOpen: boolean
  onClose: () => void
  dispositifToEdit?: DISPOSITIF_T | null
}

export function DispositifModal({ isOpen, onClose, dispositifToEdit }: DispositifModalProps) {
  const { form, onSubmit, isSubmitting } = useDispositifForm({ dispositifToEdit, onClose })
  const { register, handleSubmit, formState: { errors } } = form

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{dispositifToEdit ? 'Modifier le dispositif' : 'Nouveau dispositif'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" {...register('code')} />
              {errors.code && <p className="text-red-500 text-xs">{errors.code.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="intitule">Intitulé</Label>
              <Input id="intitule" {...register('intitule')} />
              {errors.intitule && <p className="text-red-500 text-xs">{errors.intitule.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget_alloue">Budget alloué</Label>
              <Input id="budget_alloue" type="number" {...register('budget_alloue', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="montant_min">Montant min</Label>
              <Input id="montant_min" type="number" {...register('montant_min', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="montant_max">Montant max</Label>
              <Input id="montant_max" type="number" {...register('montant_max', { valueAsNumber: true })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duree">Durée (mois)</Label>
              <Input id="duree" type="number" {...register('duree', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nbre_emplois_prevu">Emplois prévus</Label>
              <Input id="nbre_emplois_prevu" type="number" {...register('nbre_emplois_prevu', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nbre_micro_projet_prevu">Projets prévus</Label>
              <Input id="nbre_micro_projet_prevu" type="number" {...register('nbre_micro_projet_prevu', { valueAsNumber: true })} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#E7722B] hover:bg-[#C85E18] text-white">
              {isSubmitting ? 'Enregistrement...' : (dispositifToEdit ? 'Enregistrer' : 'Créer')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
