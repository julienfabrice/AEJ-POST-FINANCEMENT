export interface MockTransmissionLot {
  id: string
  reference: string
  dispositif_id: string
  dispositif_code: string
  organisme_id: string
  organisme_label: string
  fichier_repartition: string
  courrier_fichier: string
  courrier_reference: string
  courrier_titre: string
  date_transmission: string
  taux_couverture: number
  duree_differe: number
  duree_remboursement: number
  reference_convention: string
  statut: 'BROUILLON' | 'TRANSMIS' | 'RETOURNE'
  nb_dossiers: number
  dossiers: MockProjetLot[]
}

export interface MockProjetLot {
  id: string
  code: string
  titre: string
  montant: number
  approbation: 'APPROUVE' | 'REJETE' | 'EN_ATTENTE'
}

export interface MockProjetARepartir {
  id: string
  code: string
  titre: string
  jeune_nom: string
  agence: string
  montant: number
  plan_affaires: boolean
}

export const MOCK_TRANSMISSION_LOTS: MockTransmissionLot[] = [
  {
    id: 'lot1',
    reference: 'LOT-MPE-2024-012',
    dispositif_id: 'wf-mpe',
    dispositif_code: 'MPE',
    organisme_id: 'or3',
    organisme_label: 'Banque Atlantique',
    fichier_repartition: 'repartition_mpe_dec2024.xlsx',
    courrier_fichier: 'courrier_transmission_0131.pdf',
    courrier_reference: 'CRT-2024-0131',
    courrier_titre: 'Transmission lot MPE — Décembre 2024',
    date_transmission: '2024-12-10',
    taux_couverture: 70,
    duree_differe: 6,
    duree_remboursement: 24,
    reference_convention: 'CONV-ADV-2024-0055',
    statut: 'RETOURNE',
    nb_dossiers: 12,
    dossiers: [
      { id: 'p1', code: 'MP-2024-1231', titre: 'Atelier de menuiserie', montant: 3900000, approbation: 'REJETE' },
      { id: 'p2', code: 'MP-2024-1232', titre: 'Boutique de cosmétiques', montant: 1000000, approbation: 'APPROUVE' },
    ],
  },
  {
    id: 'lot2',
    reference: 'LOT-AGR-2024-010',
    dispositif_id: 'wf-agr',
    dispositif_code: 'AGR',
    organisme_id: 'or1',
    organisme_label: 'UNACOOPEC-CI',
    fichier_repartition: 'repartition_agr_nov2024.xlsx',
    courrier_fichier: 'courrier_transmission_0112.pdf',
    courrier_reference: 'CRT-2024-0112',
    courrier_titre: 'Transmission lot AGR — Novembre 2024',
    date_transmission: '2024-11-08',
    taux_couverture: 80,
    duree_differe: 3,
    duree_remboursement: 24,
    reference_convention: 'CONV-UNA-2024-0041',
    statut: 'TRANSMIS',
    nb_dossiers: 45,
    dossiers: [
      { id: 'p3', code: 'MP-2024-1100', titre: 'Élevage de volailles', montant: 850000, approbation: 'APPROUVE' },
    ],
  },
]

export const MOCK_PROJETS_A_REPARTIR: MockProjetARepartir[] = [
  {
    id: 'p100',
    code: 'MP-2025-0001',
    titre: 'Vente de friperie',
    jeune_nom: 'Kouassi Jean',
    agence: 'Agence d\'Abobo',
    montant: 500000,
    plan_affaires: true,
  },
  {
    id: 'p101',
    code: 'MP-2025-0002',
    titre: 'Atelier de couture',
    jeune_nom: 'Bamba Aminata',
    agence: 'Agence de Yopougon',
    montant: 800000,
    plan_affaires: true,
  },
  {
    id: 'p102',
    code: 'MP-2025-0003',
    titre: 'Lavage Auto',
    jeune_nom: 'Kone Moussa',
    agence: 'Agence de Cocody',
    montant: 1200000,
    plan_affaires: false,
  },
]

export const MOCK_PARTENAIRES_OPTS = [
  { value: 'or1', label: 'UNACOOPEC-CI' },
  { value: 'or2', label: 'Banque Trésor' },
  { value: 'or3', label: 'Banque Atlantique' },
]

export const MOCK_DISPOSITIFS_OPTS = [
  { value: 'wf-agr', label: 'Activités Génératrices de Revenus (AGR)', code: 'AGR' },
  { value: 'wf-mpe', label: 'Micro et Petites Entreprises (MPE)', code: 'MPE' },
]
