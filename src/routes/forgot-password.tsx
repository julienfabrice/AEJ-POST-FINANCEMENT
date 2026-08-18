import { createFileRoute } from '@tanstack/react-router'
import * as z from 'zod'
import { ForgotPasswordPage } from '@/pages/ForgotPassword'

const searchSchema = z.object({
  mode: z.enum(['setup', 'forgot']).optional(),
})

/**
 * Écran 1 — demande du lien. Route PUBLIQUE : l'utilisateur n'a pas de session.
 * `mode` ne change que les textes et l'endpoint appelé.
 */
export const Route = createFileRoute('/forgot-password')({
  validateSearch: searchSchema,
  component: ForgotPasswordRoute,
})

function ForgotPasswordRoute() {
  const { mode } = Route.useSearch()
  return <ForgotPasswordPage mode={mode ?? 'forgot'} />
}
