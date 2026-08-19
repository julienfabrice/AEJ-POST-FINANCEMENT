import { axiosInstance, ensureCsrf } from '@/constants/axiosInstance'
import type {
  LOGIN_CREDENTIALS_T,
  LOGIN_RESPONSE_T,
  LOGIN_RESULT_T,
  ME_RESPONSE_T,
  OTP_METHOD_T,
  RESET_LINK_PAYLOAD_T,
  SEND_OTP_PAYLOAD_T,
  SET_PASSWORD_PAYLOAD_T,
  VERIFY_OTP_PAYLOAD_T,
} from '@/types/auth.types'
import type { PERSONNEL_T } from '@/types/personnels.types'

const BASE_URL = '/auth'


export const authServices = {
  
  login: async (credentials: LOGIN_CREDENTIALS_T): Promise<LOGIN_RESULT_T> => {
    await ensureCsrf()
    const {data} = await axiosInstance.post<LOGIN_RESPONSE_T>(`${BASE_URL}/login`, credentials)
    return {
      userId: data.user_id,
      // L'email renvoyé par le backend fait autorité ; à défaut, on retombe sur
      // celui qui vient d'être saisi. Sans ce filet, un backend qui ne renvoie
      // pas encore le champ produit `email: undefined` — que `JSON.stringify`
      // supprime silencieusement du corps, d'où un « email field is required ».
      email: data.email ?? credentials.email,
      otpRequired: !!data.otp_required,
      hasPhone: !!data.has_phone,
    }
  },

//  Recuperation des infos de l'utilisateur connecté
  me: async (): Promise<PERSONNEL_T> => {
    const { data } = await axiosInstance.get<ME_RESPONSE_T>(`${BASE_URL}/me`)
    return data.data
  },

  /** Valide le code à 6 chiffres saisi par l'utilisateur. */
  verifyOtp: async (payload: VERIFY_OTP_PAYLOAD_T): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/verify-otp`, payload)
  },

  /**
   * Envoi du code sur le canal choisi. L'utilisateur est identifié par son
   * EMAIL (et non par `user_id`, contrairement à la vérification).
   */
  sendOtp: async (email: string, mode: OTP_METHOD_T): Promise<void> => {
    // Échouer ici plutôt que d'envoyer `{ mode }` seul : `JSON.stringify` retire
    // les clés `undefined`, et le backend répondrait « email field is required »
    // sans qu'on sache d'où vient le trou.
    if (!email) throw new Error('Email manquant pour l’envoi du code.')
    const payload: SEND_OTP_PAYLOAD_T = { email, mode }
    await axiosInstance.post(`${BASE_URL}/send-otp`, payload)
  },

  /**
   * Demande d'un lien de réinitialisation.
   *
   *  Uniquement pour un compte EXISTANT qui a oublié son mot de passe. 
   */
  requestResetLink: async (email: string): Promise<void> => {
    await ensureCsrf()
    // TODO(canal) : `mode` est figé sur MAIL. Le jour où l'utilisateur pourra
    // choisir WhatsApp, le remonter en paramètre — l'écran 1 devra alors
    // afficher un sélecteur, comme l'écran OTP (`MethodPicker`).
    const payload: RESET_LINK_PAYLOAD_T = { email, mode: 'MAIL' }
    await axiosInstance.post('/password/forgot', payload)
  },

//  Definition du mot de passe
  setPassword: async (payload: SET_PASSWORD_PAYLOAD_T): Promise<void> => {
    await ensureCsrf()
    await axiosInstance.post('/password/setup', payload)
  },

  // Reiitialisation du mot de passe 
  resetPassword : async (payload : SET_PASSWORD_PAYLOAD_T) => {
    await ensureCsrf()
    await axiosInstance.post('/password/reset', payload)
  },

  /** Invalide la session côté serveur. */
  logout: async (): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/logout`)
  },
}
