export interface MockOpRemboursement {
  id: string
  projet_id: string
  projet_code: string
  projet_titre: string
  echeance: string
  date_debut: string
  date_fin: string
  du: number
  paye: number
  statut: 'PAYE' | 'PARTIEL' | 'IMPAYE'
  jours_retard: number
  justificatif?: string
  observation?: string
  agence?: string
}

export const MOCK_OP_REMBOURSEMENTS: MockOpRemboursement[] = [
  {
    id: 'rb1',
    projet_id: 'p6',
    projet_code: 'MP-2024-0010',
    projet_titre: 'Boutique de vêtements',
    agence: 'Agence d\'Abobo',
    echeance: '2024-11-30',
    date_debut: '2024-10-31',
    date_fin: '2026-09-30',
    du: 55000,
    paye: 55000,
    statut: 'PAYE',
    jours_retard: 0,
    justificatif: 'recu_nov2024.pdf'
  },
  {
    id: 'rb2',
    projet_id: 'p6',
    projet_code: 'MP-2024-0010',
    projet_titre: 'Boutique de vêtements',
    agence: 'Agence d\'Abobo',
    echeance: '2024-12-31',
    date_debut: '2024-10-31',
    date_fin: '2026-09-30',
    du: 55000,
    paye: 55000,
    statut: 'PAYE',
    jours_retard: 0,
    justificatif: 'recu_dec2024.pdf'
  },
  {
    id: 'rb3',
    projet_id: 'p6',
    projet_code: 'MP-2024-0010',
    projet_titre: 'Boutique de vêtements',
    agence: 'Agence d\'Abobo',
    echeance: '2025-01-31',
    date_debut: '2024-10-31',
    date_fin: '2026-09-30',
    du: 55000,
    paye: 0,
    statut: 'IMPAYE',
    jours_retard: 12,
  },
  {
    id: 'rb4',
    projet_id: 'p7',
    projet_code: 'MP-2024-0042',
    projet_titre: 'Lavage Auto Pro',
    agence: 'Agence de Yopougon',
    echeance: '2024-11-30',
    date_debut: '2024-07-15',
    date_fin: '2026-06-15',
    du: 42000,
    paye: 42000,
    statut: 'PAYE',
    jours_retard: 0,
    justificatif: 'pay_7.pdf'
  },
  {
    id: 'rb5',
    projet_id: 'p7',
    projet_code: 'MP-2024-0042',
    projet_titre: 'Lavage Auto Pro',
    agence: 'Agence de Yopougon',
    echeance: '2024-12-31',
    date_debut: '2024-07-15',
    date_fin: '2026-06-15',
    du: 42000,
    paye: 20000,
    statut: 'PARTIEL',
    jours_retard: 15,
    observation: 'Le reste sera payé la semaine pro.'
  },
  {
    id: 'rb6',
    projet_id: 'p8',
    projet_code: 'MP-2024-0105',
    projet_titre: 'Salon de coiffure',
    agence: 'Agence de Cocody',
    echeance: '2024-08-30',
    date_debut: '2024-05-15',
    date_fin: '2026-04-15',
    du: 30000,
    paye: 0,
    statut: 'IMPAYE',
    jours_retard: 165,
  },
  {
    id: 'rb7',
    projet_id: 'p8',
    projet_code: 'MP-2024-0105',
    projet_titre: 'Salon de coiffure',
    agence: 'Agence de Cocody',
    echeance: '2024-09-30',
    date_debut: '2024-05-15',
    date_fin: '2026-04-15',
    du: 30000,
    paye: 0,
    statut: 'IMPAYE',
    jours_retard: 135,
  },
  {
    id: 'rb8',
    projet_id: 'p8',
    projet_code: 'MP-2024-0105',
    projet_titre: 'Salon de coiffure',
    agence: 'Agence de Cocody',
    echeance: '2024-10-30',
    date_debut: '2024-05-15',
    date_fin: '2026-04-15',
    du: 30000,
    paye: 0,
    statut: 'IMPAYE',
    jours_retard: 104,
  },
  {
    id: 'rb9',
    projet_id: 'p8',
    projet_code: 'MP-2024-0105',
    projet_titre: 'Salon de coiffure',
    agence: 'Agence de Cocody',
    echeance: '2024-11-30',
    date_debut: '2024-05-15',
    date_fin: '2026-04-15',
    du: 30000,
    paye: 0,
    statut: 'IMPAYE',
    jours_retard: 74,
  },
]
