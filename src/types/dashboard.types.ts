// ─── Dashboard — Agences ──────────────────────────────────────────────────────

export interface DashboardAgencesKpis {
  nombre_agences: number
  nombre_projets: number
  nombre_promoteurs: number
  montant_financé: string
  montant_décaissé: number
  emplois_créés: number
}

export interface DashboardProjetStatut {
  statut: string
  count: number
}

export interface DashboardProjetAgence {
  agence: string
  count: number
  montant: string | number
}

export interface DashboardFinancementAgence {
  agence: string
  annee?: string | number
  region?: string
  montant: string | number
}

// ─── Dashboard — Commun ───────────────────────────────────────────────────────

export interface DashboardClassementItem {
  rang: number
  label: string
  value: number | string
}

export interface DashboardAlerte {
  id: string | number
  type: string
  message: string
  niveau?: string
  created_at?: string
}

// ─── Dashboard — Partenaires ──────────────────────────────────────────────────

export interface DashboardPartenairesKpis {
  nombre_partenaires: number
  projets_finances: number
  montant_accorde: string
  montant_decaisse: number
  encours: number
  taux_recouvrement: number
}

export interface DashboardPortefeuilleItem {
  partenaire?: string
  dispositif?: string
  statut?: string
  montant?: string | number
  count?: number
}

export interface DashboardEtatFinancement {
  statut: string
  count: number
  montant?: string | number
}

export interface DashboardEvolutionRemboursement {
  periode: string
  montant_du: number | string
  montant_paye: number | string
  taux?: number
}

// ─── Dashboard — Entreprises ──────────────────────────────────────────────────

export interface DashboardEntreprisesKpis {
  nombre_entreprises: number
  emplois_crees: number
  emplois_femmes?: number
  emplois_jeunes?: number
}

export interface DashboardEmploisSecteur {
  secteur: string | null
  nombre_emplois: number
}

export interface DashboardTypeEmploi {
  type_emploi: string | null
  nombre: number
}

export interface DashboardTopRecruteuse {
  id: number
  raison_sociale: string | null
  sigle: string | null
  nombre_emplois: number
}

export interface DashboardSecteur {
  secteur: string
  count: number
  montant?: string | number
}
