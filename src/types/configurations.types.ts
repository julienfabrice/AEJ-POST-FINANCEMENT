/**
 * Configuration globale du système (table `configurations`, ligne unique).
 */
export type SMTP_ENCRYPTION_T = 'tls' | 'ssl' | 'none'

export interface CONFIGURATION_T {
  id: number
  logo_systeme: string | null
  sigle_systeme: string
  intitule_systeme: string
  sigle_structure: string
  intitule_structure: string
  logo_structure: string | null
  adresse_sociale_structure: string | null
  email_structure: string
  whatsapp_structure: string
  telephone_structure: string
  sigle_monnaie_pays: string
  sigle_devise_principale: string
  taux_devise_principale: number
  mise_en_maintenance: boolean
  delai_inactivite_minutes: number
  nombre_session_possible: number
  nombre_tentatives_connexion: number
  delai_code_otp_minutes: number
  delai_changement_mdp_mois: number
  delai_suppression_secondes: number
  code_instance_whatsapp: string | null
  token_instance_whatsapp: string | null
  email_notifications: string
  mot_de_passe_email_notifications: string
  smtp_email_notifications: string
  smtp_host_notifications: string
  smtp_port_notifications: number
  smtp_encrypt_notifications: SMTP_ENCRYPTION_T
  created_at: string | null
  updated_at: string | null
}

type NULLABLE_OPTIONAL_KEYS =
  | 'logo_systeme'
  | 'logo_structure'
  | 'adresse_sociale_structure'
  | 'code_instance_whatsapp'
  | 'token_instance_whatsapp'

export type UPDATE_CONFIGURATION_T = Omit<
  CONFIGURATION_T,
  'id' | 'created_at' | 'updated_at' | NULLABLE_OPTIONAL_KEYS
> & {
  [K in NULLABLE_OPTIONAL_KEYS]?: string | null
}
