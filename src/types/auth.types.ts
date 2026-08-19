import type { API_RESPONSE_T } from '@/types'
import type { PERSONNEL_T } from '@/types/personnels.types'

/** Espace applicatif : sélectionne l'arbre de routes (`_agent` vs `_benef`). */
export type USER_SPACE_T = 'agence' | 'organisme' | 'entreprise'

/** voir · créer · éditer · supprimer */
export type PERMISSION_ACTION_T = 'v' | 'c' | 'e' | 'd'

export interface LOGIN_CREDENTIALS_T {
  email: string
  mot_de_passe: string
}


export type LOGIN_RESPONSE_T = {
  message: string
  user_id: number
  /**
   * Email du compte — identifiant utilisé par `send-otp` et `verify-otp`.
   * Optionnel côté type le temps que le backend le renvoie systématiquement :
   * `authServices.login` retombe sinon sur l'email saisi.
   */
  email?: string
  /** Un second facteur est exigé : la session n'est pas encore ouverte. */
  otp_required?: boolean
  /**
   * Le compte porte un numéro exploitable par WhatsApp. Faux ⇒ le canal
   * WhatsApp n'est pas proposé, seul l'email reste disponible.
   */
  has_phone?: boolean
}

/** `GET /personnel/me` — le profil authentifié. */
export type ME_RESPONSE_T = API_RESPONSE_T<PERSONNEL_T>

export interface LOGIN_RESULT_T {
  userId: number
  /** Identifiant du défi OTP (envoi ET vérification). */
  email: string
  otpRequired: boolean
  /** Conditionne l'affichage du canal WhatsApp sur l'écran OTP. */
  hasPhone: boolean
}

/**
 * Canal d'envoi du code à usage unique. Valeurs en MAJUSCULES : ce sont
 * exactement celles attendues par le backend, pas un libellé d'interface.
 */
export type OTP_METHOD_T = 'MAIL' | 'WHATSAPP'

/** `POST /auth/send-otp` — identifié par l'EMAIL, pas par l'`user_id`. */
export interface SEND_OTP_PAYLOAD_T {
  email: string
  mode: OTP_METHOD_T
}

/**
 * `POST /auth/verify-otp` — identifié par l'EMAIL, comme l'envoi.
 * `mode` doit reprendre le canal RÉELLEMENT utilisé pour l'envoi du code.
 */
export interface VERIFY_OTP_PAYLOAD_T {
  code: string
  email: string
  mode: OTP_METHOD_T
}


export type PASSWORD_LINK_MODE_T = 'reset' | 'setup'

/**
 * Corps de la demande de lien (écran 1). Même vocabulaire de canal que l'OTP
 * (`MAIL` | `WHATSAPP`) : le backend expose la même énumération.
 */
export interface RESET_LINK_PAYLOAD_T {
  email: string
  mode: OTP_METHOD_T
}


export interface SET_PASSWORD_PAYLOAD_T {
  password : string
  token: string
}
