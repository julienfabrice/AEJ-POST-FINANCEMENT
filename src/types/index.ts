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

export interface LoginResponse {
  token: string
  user: USER_T
}
