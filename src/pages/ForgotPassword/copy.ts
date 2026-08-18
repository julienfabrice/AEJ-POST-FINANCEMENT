import type { PASSWORD_LINK_MODE_T } from '@/types/auth.types'

/** Seule différence entre les deux modes : les textes. */
export const FORGOT_COPY: Record<
  PASSWORD_LINK_MODE_T,
  {
    title: string
    description: string
    submitLabel: string
    resend: string
    toast: string
  }
> = {
  forgot: {
    title: 'Mot de passe oublié',
    description:
      'Entrez votre adresse email et recevez un lien de réinitialisation de mot de passe',
    submitLabel: 'Envoyer le lien',
    resend: "Vous n'avez pas reçu l'email ? Vérifiez vos spams ou",
    toast: 'Lien de réinitialisation envoyé',
  },
  setup: {
    title: 'Définir mon mot de passe',
    description:
      "Entrez votre adresse email et  recevez un lien pour la définition d'un mot de passe.",
    submitLabel: 'Recevoir mon lien',
    resend: "Vous n'avez pas reçu l'email ? Vérifiez vos spams ou",
    toast: "Lien d'activation envoyé",
  },
}
