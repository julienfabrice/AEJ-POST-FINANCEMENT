export type ZUSTAND_T<T> = {
  (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: false): void;
  (state: T | ((state: T) => T), replace: true): void;
}

/**
 * Enveloppe standard des réponses du backend AEJ : `{ message, data }`.
 * Les types de réponse par feature s'en dérivent (voir `auth.types.ts`).
 */
export interface API_RESPONSE_T<T> {
  message: string
  data: T
}

export interface JEUNE_T {
  id: string
  matricule: string
  prenoms: string
  nom: string
  telephone: string
  ville: string
  secteur: string
  nb_projets: number
  actif: boolean
}

export interface PROJET_T {
  id: string
  ref: string
  titre: string
  promoteur: string
  dispositif: string
  agence: string
  montant: string
  statut: string
  date: string
}

export interface SECTEUR_T {
  id: number
  libelle: string
}

export interface API_RESPONSE_T<T> {
  message: string
  data: T
}

export interface SOUS_SECTEUR_T {
  id: number
  libelle: string
}

export interface PIECE_IDENTITE_T {
  id: number
  libelle: string
  description?: string | null
  actif?: boolean
}

export interface SITUATION_MATRIMONIALE_T {
  id: number
  libelle: string
}

export interface INDICATEUR_T {
  id: number
  nom: string
  description?: string | null
  type_valeur: string
  unite: string
  statut: boolean
  created_at?: string
  updated_at?: string
}

export interface TYPE_ENTREPRISE_T {
  id: number
  code: string
  libelle: string
  created_at?: string
  updated_at?: string
}

export interface TYPE_EMPLOI_T {
  id: number
  code: string
  libelle: string
  created_at?: string
  updated_at?: string
}

// --- Unités de gestion (schema.v2.sql) ---

export interface DIRECTION_T {
  id: number
  code: string
  nom: string
  description?: string | null
}

export interface SERVICE_ORG_T {
  id: number
  code: string
  nom: string
  description?: string | null
  direction_id: number
}

export interface FONCTION_T {
  id: number
  code: string
  nom: string
  description?: string | null
  service_id: number
}

export interface GUICHET_T {
  id: number
  workflow_code?: string | null
  code: string
  libelle: string
  description?: string | null
  couleur?: string | null
  montant_min: number
  montant_max: number
  is_active: boolean
  is_form_active: boolean
}

// Référentiel en LECTURE SEULE : synchronisé depuis le portail national
// agenceemploijeunes.ci (endpoint /list-agence-regionale). Pas de création
// possible depuis ce module.
export interface AGENCE_REGIONALE_T {
  id: number
  code: string
  nom: string
  latitude?: string | null
  longitude?: string | null
  contact?: string | null
  localisation?: string | null
  adresse?: string | null
  telephone?: string | null
  email?: string | null
  chef_agence_id?: number | null
}

// --- Partenaires financiers (schema.v2.sql) ---

export interface TYPE_ORGANISME_T {
  id: number
  code: string
  libelle: string
}

export interface ORGANISME_FINANCEMENT_T {
  id: number
  nom: string
  sigle: string
  type: number // FK -> TYPE_ORGANISME_T.id
  site_web?: string | null
  description?: string | null
  adresse?: string | null
  telephone?: string | null
  email?: string | null
  region_id?: number | null
}

// --- Localités (référentiels géographiques /aej/*, lecture seule) ---

export interface DIVISION_REGIONALE_T {
  id: number
  code: string | null
  nom: string
}

export interface VILLE_T {
  id: number
  nom: string
}

export interface COMMUNE_T {
  id: number
  code: string | null
  nom: string
  ville_id: number | null
  divisionregionaleaej_id: number | null
}

export interface LIEU_HABITATION_T {
  id: number
  nom: string
  ville_id: number | null
}
export * from './workflow.types';
export * from './workflow.types';
