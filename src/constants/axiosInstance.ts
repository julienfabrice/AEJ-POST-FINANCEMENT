import axios, { isAxiosError, type InternalAxiosRequestConfig } from 'axios'
import { AUTH_DISABLED } from '@/constants/devFlags'


const baseURL = import.meta.env.VITE_API_URL || '/api'
// CSRF cookie is served from the origin, without the /api suffix.
const originURL = baseURL.replace(/\/api\/?$/, '')


export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})


export const ensureCsrf = () =>
  axios.get(`${originURL}/sanctum/csrf-cookie`, { withCredentials: true })

/* ------------------------------------------------------------------ *
 * 1. Classement des routes                                            *
 * ------------------------------------------------------------------ */


export const REFRESH_PATH = '/auth/refresh'

/**
 * Endpoints exclus du renouvellement automatique.
 */
const NO_REFRESH_PATHS = [
  '/auth/login',
  '/auth/verify-otp',
  '/auth/send-otp',
  '/password/forgot',
  '/password/reset',
  '/password/setup',
  '/password/change',
]

/**
 * Comparaison des url par segment
 */
const pathOf = (url = '') => {
  const clean = url.split(/[?#]/)[0]
  return clean.startsWith(baseURL) ? clean.slice(baseURL.length) : clean
}

const matches = (url: string | undefined, candidates: string[]) => {
  const path = pathOf(url)
  return candidates.some((p) => path === p || path.startsWith(`${p}/`))
}

/** Marqueur interne : une requête déjà rejouée ne doit jamais l'être deux fois. */
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retried?: boolean
  }
}

/* ------------------------------------------------------------------ *
 * 2. Perte de session                                                 *
 * ------------------------------------------------------------------ */


type SessionLostHandler = () => void

let onSessionLost: SessionLostHandler = () => {
  // Repli si l'app n'a pas encore branché son handler (ex. erreur au boot).
  if (!window.location.pathname.startsWith('/login')) {
    window.location.href = '/login'
  }
}

export const setSessionLostHandler = (handler: SessionLostHandler) => {
  onSessionLost = handler
}

/** Une seule notification de perte de session, même si 10 requêtes échouent. */
let sessionLost = false

const dropSession = () => {
  
  if (AUTH_DISABLED) return

  if (sessionLost) return
  sessionLost = true
  onSessionLost()
}

/** À appeler après un login réussi, pour réarmer le garde ci-dessus. */
export const resetSessionGuard = () => {
  sessionLost = false
}

/* ------------------------------------------------------------------ *
 * 3. Renouvellement : une promesse partagée, pas une file d'attente   *
 * ------------------------------------------------------------------ */


let refreshPromise: Promise<unknown> | null = null

const refreshSession = () => {
  refreshPromise ||= axiosInstance.get(REFRESH_PATH).finally(() => {
    refreshPromise = null
  })
  return refreshPromise
}

/* ------------------------------------------------------------------ *
 * 4. L'intercepteur                                                   *
 * ------------------------------------------------------------------ */


// Échec du renouvellement → session perdue.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error)) throw error

    const original = error.config as InternalAxiosRequestConfig | undefined
    if (error.response?.status !== 401 || !original) throw error

    // a) 401 sur le refresh lui-même : terminal, le refresh token est mort.
    if (matches(original.url, [REFRESH_PATH])) {
      dropSession()
      throw error
    }

    // b) 401 métier : c'est un message pour l'utilisateur, pas une session morte.
    if (matches(original.url, NO_REFRESH_PATHS)) throw error

    // c) Déjà rejouée et toujours 401 : le renouvellement n'a rien réglé.
    if (original._retried) {
      dropSession()
      throw error
    }
    original._retried = true

    try {
      await refreshSession()
    } catch {
     
      throw error
    }

    return axiosInstance(original)
  },
)