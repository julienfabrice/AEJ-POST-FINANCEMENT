import { useState } from 'react'
import type { PERSONNEL_T } from '@/types/personnels.types'
import { buildDetails, type EditableField } from '../fields'
import { DetailCard } from './DetailCard'
import { EditFieldDialog } from './EditFieldDialog'

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
        {details.map((item) => (
          <DetailCard key={item.label} item={item} onEdit={setEditing} />
        ))}
      </div>

      <EditFieldDialog field={editing} user={user} onClose={() => setEditing(null)} />
    </section>
  )
}
