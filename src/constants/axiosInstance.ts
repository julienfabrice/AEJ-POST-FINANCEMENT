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
 * Endpoints du parcours d'authentification : leurs 401 sont des réponses
 * MÉTIER (identifiants faux, code OTP invalide ou expiré), pas une session
 * perdue. Sans cette exclusion, un code OTP erroné éjecterait l'utilisateur de
 * `/2fa/email-otp` vers `/login` et lui ferait perdre son `pendingUserId`.
 * Ces appels remontent leur erreur eux-mêmes (bandeau de formulaire ou toast).
 */
const AUTH_PATHS = [
  '/personnels/login',
  '/personnels/verify-otp',
  '/personnels/send-otp',
  // Parcours mot de passe : non authentifié de bout en bout (lien email).
  '/password/reset/',
  '/password/set/resend/',
  '/password/set/',
]

// 401 → session expired/invalid: clear the local session hint + bounce to login.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? ''
    const isAuthCall = AUTH_PATHS.some((path) => url.includes(path))

    if (error.response?.status === 401 && !isAuthCall) {
      useAuthStore.getState().clearSession()
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)
