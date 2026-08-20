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
export * from './workflow.types';
export * from './workflow.types';
