export type RecouvrementTab = 'portefeuille' | 'actions' | 'contentieux' | 'garanties'
export type ActionType = 'APPEL' | 'COURRIER' | 'CONTENTIEUX'

export interface ProjetRecouvrement {
  id: string
  code: string
  titre: string
  agence: string
  contentieux: boolean
  
  // Data for Portefeuille stats
  nbImpayes: number
  retardJours: number
  resteDu: number
  
  // Data for actions / garanties tabs
  nbActions: number
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

export interface Garantie {
  id: string
  projetId: string
  montantAppele: number
  dateRappel: string
  saisiPar: string
}

// ---------------------------------------------------------
// DONNÉES DE DÉMO (maquette aej-demo.html)
// ---------------------------------------------------------

export const MOCK_PROJETS_RECOUVREMENT: ProjetRecouvrement[] = [
  // p15 : À jour (0 impayé)
  {
    id: 'p15',
    code: 'AGR-2024-0015',
    titre: 'Salon de coiffure moderne',
    agence: 'Agence Régionale d\'Abidjan',
    contentieux: false,
    nbImpayes: 0,
    retardJours: 0,
    resteDu: 160000,
    nbActions: 0,
  },
  // p6 : ≤ 3 impayés
  {
    id: 'p6',
    code: 'AGR-2024-0006',
    titre: 'Restaurant Chez Christelle',
    agence: 'Agence Régionale d\'Abidjan',
    contentieux: false,
    nbImpayes: 1,
    retardJours: 12,
    resteDu: 55000,
    nbActions: 1,
  },
  // p7 : > 3 impayés
  {
    id: 'p7',
    code: 'AGR-2024-0007',
    titre: 'Ferme avicole',
    agence: 'Agence Régionale de Bouaké',
    contentieux: false,
    nbImpayes: 4,
    retardJours: 90,
    resteDu: 168000,
    nbActions: 1,
  },
  // p16 : Contentieux
  {
    id: 'p16',
    code: 'AGR-2024-0016',
    titre: 'Menuiserie artisanale',
    agence: 'Agence Régionale de San-Pédro',
    contentieux: true,
    nbImpayes: 4,
    retardJours: 150,
    resteDu: 160000,
    nbActions: 1,
    garantieAppelee: 120000,
    dateRappel: '2025-01-20',
  }
]

export const MOCK_ACTIONS_RECOUVREMENT: ActionRecouvrement[] = [
  { id: 'rc1', projetId: 'p6', type: 'APPEL', date: '2025-02-05', resultat: 'Promesse de régularisation sous 15 jours.', agent: 'Koffi, CSFM' },
  { id: 'rc2', projetId: 'p7', type: 'COURRIER', date: '2025-01-28', resultat: 'Courrier de rappel remis en main propre.', piece: 'decharge_p7.pdf', agent: 'Koffi, CSFM' },
  { id: 'rc3', projetId: 'p16', type: 'CONTENTIEUX', date: '2025-01-10', resultat: 'Dossier sorti du portefeuille — transmis à l\'avocat de l\'AEJ pour recours en justice.', agent: 'Koffi, CSFM' }
]

export const MOCK_GARANTIES: Garantie[] = [
  { id: 'gr1', projetId: 'p16', montantAppele: 120000, dateRappel: '2025-01-20', saisiPar: 'UNACOOPEC-CI — Agence Plateau' },
  { id: 'gr2', projetId: 'p10', montantAppele: 3120000, dateRappel: '2026-02-10', saisiPar: 'Orange Bank Africa' }
]

export const RECOUV_TYPE_LABEL: Record<ActionType, string> = {
  APPEL: 'Appel téléphonique',
  COURRIER: 'Courrier / Mise en demeure',
  CONTENTIEUX: 'Transmission au contentieux'
}
