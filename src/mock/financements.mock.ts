export interface MockBudget {
  id: string
  projet_id: string
  projet_code: string
  projet_titre: string
  promoteur: string
  reference_courrier: string
  titre_courrier: string
  date_transmission: string
  taux_couverture: number
  duree_differe: number
  reference_convention: string
  date_ouverture_compte: string
  montant: number
  approbation: string
  taux_interet: number
  duree_pret: number
  duree_remboursement: number
  convention: string
  deblocage: string
}

export interface MockDepense {
  id: string
  micro_projet_id: string
  projet_code: string
  projet_titre: string
  promoteur: string
  categorie: string
  intitule: string
  montant_depense: number
  date_depense: string
}

export const MOCK_BUDGETS: MockBudget[] = [
  {
    id: 'b1',
    projet_id: 'p1',
    projet_code: 'MP-2024-1100',
    projet_titre: 'Élevage de volailles',
    promoteur: 'Kouassi Jean',
    reference_courrier: 'CRT-2024-0112',
    titre_courrier: 'Transmission lot AGR — Novembre 2024',
    date_transmission: '2024-11-08',
    taux_couverture: 80,
    duree_differe: 3,
    reference_convention: 'CONV-UNA-2024-0041',
    date_ouverture_compte: '2024-11-15',
    montant: 850000,
    approbation: 'APPROUVE',
    taux_interet: 8,
    duree_pret: 24,
    duree_remboursement: 24,
    convention: 'SIGNEE',
    deblocage: 'PARTIEL',
  },
  {
    id: 'b2',
    projet_id: 'p2',
    projet_code: 'MP-2024-1101',
    projet_titre: 'Boutique de cosmétiques',
    promoteur: 'Kouadio Amoin',
    reference_courrier: 'CRT-2024-0108',
    titre_courrier: 'Transmission lot AGR — Novembre 2024',
    date_transmission: '2024-11-05',
    taux_couverture: 80,
    duree_differe: 3,
    reference_convention: 'CONV-UNA-2024-0038',
    date_ouverture_compte: '2024-11-10',
    montant: 1000000,
    approbation: 'APPROUVE',
    taux_interet: 8,
    duree_pret: 24,
    duree_remboursement: 24,
    convention: 'SIGNEE',
    deblocage: 'DEBLOQUE',
  },
  {
    id: 'b9',
    projet_id: 'p9',
    projet_code: 'MP-2024-1231',
    projet_titre: 'Atelier de menuiserie',
    promoteur: 'Kone Moussa',
    reference_courrier: 'CRT-2024-0131',
    titre_courrier: 'Transmission lot MPE — Décembre 2024',
    date_transmission: '2024-12-10',
    taux_couverture: 70,
    duree_differe: 6,
    reference_convention: 'CONV-ADV-2024-0055',
    date_ouverture_compte: '2024-12-18',
    montant: 3900000,
    approbation: 'APPROUVE',
    taux_interet: 10,
    duree_pret: 24,
    duree_remboursement: 24,
    convention: 'SIGNEE',
    deblocage: 'NON',
  },
]

export const MOCK_DEPENSES: MockDepense[] = [
  {
    id: 'dp1',
    micro_projet_id: 'p1',
    projet_code: 'MP-2024-1100',
    projet_titre: 'Élevage de volailles',
    promoteur: 'Kouassi Jean',
    categorie: 'MATERIEL',
    intitule: 'Achat de mangeoires et abreuvoirs',
    montant_depense: 150000,
    date_depense: '2024-11-20',
  },
  {
    id: 'dp2',
    micro_projet_id: 'p1',
    projet_code: 'MP-2024-1100',
    projet_titre: 'Élevage de volailles',
    promoteur: 'Kouassi Jean',
    categorie: 'STOCK',
    intitule: 'Achat de poussins (1er lot)',
    montant_depense: 300000,
    date_depense: '2024-11-25',
  },
  {
    id: 'dp3',
    micro_projet_id: 'p2',
    projet_code: 'MP-2024-1101',
    projet_titre: 'Boutique de cosmétiques',
    promoteur: 'Kouadio Amoin',
    categorie: 'MATERIEL',
    intitule: 'Aménagement boutique (étagères)',
    montant_depense: 250000,
    date_depense: '2024-11-15',
  },
  {
    id: 'dp4',
    micro_projet_id: 'p2',
    projet_code: 'MP-2024-1101',
    projet_titre: 'Boutique de cosmétiques',
    promoteur: 'Kouadio Amoin',
    categorie: 'STOCK',
    intitule: 'Stock initial de produits capillaires',
    montant_depense: 400000,
    date_depense: '2024-11-18',
  },
]
