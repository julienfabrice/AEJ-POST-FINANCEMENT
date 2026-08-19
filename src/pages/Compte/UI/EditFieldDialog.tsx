import type { ReactNode } from 'react'
import { KeyRound, MapPin, Phone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { PERSONNEL_T } from '@/types/personnels.types'
import { AdresseForm } from '../components/AdresseForm'
import { ChangePasswordForm } from '../components/ChangePasswordForm'
import { TelephoneForm } from '../components/TelephoneForm'
import type { EditableField } from '../fields'

interface EditFieldDialogProps {
  field: EditableField | null
  user: PERSONNEL_T
  onClose: () => void
}

/**
 * Même habillage pour tous les champs : icône, titre, description, puis le
 * petit formulaire propre au champ. Seule cette table change quand on rend un
 * champ modifiable.
 */
function useFieldItem(
  field: EditableField,
  user: PERSONNEL_T,
  onClose: () => void,
): { label: string; icon: LucideIcon; description: string; component: ReactNode } {
  const items: Record<
    EditableField,
    { label: string; icon: LucideIcon; description: string; component: ReactNode }
  > = {
    telephone: {
      label: 'Téléphone',
      icon: Phone,
      description: 'Modifier votre numéro de téléphone',
      component: <TelephoneForm currentValue={user.telephone} onSuccess={onClose} />,
    },
    adresse: {
      label: 'Adresse',
      icon: MapPin,
      description: 'Modifier votre adresse',
      component: <AdresseForm currentValue={user.adresse} onSuccess={onClose} />,
    },
    password: {
      label: 'Mot de passe',
      icon: KeyRound,
      description: 'Modifier votre mot de passe',
      component: <ChangePasswordForm />,
    },
  }

  return items[field]
}

export function EditFieldDialog({ field, user, onClose }: EditFieldDialogProps) {
  return (
    <Dialog open={field !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[95%] overflow-y-auto sm:max-w-lg">
        {field && <EditFieldBody field={field} user={user} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  )
}

function EditFieldBody({
  field,
  user,
  onClose,
}: {
  field: EditableField
  user: PERSONNEL_T
  onClose: () => void
}) {
  const { label, icon: Icon, description, component } = useFieldItem(field, user, onClose)

  return (
    <>
      <DialogHeader className="items-center">
        <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-primary/10">
          <Icon className="size-7 text-primary" />
        </div>
        <DialogTitle className="text-center">{label}</DialogTitle>
        <DialogDescription className="text-center">{description}</DialogDescription>
      </DialogHeader>

      {component}
    </>
  )
}
