// ---------- Types -------------------------------------------------------

export type LotStatut = 'ENVOYE' | 'EN_COURS' | 'RETOURNE'
export type BudgetApprobation = 'EN_ATTENTE' | 'APPROUVE' | 'REJETE'
export type LigneStatut = 'PREVU' | 'AUTORISE' | 'EXECUTE'
export type RembStatut = 'A_JOUR' | 'IMPAYE' | 'CONTENTIEUX'

// ---------- Lots transmis ------------------------------------------------

export interface MockDossier {
  id: string
  code: string
  titre: string
  promoteur: string
  montant: number
  approbation: BudgetApprobation
  montant_credit?: number
  taux_interet?: number
  duree_pret?: number
  duree_remboursement?: number
  date_ouverture_compte?: string
  motif_rejet?: string
  piece_convention?: string
}

export interface MockLot {
  id: string
  reference: string
  partenaire: string
  dispositif: string
  date_transmission: string
  courrier_reference: string
  taux_couverture: number
  duree_differe: number
  duree_remboursement: number
  reference_convention: string
  statut: LotStatut
  dossiers: MockDossier[]
}

// ---------- Plans de décaissement ----------------------------------------

export interface MockLignePlan {
  id: string
  num: number
  libelle: string
  montant: number
  statut: LigneStatut
  date_prevue?: string
  date_autorisation?: string
  date_execution?: string
  justif_autorisation?: string
  justif_execution?: string
  ordre?: string
}

export interface MockPlan {
  id: string
  projet_id: string
  projet_titre: string
  promoteur: string
  agence: string
  statut: 'BROUILLON' | 'EN_VALIDATION' | 'TRANSMIS_PF' | 'AJOURNE'
  voie: 'AGENCE' | 'DIRECTION'
  valide_benef: boolean
  montant_credit: number
  lignes: MockLignePlan[]
  note?: string
  cree: string
}

// ---------- Remboursements ------------------------------------------------

export interface MockRemboursement {
  id: string
  projet_id: string
  code: string
  titre: string
  promoteur: string
  agence: string
  partenaire: string
  montant_credit: number
  montant_rembourse: number
  montant_du: number
  date_debut: string
  date_fin: string
  nb_echeances: number
  nb_impayes: number
  jours_retard: number
  statut: RembStatut
}

// ---------- Garanties appelées -------------------------------------------

export interface MockGarantie {
  id: string
  code: string
  titre: string
  promoteur: string
  partenaire: string
  montant_appele: number
  date_rappel: string
  motif: string
}

// ==========================================================================
// DONNÉES
// ==========================================================================

export const MOCK_LOTS: MockLot[] = [
  {
    id: 'lot-001',
    reference: 'LOT-2025-AGR-0041',
    partenaire: 'SIB — Société Ivoirienne de Banque',
    dispositif: 'AGR Classique',
    date_transmission: '15/01/2025',
    courrier_reference: 'DPF/SDRF/2025/001',
    taux_couverture: 100,
    duree_differe: 3,
    duree_remboursement: 24,
    reference_convention: 'CONV-SIB-2025-001',
    statut: 'ENVOYE',
    dossiers: [
      {
        id: 'd-001',
        code: 'PRJ-2025-0041',
        titre: 'Ferme Avicole Moderne',
        promoteur: 'Kouamé Yao Brice',
        montant: 1_500_000,
        approbation: 'APPROUVE',
        montant_credit: 1_500_000,
        taux_interet: 8,
        duree_pret: 24,
        duree_remboursement: 24,
        date_ouverture_compte: '20/01/2025',
        piece_convention: 'convention_PRJ-2025-0041.pdf',
      },
      {
        id: 'd-002',
        code: 'PRJ-2025-0038',
        titre: 'Boutique Prêt-à-porter',
        promoteur: 'Diabaté Fatoumata',
        montant: 2_000_000,
        approbation: 'EN_ATTENTE',
      },
      {
        id: 'd-003',
        code: 'PRJ-2025-0035',
        titre: 'Plantation de Maraîcher',
        promoteur: 'Koné Ibrahim',
        montant: 800_000,
        approbation: 'REJETE',
        motif_rejet: 'Dossier incomplet — plan d\'affaires manquant',
      },
    ],
  },
  {
    id: 'lot-002',
    reference: 'LOT-2025-MEPS-0028',
    partenaire: 'COOPEC-CI',
    dispositif: 'MEPS',
    date_transmission: '10/01/2025',
    courrier_reference: 'DPF/SDRF/2025/002',
    taux_couverture: 80,
    duree_differe: 6,
    duree_remboursement: 36,
    reference_convention: 'CONV-COOPEC-2025-001',
    statut: 'EN_COURS',
    dossiers: [
      {
        id: 'd-004',
        code: 'PRJ-2025-0028',
        titre: 'Atelier de Menuiserie',
        promoteur: 'Ouattara Seydou',
        montant: 1_200_000,
        approbation: 'APPROUVE',
        montant_credit: 1_200_000,
        taux_interet: 8,
        duree_pret: 36,
        duree_remboursement: 36,
        date_ouverture_compte: '18/01/2025',
        piece_convention: 'convention_PRJ-2025-0028.pdf',
      },
      {
        id: 'd-005',
        code: 'PRJ-2025-0025',
        titre: 'Cybercafé & Secrétariat',
        promoteur: 'Touré Awa',
        montant: 4_500_000,
        approbation: 'APPROUVE',
        montant_credit: 4_200_000,
        taux_interet: 8,
        duree_pret: 36,
        duree_remboursement: 36,
        date_ouverture_compte: '19/01/2025',
        piece_convention: 'convention_PRJ-2025-0025.pdf',
      },
    ],
  },
  {
    id: 'lot-003',
    reference: 'LOT-2024-AGR-1285',
    partenaire: 'BNI — Banque Nationale d\'Investissement',
    dispositif: 'AGR Classique',
    date_transmission: '05/12/2024',
    courrier_reference: 'DPF/SDRF/2024/015',
    taux_couverture: 100,
    duree_differe: 3,
    duree_remboursement: 24,
    reference_convention: 'CONV-BNI-2024-015',
    statut: 'RETOURNE',
    dossiers: [
      {
        id: 'd-006',
        code: 'PRJ-2024-1285',
        titre: 'Boucherie Halal',
        promoteur: 'Diarrassouba Issa',
        montant: 3_000_000,
        approbation: 'APPROUVE',
        montant_credit: 3_000_000,
        taux_interet: 8,
        duree_pret: 24,
        duree_remboursement: 24,
        date_ouverture_compte: '12/12/2024',
        piece_convention: 'convention_PRJ-2024-1285.pdf',
      },
      {
        id: 'd-007',
        code: 'PRJ-2024-1279',
        titre: 'Fabrication de savon',
        promoteur: 'Aka Affoué',
        montant: 1_100_000,
        approbation: 'APPROUVE',
        montant_credit: 1_100_000,
        taux_interet: 8,
        duree_pret: 24,
        duree_remboursement: 24,
        date_ouverture_compte: '13/12/2024',
        piece_convention: 'convention_PRJ-2024-1279.pdf',
      },
    ],
  },
]

// ---------- Dossiers approuvés (vue consolidée) ---------------------------

export const MOCK_DOSSIERS_APPROUVES: MockDossier[] = MOCK_LOTS.flatMap((l) =>
  l.dossiers.filter((d) => d.approbation === 'APPROUVE'),
)

// ---------- Dossiers rejetés (vue consolidée) ----------------------------

export const MOCK_DOSSIERS_REJETES: MockDossier[] = MOCK_LOTS.flatMap((l) =>
  l.dossiers.filter((d) => d.approbation === 'REJETE'),
)

// ---------- Plans de décaissement ----------------------------------------

export const MOCK_PLANS: MockPlan[] = [
  {
    id: 'plan-001',
    projet_id: 'd-001',
    projet_titre: 'Ferme Avicole Moderne',
    promoteur: 'Kouamé Yao Brice',
    agence: 'Abidjan Sud',
    statut: 'TRANSMIS_PF',
    voie: 'AGENCE',
    valide_benef: true,
    montant_credit: 1_500_000,
    cree: '22/01/2025',
    note: 'Plan validé par le chef d\'agence. Transmis au partenaire pour autorisation.',
    lignes: [
      {
        id: 'lg-001-1',
        num: 1,
        libelle: 'Achat de poussins et aliments (1ère tranche)',
        montant: 600_000,
        statut: 'EXECUTE',
        date_prevue: '25/01/2025',
        date_autorisation: '24/01/2025',
        justif_autorisation: 'BORautorisation_001.pdf',
        date_execution: '26/01/2025',
        justif_execution: 'BORexec_001.pdf',
        ordre: 'Fournisseur Agro-Plus',
      },
      {
        id: 'lg-001-2',
        num: 2,
        libelle: 'Construction du poulailler',
        montant: 600_000,
        statut: 'AUTORISE',
        date_prevue: '01/02/2025',
        date_autorisation: '31/01/2025',
        justif_autorisation: 'BORautorisation_002.pdf',
        ordre: 'SARL BTP Constructions',
      },
      {
        id: 'lg-001-3',
        num: 3,
        libelle: 'Équipements et matériel divers',
        montant: 300_000,
        statut: 'PREVU',
        date_prevue: '15/02/2025',
        ordre: 'SARL Équipements+',
      },
    ],
  },
  {
    id: 'plan-002',
    projet_id: 'd-004',
    projet_titre: 'Atelier de Menuiserie',
    promoteur: 'Ouattara Seydou',
    agence: 'San-Pedro',
    statut: 'EN_VALIDATION',
    voie: 'AGENCE',
    valide_benef: false,
    montant_credit: 1_200_000,
    cree: '20/01/2025',
    lignes: [
      {
        id: 'lg-002-1',
        num: 1,
        libelle: 'Achat de machines (scie circulaire, raboteuse)',
        montant: 800_000,
        statut: 'PREVU',
        date_prevue: '25/01/2025',
        ordre: 'Équipements Menuis CI',
      },
      {
        id: 'lg-002-2',
        num: 2,
        libelle: 'Matières premières (bois, quincaillerie)',
        montant: 400_000,
        statut: 'PREVU',
        date_prevue: '10/02/2025',
        ordre: 'SARL Bois & Cie',
      },
    ],
  },
  {
    id: 'plan-003',
    projet_id: 'd-005',
    projet_titre: 'Cybercafé & Secrétariat',
    promoteur: 'Touré Awa',
    agence: 'Yamoussoukro',
    statut: 'BROUILLON',
    voie: 'AGENCE',
    valide_benef: false,
    montant_credit: 4_200_000,
    cree: '21/01/2025',
    lignes: [
      {
        id: 'lg-003-1',
        num: 1,
        libelle: 'Achat de 10 ordinateurs',
        montant: 2_500_000,
        statut: 'PREVU',
        date_prevue: '28/01/2025',
        ordre: 'Informatique Plus CI',
      },
      {
        id: 'lg-003-2',
        num: 2,
        libelle: 'Mobilier et climatiseurs',
        montant: 1_200_000,
        statut: 'PREVU',
        date_prevue: '10/02/2025',
      },
      {
        id: 'lg-003-3',
        num: 3,
        libelle: 'Connexion internet et divers',
        montant: 500_000,
        statut: 'PREVU',
        date_prevue: '15/02/2025',
      },
    ],
  },
]

// ---------- Décaissements exécutés ---------------------------------------

export const MOCK_DECAISSEMENTS = [
  {
    id: 'dc-001',
    plan_id: 'plan-001',
    code: 'PRJ-2025-0041',
    titre: 'Ferme Avicole Moderne',
    promoteur: 'Kouamé Yao Brice',
    agence: 'Abidjan Sud',
    num: 1,
    libelle: 'Achat de poussins et aliments (1ère tranche)',
    montant: 600_000,
    date: '26/01/2025',
    reference: 'VIR-48291',
    statut: 'EXECUTE' as const,
  },
]

// ---------- Remboursements -----------------------------------------------

export const MOCK_REMBOURSEMENTS: MockRemboursement[] = [
  {
    id: 'remb-001',
    projet_id: 'd-006',
    code: 'PRJ-2024-1285',
    titre: 'Boucherie Halal',
    promoteur: 'Diarrassouba Issa',
    agence: 'Divo',
    partenaire: 'BNI',
    montant_credit: 3_000_000,
    montant_rembourse: 1_800_000,
    montant_du: 3_000_000,
    date_debut: '15/02/2025',
    date_fin: '15/01/2027',
    nb_echeances: 24,
    nb_impayes: 0,
    jours_retard: 0,
    statut: 'A_JOUR',
  },
  {
    id: 'remb-002',
    projet_id: 'd-007',
    code: 'PRJ-2024-1279',
    titre: 'Fabrication de savon',
    promoteur: 'Aka Affoué',
    agence: 'Abengourou',
    partenaire: 'BNI',
    montant_credit: 1_100_000,
    montant_rembourse: 250_000,
    montant_du: 1_100_000,
    date_debut: '15/02/2025',
    date_fin: '15/01/2027',
    nb_echeances: 24,
    nb_impayes: 2,
    jours_retard: 45,
    statut: 'IMPAYE',
  },
  {
    id: 'remb-003',
    projet_id: 'd-001',
    code: 'PRJ-2025-0041',
    titre: 'Ferme Avicole Moderne',
    promoteur: 'Kouamé Yao Brice',
    agence: 'Abidjan Sud',
    partenaire: 'SIB',
    montant_credit: 1_500_000,
    montant_rembourse: 0,
    montant_du: 1_500_000,
    date_debut: '26/04/2025',
    date_fin: '26/03/2027',
    nb_echeances: 24,
    nb_impayes: 4,
    jours_retard: 98,
    statut: 'CONTENTIEUX',
  },
]

// ---------- Garanties appelées -------------------------------------------

export const MOCK_GARANTIES: MockGarantie[] = [
  {
    id: 'gar-001',
    code: 'PRJ-2025-0041',
    titre: 'Ferme Avicole Moderne',
    promoteur: 'Kouamé Yao Brice',
    partenaire: 'SIB',
    montant_appele: 1_500_000,
    date_rappel: '15/07/2025',
    motif: 'Plus de 3 échéances impayées — dossier transmis à l\'avocat de l\'AEJ',
  },
]

// ---------- KPIs de synthèse ---------------------------------------------

export const MOCK_FINANCEMENT_STATS = {
  total_dossiers: 7,
  approuves: 5,
  rejetes: 1,
  en_attente: 1,
  montant_total_finance: 11_000_000,
  montant_total_decaisse: 600_000,
  montant_total_rembourse: 2_050_000,
  taux_remboursement: 36,
  lots_en_cours: 2,
  plans_en_validation: 1,
  lignes_a_executer: 1,
  impayes: 2,
}
