import { useState } from 'react'
import type { PERSONNEL_T } from '@/types/personnels.types'
import { buildDetails, type EditableField } from '../fields'
import { DetailCard } from './DetailCard'
import { EditFieldDialog } from './EditFieldDialog'

/** Endpoint non confirmé — la modification du mot de passe reste fermée. */
const PASSWORD_EDIT_DISABLED = true
const PASSWORD_EDIT_HINT = 'Changement de mot de passe bientôt disponible'

export function ProfileDetails({ user }: { user: PERSONNEL_T }) {
  const [editing, setEditing] = useState<EditableField | null>(null)
  const details = buildDetails(user)

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">Profil</h2>
        <p className="text-sm text-muted-foreground">
          Gérez les informations de {user.prenom}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {details.map((item) => {
          const isPassword = item.field === 'password'
          return (
            <DetailCard
              key={item.label}
              item={item}
              onEdit={setEditing}
              editDisabled={isPassword && PASSWORD_EDIT_DISABLED}
              editDisabledHint={PASSWORD_EDIT_HINT}
            />
          )
        })}
      </div>

      <EditFieldDialog field={editing} user={user} onClose={() => setEditing(null)} />
    </section>
  )
}
