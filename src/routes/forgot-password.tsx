import { createFileRoute } from '@tanstack/react-router'
import { ForgotPasswordPage } from '@/pages/ForgotPassword'

/**
 * Écran 1 — demande d'un lien de réinitialisation. Route PUBLIQUE.
 *
 * Plus de paramètre `mode` : il n'existe qu'un seul parcours ici (compte
 * existant). Le `mode` reste porté par le lien email vers `/setup-password`.
 */
export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})
