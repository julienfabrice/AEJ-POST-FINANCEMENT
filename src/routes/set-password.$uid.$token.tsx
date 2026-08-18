import { createFileRoute } from '@tanstack/react-router'
import * as z from 'zod'
import { SetPasswordPage } from '@/pages/SetPassword'

const searchSchema = z.object({
  mode: z.enum(['setup', 'forgot', 'reset']).optional(),
})

/**
 * Écran 2 — cible du lien envoyé par email : `/set-password/{uid}/{token}`.
 * Route PUBLIQUE ; `uid` et `token` sont des PARAMÈTRES DE CHEMIN, ce sont eux
 * qui identifient l'utilisateur en l'absence de session.
 */
export const Route = createFileRoute('/set-password/$uid/$token')({
  validateSearch: searchSchema,
  component: SetPasswordRoute,
})

function SetPasswordRoute() {
  const { uid, token } = Route.useParams()
  return <SetPasswordPage uid={uid} token={token} />
}
