import axios from 'axios'
import { useAuthStore } from '@/store/useAuthStore'

// Base API URL. Default is the RELATIVE `/api` so the browser stays same-origin
// and the Vite dev proxy (see vite.config.ts) forwards to the backend — this is
// what makes Sanctum's XSRF-TOKEN cookie first-party/readable. Set VITE_API_URL
// to another RELATIVE path only; an absolute cross-site URL reintroduces the
// "CSRF token mismatch" (JS can't read a cookie set for another domain).
const baseURL = import.meta.env.VITE_API_URL || '/api'
// CSRF cookie is served from the origin, without the /api suffix.
const originURL = baseURL.replace(/\/api\/?$/, '')




/**
 * Cookie-based (Sanctum SPA) HTTP client:
 *  - `withCredentials` sends/receives the httpOnly session cookie on every call;
 *  - `withXSRFToken` makes axios echo the `XSRF-TOKEN` cookie as the
 *    `X-XSRF-TOKEN` header (needed cross-origin — the API is a different host).
 * There is NO bearer token: the session lives entirely in the cookie.
 */
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

/**
 * Sanctum CSRF handshake — GET the cookie from the origin before the first
 * mutating request (login). Uses a bare axios call because it targets the origin,
 * not the /api base.
 */
export const ensureCsrf = () =>
  axios.get(`${originURL}/sanctum/csrf-cookie`, { withCredentials: true })

/**
 * Renouvellement de session. Chemin RELATIF à `baseURL` (`/api`) : l'URL réelle
 * est donc `/api/auth/refresh`. `config.url` ne porte jamais le `baseURL`, c'est
 * cette forme courte qui sert aussi de clé de comparaison dans `AUTH_PATHS`.
 */
export const REFRESH_PATH = '/auth/refresh'

/**
 * Endpoints exclus du renouvellement automatique.
 *
 * Leurs 401 sont des réponses MÉTIER (identifiants faux, code OTP invalide,
 * lien expiré) ou, pour `REFRESH_PATH`, l'échec définitif du renouvellement.
 * Les rejouer n'aurait aucun sens — et pour le refresh, cela boucherait à
 * l'infini. Ces appels remontent leur erreur eux-mêmes.
 */
const AUTH_PATHS = [
  '/auth/login',
  '/auth/verify-otp',
  '/auth/send-otp',
  // Parcours mot de passe : non authentifié de bout en bout (lien email).
  // ⚠️ SANS slash final : les routes Laravel sont canoniques sans slash, et un
  // slash de trop provoque une redirection 301 qui transforme le POST en GET.
  '/password/forgot',
  '/password/reset',
  '/password/setup',
  // Changement authentifié : un 401 ici signifie « mot de passe actuel
  // incorrect », pas « session perdue ». Sans cette exclusion, une simple faute
  // de frappe déclencherait un refresh, un REJEU de la requête, puis une
  // déconnexion — au lieu d'un message d'erreur sur le champ.
  '/password/change',
  // Le refresh lui-même : son 401 signifie « session définitivement perdue ».
  REFRESH_PATH,
]

/** Marqueur interne : une requête déjà rejouée ne doit jamais l'être deux fois. */
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retried?: boolean
  }
}

/**
 * File d'attente du renouvellement.
 *
 * La règle : un seul refresh à la fois. Les 401 suivants ne rappellent pas le
 * serveur, ils s'abonnent au refresh en cours et sont rejoués — ou rejetés en
 * bloc — selon son issue.
 */
let isRefreshing = false
let waiters: { resolve: () => void; reject: (reason: unknown) => void }[] = []

const flushWaiters = (error: unknown | null) => {
  waiters.forEach((waiter) => (error ? waiter.reject(error) : waiter.resolve()))
  waiters = []
}

const dropSession = () => {
  useAuthStore.getState().clearSession()
  if (!window.location.pathname.startsWith('/login')) {
    window.location.href = '/login'
  }
}

// 401 → tentative de renouvellement, puis rejeu de la requête d'origine.
// Échec du renouvellement → session vidée + retour /login.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const url = original?.url ?? ''
    const isAuthCall = AUTH_PATHS.some((path) => url.includes(path))

    // Hors 401, sur un endpoint d'auth, ou déjà rejoué : rien à tenter.
    if (error.response?.status !== 401 || isAuthCall || !original) {
      // Un 401 sur le refresh est terminal : la session est perdue pour de bon.
      if (error.response?.status === 401 && url.includes(REFRESH_PATH)) dropSession()
      return Promise.reject(error)
    }

    if (original._retried) {
      // Rejouée et toujours 401 : le renouvellement n'a rien réglé.
      dropSession()
      return Promise.reject(error)
    }
    original._retried = true

    // Un renouvellement est déjà en cours : on s'y accroche au lieu d'en lancer
    // un second, puis on rejoue une fois qu'il a abouti.
    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        waiters.push({ resolve, reject })
      }).then(() => axiosInstance(original))
    }

    isRefreshing = true
    try {

      await axiosInstance.get(REFRESH_PATH)
      flushWaiters(null)
      return await axiosInstance(original)
    } catch (refreshError) {
      // Une seule notification d'échec pour tout le monde.
      flushWaiters(refreshError)
      dropSession()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
