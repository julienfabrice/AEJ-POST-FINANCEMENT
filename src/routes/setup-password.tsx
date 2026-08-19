import { createFileRoute } from '@tanstack/react-router'
import * as z from 'zod'
import { SetPasswordPage } from '@/pages/SetPassword'

/**
 * Cible du lien envoyé par email :
 *   /setup-password?mode=setup&token=97c9cc5b…
 *
 * `token` ET `mode` sont des PARAMÈTRES DE REQUÊTE (pas de chemin) :
 *  - `token` remplace la session — c'est lui qui identifie l'utilisateur ;
 *  - `mode` ne sert qu'à l'affichage et au choix de l'endpoint, il n'autorise
 *    rien. La validité du jeton (3 jours) est contrôlée côté backend.
 */
const searchSchema = z.object({
  mode: z.enum(['setup', 'reset']).optional(),
  token: z.string().optional(),
})

export const Route = createFileRoute('/setup-password')({
  validateSearch: searchSchema,
  component: SetupPasswordRoute,
})

function SetupPasswordRoute() {
  const { token, mode } = Route.useSearch()
  // Sans `mode`, on retombe sur la réinitialisation ; sans `token`, la page
  // affiche l'écran « Lien invalide ».
  return <SetPasswordPage token={token} mode={mode ?? 'reset'} />
}
