

import type { PERMISSION_T } from '@/types/permissions.types'

export interface ROLE_T {
  id: number
  code: string
  libelle: string
  description: string | null
  is_active: number
  created_at: string
  updated_at: string
}

export interface FONCTION_T {
  id: number
  nom: string
  code: string
  description: string | null
  service_id: number
  created_at: string
  updated_at: string
}


export interface AGENCE_T {
  id: number
  code: string
  libelle: string
}

export interface ORGANISME_T {
  id: number
  code: string
  libelle: string
}

export interface PERSONNEL_T {
  id: number
  nom: string
  prenom: string
  email: string
  telephone: string | null
  adresse: string | null
  profile_picture? : string 
  role_id: number
  fonction_id: number | null
  organisme_id: number | null
  agence_regionale_id: number | null

  // Booléens Laravel (tinyint) : 0 | 1, pas `boolean`.
  is_active: number
  mot_de_passe_change: number

  created_at: string
  updated_at: string

  // Relations chargées par `/me` (eager loading côté backend).
  role: ROLE_T | null
  fonction: FONCTION_T | null
  agence: AGENCE_T | null
  organisme: ORGANISME_T | null

  /**
   * Permissions du compte, déjà portées à son rôle par le backend. C'est la
   * SEULE source des droits côté frontend — le rôle ne donne aucune capacité.
   */
  permissions: PERMISSION_T[]
}
