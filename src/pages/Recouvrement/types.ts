export type RecouvrementTab = 'portefeuille' | 'actions' | 'contentieux' | 'garanties'
export type ActionType = 'APPEL' | 'COURRIER' | 'DECHARGE' | 'MISE_EN_DEMEURE' | 'CONTENTIEUX'

/**
 * Dossier (= micro-projet) agrégé pour les onglets Portefeuille / Contentieux.
 * `id` est gardé en string (micro_projet_id converti) pour rester compatible
 * avec les props existantes de CartePortefeuille/ContentieuxTab.
 */
export interface ProjetRecouvrement {
  id: string
  code: string
  titre: string
  agence: string
  contentieux: boolean

  // Portefeuille : calculé en croisant /remboursements (impayés) et /plan-remboursements (reste dû)
  nbImpayes: number
  retardJours: number
  resteDu: number

  // Nombre d'actions de recouvrement (/recouvrements) enregistrées pour ce dossier
  nbActions: number

  // Rappels de garantie : pas d'équivalent API, restent en mock (cf. GarantiesTab)
  garantieAppelee?: number
  dateRappel?: string
}

export interface ActionRecouvrement {
  id: string
  projetId: string
  type: ActionType
  date: string
  resultat: string
  piece?: string
  agent: string
}

export const RECOUV_TYPE_LABEL: Record<ActionType, string> = {
  APPEL: 'Appel téléphonique',
  COURRIER: 'Courrier',
  DECHARGE: 'Décharge',
  MISE_EN_DEMEURE: 'Mise en demeure',
  CONTENTIEUX: 'Transmission au contentieux',
}
