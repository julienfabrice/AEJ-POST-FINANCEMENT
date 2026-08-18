import { axiosInstance, ensureCsrf } from '@/constants/axiosInstance'
import type {
  LOGIN_CREDENTIALS_T,
  LOGIN_RESPONSE_T,
  LOGIN_RESULT_T,
  ME_RESPONSE_T,
  OTP_METHOD_T,
  PASSWORD_LINK_MODE_T,
  SEND_OTP_PAYLOAD_T,
  SET_PASSWORD_PAYLOAD_T,
  VERIFY_OTP_PAYLOAD_T,
} from '@/types/auth.types'
import type { PERSONNEL_T } from '@/types/personnels.types'

const BASE_URL = '/personnels'

/**
 * Couche transport de l'authentification : une méthode = un endpoint.
 *
 * C'est le SEUL endroit qui connaît les chemins, les enveloppes `{ message, data }`
 * et les contraintes Sanctum (handshake CSRF). Les hooks (`hooks/auth.hooks.ts`)
 * s'en servent et gèrent l'orchestration : cache TanStack Query et session Zustand.
 */
export const authServices = {
  /**
   * Connexion cookie (Sanctum SPA) : handshake CSRF, puis credentials — le
   * serveur pose le cookie de session.
   *
   * Normalise la réponse en `LOGIN_RESULT_T` : c'est le seul endroit qui connaît
   * l'orthographe des drapeaux backend (`otp_required`).
   *
   * Le backend rejette lui-même le login si le mot de passe initial n'a jamais
   * été changé — aucun drapeau à interpréter ici.
   */
  login: async (credentials: LOGIN_CREDENTIALS_T): Promise<LOGIN_RESULT_T> => {
    await ensureCsrf()
    const {data} = await axiosInstance.post<LOGIN_RESPONSE_T>(`${BASE_URL}/login`, credentials)
    return {
      userId: data.user_id,
      // otpRequired: !!data.otp_required,
      otpRequired : true
    }
  },

  /**
   * Le profil authentifié — le cookie part seul avec la requête.
   * ⚠️ Chemin au SINGULIER (`/personnel/me`), volontairement hors `BASE_URL` :
   * c'est bien ce qu'expose le backend. Ne pas « corriger » en `/personnels/me`.
   */
  me: async (): Promise<PERSONNEL_T> => {
    const { data } = await axiosInstance.get<ME_RESPONSE_T>('/personnel/me')
    return data.data
  },

  /** Valide le code à 6 chiffres saisi par l'utilisateur. */
  verifyOtp: async (payload: VERIFY_OTP_PAYLOAD_T): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/verify-otp`, payload)
  },

  /**
   * Demande l'envoi d'un code sur le canal choisi par l'utilisateur.
   * `method` et `user_id` partent ensemble : le backend expédie puis attend la
   * vérification.
   */
  sendOtp: async (userId: number, method: OTP_METHOD_T): Promise<void> => {
    const payload: SEND_OTP_PAYLOAD_T = { user_id: userId, method }
    await axiosInstance.post(`${BASE_URL}/send-otp`, payload)
  },

  /**
   * Écran 1 — demande du lien envoyé par email. Le `mode` ne change QUE
   * l'endpoint : `setup` renvoie un lien d'invitation, `forgot` un lien de
   * réinitialisation. Les deux atterrissent sur le même écran `/set-password`.
   */
  requestResetLink: async (email: string, mode: PASSWORD_LINK_MODE_T): Promise<void> => {
    await ensureCsrf()
    const url = mode === 'setup' ? '/password/set/resend/' : '/password/reset/'
    await axiosInstance.post(url, { email })
  },

  /**
   * Écran 2 — définition effective du mot de passe. `uid` et `token`
   * proviennent des paramètres d'URL du lien reçu : c'est le seul élément qui
   * identifie l'utilisateur (aucune session à ce stade).
   */
  setPassword: async (payload: SET_PASSWORD_PAYLOAD_T): Promise<void> => {
    await ensureCsrf()
    await axiosInstance.post('/password/set/', payload)
  },

  /** Invalide la session côté serveur. */
  logout: async (): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/logout`)
  },
}
