import type { PASSWORD_LINK_MODE_T } from '@/types/auth.types'

/**
 * Le `mode` voyage dans le lien envoyé par email (`?mode=setup|forgot`) et ne
 * sert qu'à l'AFFICHAGE de cet écran — plus aucun contrôle de validité côté
 * frontend, le jeton vit 3 jours et c'est le backend qui tranche.
 *
 * Il sélectionne aussi l'endpoint appelé (deux endpoints distincts, cf.
 * `useSetPasswordForm`).
 */
export const SET_PASSWORD_COPY: Record<
  PASSWORD_LINK_MODE_T,
  { title: string; description: string; submitLabel: string; toast: string }
> = {
  setup: {
    title: 'Définissez votre mot de passe',
    description:
      'Première connexion : choisissez un mot de passe personnel pour activer votre compte.',
    submitLabel: 'Activer mon compte',
    toast: 'Mot de passe défini avec succès',
  },
  reset: {
    title: 'Réinitialisez votre mot de passe',
    description: 'Choisissez un nouveau mot de passe pour retrouver l’accès à votre compte.',
    submitLabel: 'Réinitialiser mon mot de passe',
    toast: 'Mot de passe réinitialisé avec succès',
  },
}
