export interface OBSERVATION_T {
  id: number
  micro_projet_id?: number
  workflow_instance_id?: number
  user_id?: number
  user?: {
    id: number
    nom: string
    prenom: string
    role?: { libelle: string }
  }
  contenu: string
  created_at: string
  updated_at?: string
}
