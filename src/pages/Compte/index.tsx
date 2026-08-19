import { useAuthStore } from '@/store/useAuthStore'
import { CompteHeader } from './UI/CompteHeader'
import { ProfileDetails } from './UI/ProfileDetails'

/**
 * « Mon compte » — gestion par l'utilisateur de ses PROPRES informations.
 *
 * Aucun contrôle de permission ici : un utilisateur gère toujours son compte.
 * Le profil vient du store, alimenté par le garde `_authenticated` (qui appelle
 * `/auth/me`) — pas de requête supplémentaire au montage.
 */
export function ComptePage() {
  const user = useAuthStore((s) => s.user)

  if (!user) return null

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 p-6">
      <CompteHeader user={user} />
      <ProfileDetails user={user} />
    </div>
  )
}
