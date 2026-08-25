import { isAxiosError } from 'axios'

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

/** Compose le message affiché sous le formulaire. */
export function describeLoginFailure(failure: LOGIN_FAILURE_T): string {
  const { kind, message, attemptsRemaining } = failure

  // Le décompte n'a de sens que s'il reste réellement des essais : à 0, c'est
  // le message de blocage qui prend le relais.
  if (kind === 'invalid_credentials' && attemptsRemaining !== undefined && attemptsRemaining > 0) {
    const plural = attemptsRemaining > 1 ? 's' : ''
    return `${message} — il vous reste ${attemptsRemaining} tentative${plural} avant blocage du compte.`
  }

  return message
}
