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


export type LOGIN_RESPONSE_T ={
  message: string
  user_id: number
  /** Un second facteur est exigé : la session n'est pas encore ouverte. */
  otp_required?: boolean
}

/** `GET /personnel/me` — le profil authentifié. */
export type ME_RESPONSE_T = API_RESPONSE_T<PERSONNEL_T>

/**
 * Résultat normalisé du login — pilote la redirection.
 * C'est le SEUL endroit qui connaît l'orthographe des drapeaux backend :
 * un renommage côté API ne coûte qu'une ligne dans `authServices.login`.
 *
 * NB : `mot_de_passe_change` ne figure PAS ici. Le contrôle du mot de passe
 * initial est entièrement côté backend, qui rejette le login le cas échéant.
 */
export interface LOGIN_RESULT_T {
  userId: number
  otpRequired: boolean
}

/** Canal d'envoi du code à usage unique, au choix de l'utilisateur. */
export type OTP_METHOD_T = 'email' | 'sms'

export interface SEND_OTP_PAYLOAD_T {
  user_id: number
  method: OTP_METHOD_T
}

export interface VERIFY_OTP_PAYLOAD_T {
  code: string
  user_id: number
}

/**
 * Parcours mot de passe : les DEUX modes passent par un lien envoyé par email.
 * Seuls les textes et l'endpoint de demande diffèrent.
 *  - `forgot` → utilisateur existant qui a oublié son mot de passe ;
 *  - `setup`  → nouvel utilisateur qui définit le sien (invitation).
 */
export type PASSWORD_LINK_MODE_T = 'forgot' | 'setup'

/** Corps de la demande de lien (écran 1). */
export interface RESET_LINK_PAYLOAD_T {
  email: string
}

/**
 * Corps de la définition du mot de passe (écran 2). `uid` et `token` viennent
 * des PARAMÈTRES D'URL du lien reçu par email — c'est ce couple qui identifie
 * l'utilisateur, il n'y a ni session ni email à ce stade.
 */
export interface SET_PASSWORD_PAYLOAD_T {
  new_password: string
  confirm_new_password: string
  uid: string
  token: string
}
