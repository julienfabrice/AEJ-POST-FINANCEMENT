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
