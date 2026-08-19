/**
 * Paramètres de sécurité du parcours d'authentification.
 *
 * PROVISOIREMENT EN DUR. Ces valeurs relèvent de la **configuration système**
 */
export const OTP_CONFIG = {
  /** Nombre de chiffres du code. */
  length: 6,
  /** Durée de validité du code, en secondes. */
  ttlSeconds: 5 * 60,
  /** Délai avant de pouvoir redemander un code, en secondes. */
  resendCooldownSeconds: 30,
} as const

/**
 * Politique de robustesse du mot de passe — SOURCE UNIQUE.
 *
 * `label` alimente le contrôleur visuel (`PasswordChecker`), `message` alimente
 * le schéma Zod (`useSetPasswordSchema`). Les deux sont donc dérivés de la même
 * liste : une règle ajoutée ici apparaît des deux côtés, sans risque d'écart.
 *
 * Relève aussi de la configuration système à terme (cf. `delai_mdp`).
 */
export const PASSWORD_RULES = [
  {
    key: 'length',
    label: '8 caractères',
    message: '8 caractères minimum.',
    test: (v: string) => v.length >= 8,
  },
  {
    key: 'lower',
    label: 'Une lettre minuscule',
    message: 'Au moins une lettre minuscule.',
    test: (v: string) => /[a-z]/.test(v),
  },
  {
    key: 'upper',
    label: 'Une lettre majuscule',
    message: 'Au moins une lettre majuscule.',
    test: (v: string) => /[A-Z]/.test(v),
  },
  {
    key: 'digit',
    label: 'Un chiffre',
    message: 'Au moins un chiffre.',
    test: (v: string) => /\d/.test(v),
  },
  {
    key: 'special',
    label: 'Un caractère spécial',
    message: 'Au moins un caractère spécial.',
    test: (v: string) => /[^A-Za-z0-9]/.test(v),
  },
] as const

/**
 * Lien mot de passe envoyé par email (`/setup-password?mode=…&token=…`).
 * Même réserve que ci-dessus : valeur annoncée à l'utilisateur, appliquée par
 * le serveur.
 */
export const RESET_LINK_CONFIG = {
  /**
   * Durée de validité du lien, en JOURS. Portée à 3 jours côté backend : le
   * lien n'est plus une contrainte de temps forte, on l'annonce simplement.
   */
  ttlDays: 3,
  /** Délai avant de pouvoir redemander un lien, en secondes. */
  resendCooldownSeconds: 60,
} as const


export const formatCountdown = (totalSeconds: number) => {
  const safe = Math.max(0, totalSeconds)
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
