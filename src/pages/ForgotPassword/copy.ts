/**
 * Écran 1 — un seul parcours : la réinitialisation d'un compte EXISTANT.
 *
 * Il n'y a pas de mode « première connexion » ici : le lien d'activation est
 * envoyé par le backend à la création du personnel, il ne se demande pas.
 * (Le `mode` continue d'exister sur l'écran 2, porté par le lien email.)
 */
export const FORGOT_COPY = {
  title: 'Mot de passe oublié',
  description: 'Entrez votre adresse email et recevez un lien de réinitialisation de mot de passe',
  submitLabel: 'Envoyer le lien',
  resend: "Vous n'avez pas reçu l'email ? Vérifiez vos spams ou",
  toast: 'Lien de réinitialisation envoyé',
} as const
