export type ZUSTAND_T<T> = {
  (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: false): void;
  (state: T | ((state: T) => T), replace: true): void;
}

/**
 * Enveloppe standard des réponses du backend AEJ : `{ message, data }`.
 * Les types de réponse par feature s'en dérivent (voir `auth.types.ts`).
 */
export interface API_RESPONSE_T<T> {
  message: string
  data: T
}

export interface JEUNE_T {
  id: string
  matricule: string
  prenom: string
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
}

/**
 * Paginateur Laravel, tel quel.
 *
 * ⚠️ Ici `data` porte les LIGNES — ce n'est pas l'enveloppe `{ message, data }`
 * ci-dessus. Les deux ne se combinent pas systématiquement selon les endpoints.
 */
export interface PAGINATED_T<T> {
  data: T[]
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number | null
  to: number | null
  next_page_url: string | null
  prev_page_url: string | null
  path: string
}

export interface SOUS_SECTEUR_T {
  id: number
  libelle: string
}

export interface PIECE_IDENTITE_T {
  id: number
  libelle: string
  description?: string | null
  actif?: boolean
}

export interface SITUATION_MATRIMONIALE_T {
  id: number
  libelle: string
}

export interface INDICATEUR_T {
  id: number
  nom: string
  description?: string | null
  type_valeur: string
  unite: string
  statut: boolean
  created_at?: string
  updated_at?: string
}

export interface TYPE_ENTREPRISE_T {
  id: number
  code: string
  libelle: string
  created_at?: string
  updated_at?: string
}

export interface TYPE_EMPLOI_T {
  id: number
  code: string
  libelle: string
  created_at?: string
  updated_at?: string
}

// --- Unités de gestion (schema.v2.sql) ---

export interface DIRECTION_T {
  id: number
  code: string
  nom: string
  description?: string | null
}

export interface SERVICE_ORG_T {
  id: number
  code: string
  nom: string
  description?: string | null
  direction_id: number
}

export interface FONCTION_T {
  id: number
  code: string
  nom: string
  description?: string | null
  service_id: number
}

export interface GUICHET_T {
  id: number
  workflow_code?: string | null
  code: string
  libelle: string
  description?: string | null
  couleur?: string | null
  montant_min: number
  montant_max: number
  is_active: boolean
  is_form_active: boolean
}

// Référentiel en LECTURE SEULE : synchronisé depuis le portail national
// agenceemploijeunes.ci (endpoint /list-agence-regionale). Pas de création
// possible depuis ce module.
export interface AGENCE_REGIONALE_T {
  id: number
  code: string
  nom: string
  latitude?: string | null
  longitude?: string | null
  contact?: string | null
  localisation?: string | null
  adresse?: string | null
  telephone?: string | null
  email?: string | null
  chef_agence_id?: number | null
}

// --- Partenaires financiers (schema.v2.sql) ---

export interface TYPE_ORGANISME_T {
  id: number
  code: string
  libelle: string
}

export interface ORGANISME_FINANCEMENT_T {
  id: number
  nom: string
  sigle: string
  type: number // FK -> TYPE_ORGANISME_T.id
  site_web?: string | null
  description?: string | null
  adresse?: string | null
  telephone?: string | null
  email?: string | null
  region_id?: number | null
}

// --- Localités (référentiels géographiques /aej/*, lecture seule) ---

export interface DIVISION_REGIONALE_T {
  id: number
  code: string | null
  nom: string
}

export interface VILLE_T {
  id: number
  nom: string
}

export interface COMMUNE_T {
  id: number
  code: string | null
  nom: string
  ville_id: number | null
  divisionregionaleaej_id: number | null
}

export interface LIEU_HABITATION_T {
  id: number
  nom: string
  ville_id: number | null
}

// --- Paramétrage des workflows (référentiels, schema.v2.sql) ---

export interface WORKFLOW_T {
  id: number
  code: string
  name: string
  description?: string | null
  is_active: boolean
}

export interface WORKFLOW_ROLE_T {
  id: number
  code: string
  name: string
  description?: string | null
  is_active: boolean
}

export interface WORKFLOW_DECISION_OUTCOME_T {
  id: number
  code: string
  label: string
}

export interface WORKFLOW_DELIVERABLE_T {
  id: number
  code: string
  name: string
  description?: string | null
  is_active: boolean
}

// --- Financement / Budgets (schema.v2.sql, section 15) ---

export type BUDGET_STATUT_T = 'EN_ATTENTE' | 'APPROUVE' | 'NON_APPROUVE'
export type SIGNATURE_CONVENTION_T = 'SIGNEE' | 'NON_SIGNEE'
export type DEBLOCAGE_T = 'OUI' | 'NON'
export type RECEPTION_ACTE_CREDIT_T = 'OUI' | 'NON' | 'PARTIEL'

export interface BUDGET_T {
  id: number
  micro_projet_id: number
  intitule: string
  montant_accorde: number
  date_accord?: string | null
  source?: string | null
  statut: BUDGET_STATUT_T
  devise: string
  deblocage: DEBLOCAGE_T
  date_deblocage?: string | null
  signature_convention: SIGNATURE_CONVENTION_T
  date_signature?: string | null
  reception_acte_credit: RECEPTION_ACTE_CREDIT_T
  date_reception?: string | null
  observations?: string | null
  valide_par?: number | null
  created_at?: string
  updated_at?: string
}
// --- Décaissements (schema.v2.sql, section 15) ---

export type MODE_DECAISSE_T = 'CHEQUE' | 'VIREMENT'
export type LIGNE_DECAISSEMENT_STATUT_T = 'VALIDE' | 'NON_VALIDE'

export interface LIGNE_DECAISSEMENT_T {
  id?: number
  plan_decaissement_id?: number
  numero_ligne: number
  object_ligne?: string | null
  montant_ligne: number
  mode_decaisse: MODE_DECAISSE_T
  date_prevue?: string | null
  intitule_prestataire: string
  numero_compte?: string | null
  contact?: string | null
  statut: LIGNE_DECAISSEMENT_STATUT_T
  observations?: string | null
}

export interface PLAN_DECAISSEMENT_T {
  id: number
  micro_projet_id: number
  budget_id?: number | null
  compte_financement_id?: number | null
  montant_planifie: number
  date_prevue?: string | null
  justificatif_path?: string | null
  lignes?: LIGNE_DECAISSEMENT_T[]
  created_at?: string
  updated_at?: string
}

export type DECAISSEMENT_STATUT_T = 'EN_ATTENTE' | 'VALIDE' | 'NON_VALIDE'

export interface DECAISSEMENT_T {
  id: number
  plan_decaissement_id: number
  ligne_decaissement_id?: number | null
  agence_id?: number | null
  montant_decaisse: number
  date_decaissement?: string | null
  reference_banque?: string | null
  statut: DECAISSEMENT_STATUT_T
  observations?: string | null
  created_at?: string
  updated_at?: string
}

// --- Remboursements (schema.v2.sql, section 15) ---

export interface PLAN_REMBOURSEMENT_T {
  id: number
  micro_projet_id: number
  budget_id?: number | null
  echeance_mensuelle?: string | null
  montant_echeance: number
  periode?: number | null
  capital_rembourse: number
  capital_restant: number
  interets: number
  amortissement_capital: number
  justificatif_path?: string | null
  created_at?: string
  updated_at?: string
}

export type REMBOURSEMENT_STATUT_T = 'EN_ATTENTE' | 'PAYE' | 'PARTIEL' | 'NON_PAYE'

export interface REMBOURSEMENT_T {
  id: number
  promoteur_id: number
  budget_id?: number | null
  montant_echu: number
  montant_paye: number
  montant_impaye: number
  penalites: number
  date_paiement?: string | null
  observations?: string | null
  statut: REMBOURSEMENT_STATUT_T
  created_at?: string
  updated_at?: string
}

export * from './workflow.types'