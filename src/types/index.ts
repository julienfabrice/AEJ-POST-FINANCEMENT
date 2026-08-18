export type ZUSTAND_T<T> = {
  (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: false): void;
  (state: T | ((state: T) => T), replace: true): void;
}

export interface USER_T {
  id: number
  nom: string
  prenoms: string
  email: string
  roleId: number
  roleCode: string
  roleLibelle: string
  kind: 'agent' | 'benef'
  agenceId?: number
  organismeId?: number
}

export interface LOGIN_RESPONSE_T {
  token: string
  user: USER_T
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
  nom: string
}

export interface API_RESPONSE_T<T> {
  message: string
  data: T
}

export interface SOUS_SECTEUR_T {
  id: number
  libelle: string
}
