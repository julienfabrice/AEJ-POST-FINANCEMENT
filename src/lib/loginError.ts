import { isAxiosError } from 'axios'
import { CircleAlert, Lock, TriangleAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * Corps d'erreur de `POST /auth/login`

 *   401 → { message, tentative_restant }
 *   423 → { message, tentative_restant: 0, retry_after }
 */
export interface LOGIN_ERROR_RESPONSE_T {
  message?: string
  /** Tentatives restantes avant blocage. */
  tentative_restant?: number
  /** Délai avant déblocage, en SECONDES — parfois fractionnaire (1585.228613). */
  retry_after?: number
}

export type LOGIN_FAILURE_KIND_T = 'invalid_credentials' | 'locked' | 'unknown'

export interface LOGIN_FAILURE_T {
  kind: LOGIN_FAILURE_KIND_T
  /** Message du serveur quand il y en a un, sinon repli générique. */
  message: string
  attemptsRemaining?: number
  /** Secondes entières : le compte à rebours n'affiche pas des décimales. */
  retryAfterSeconds?: number
}

const GENERIC_MESSAGE = 'Identifiants invalides ou service indisponible.'

const finiteNumber = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined

/**
 * Traduit une erreur de connexion en état exploitable par l'écran.
 */
export function parseLoginFailure(error: unknown): LOGIN_FAILURE_T {
  if (!isAxiosError(error)) return { kind: 'unknown', message: GENERIC_MESSAGE }

  const status = error.response?.status
  // Peut être une chaîne (HTML) : l'accès aux propriétés donne `undefined`,
  // ce qui nous ramène proprement aux valeurs par défaut.
  const body = error.response?.data as LOGIN_ERROR_RESPONSE_T | undefined

  const serverMessage = typeof body?.message === 'string' ? body.message : undefined
  const attemptsRemaining = finiteNumber(body?.tentative_restant)

  const rawRetry = finiteNumber(body?.retry_after)
  // Arrondi au SUPÉRIEUR 
  const retryAfterSeconds = rawRetry !== undefined ? Math.ceil(rawRetry) : undefined

  if (status === 423) {
    return {
      kind: 'locked',
      message: serverMessage ?? 'Compte temporairement bloqué.',
      attemptsRemaining,
      retryAfterSeconds,
    }
  }

  if (status === 401) {
    return {
      kind: 'invalid_credentials',
      message: serverMessage ?? 'Identifiants invalides.',
      attemptsRemaining,
    }
  }

  return { kind: 'unknown', message: GENERIC_MESSAGE }
}

/** Ton de l'alerte — la traduction en classes reste à la charge de l'écran. */
export type LOGIN_ALERT_TONE_T = 'warning' | 'destructive'

export interface LOGIN_ALERT_T {
  title: string
  description: string
  icon: LucideIcon
  tone: LOGIN_ALERT_TONE_T
}

/**
 * Traduit un échec de connexion en alerte prête à afficher.
 *
 * Le TITRE porte l'état (« Identifiants invalides », « Compte bloqué ») et la
 * DESCRIPTION porte la conséquence et la marche à suivre. Séparer les deux
 * évite la phrase fourre-tout où l'utilisateur doit deviner ce qu'on attend
 * de lui.
 *
 * Le message du serveur est toujours privilégié quand il existe : c'est lui qui
 * connaît la règle appliquée, et il varie déjà selon les cas
 * (« Trop de tentatives… » / « Nombre maximum de tentatives atteint… »).
 *
 * @param lockRemainingLabel décompte vivant (« 26:25 ») injecté par l'écran, qui
 *   seul possède le minuteur.
 */
export function describeLoginFailure(
  failure: LOGIN_FAILURE_T,
  lockRemainingLabel?: string,
): LOGIN_ALERT_T {
  const { kind, message, attemptsRemaining } = failure

  if (kind === 'locked') {
    return {
      title: message,
      description: lockRemainingLabel
        ? `Trop de tentatives infructueuses. Nouvelle tentative possible dans ${lockRemainingLabel}.`
        : 'Trop de tentatives infructueuses. Réessayez plus tard ou contactez un administrateur.',
      icon: Lock,
      tone: 'destructive',
    }
  }

  if (kind === 'invalid_credentials') {
    // Dernière cartouche : on change le titre ET le ton. Un « il vous reste 1
    // tentative » noyé dans le même jaune que les précédents passe inaperçu.
    if (attemptsRemaining === 1) {
      return {
        title: 'Dernière tentative',
        description: `${message}. Une erreur de plus et le compte sera temporairement bloqué.`,
        icon: TriangleAlert,
        tone: 'destructive',
      }
    }

    if (attemptsRemaining !== undefined && attemptsRemaining > 1) {
      return {
        title: message,
        description: `Il vous reste ${attemptsRemaining} tentatives avant le blocage temporaire du compte.`,
        icon: TriangleAlert,
        tone: 'warning',
      }
    }

    // Le backend n'a pas renvoyé de décompte : on n'en invente pas.
    return {
      title: message,
      description: 'Vérifiez votre adresse e-mail et votre mot de passe.',
      icon: TriangleAlert,
      tone: 'warning',
    }
  }

  return {
    title: 'Connexion impossible',
    description: 'Le service est momentanément indisponible. Réessayez dans quelques instants.',
    icon: CircleAlert,
    tone: 'destructive',
  }
}
