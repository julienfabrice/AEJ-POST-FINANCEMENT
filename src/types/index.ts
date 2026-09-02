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
  workflow?: WORKFLOW_T | null
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
export type RECEPTION_ACTE_CREDIT_T = 'OUI' | 'NON' | 'PARTIEL'

export interface BUDGET_T {
  id: number
  micro_projet_id: number
  intitule: string
  /** Laravel sérialise les colonnes DECIMAL en string dans le JSON. */
  montant_accorde: number | string
  date_accord?: string | null
  source?: string | null
  statut: BUDGET_STATUT_T
  devise: string
  /** Confirmé côté API : booléen (`true`/`false`), pas une chaîne "OUI"/"NON". */
  deblocage: boolean
  date_deblocage?: string | null
  signature_convention: SIGNATURE_CONVENTION_T
  date_signature?: string | null
  reception_acte_credit: RECEPTION_ACTE_CREDIT_T
  date_reception?: string | null
  observations?: string | null
  valide_par?: number | null
  created_at?: string
  updated_at?: string
  /** Relation embarquée par GET /budgets — pas besoin d'un fetch séparé vers /projets. */
  micro_projet?: import('./promoteurs.types').MICRO_PROJET_T
}
// --- Lots de transmission (/lots-transmission) ---

export type LOT_TRANSMISSION_STATUT_T = 'BROUILLON' | 'TRANSMIS' | 'TRAITE' | 'REJETE'

export interface LOT_TRANSMISSION_T {
  id: number
  organisme_id: number
  guichet_id: number
  code: string
  titre: string
  fichier_repartition?: string | null
  fichier_courrier?: string | null
  reference_courrier?: string | null
  reference_convention?: string | null
  date_transmission?: string | null
  taux_recouvrement?: number | string | null
  duree_differee?: number | null
  duree_remboursement?: number | null
  statut: LOT_TRANSMISSION_STATUT_T
  created_at?: string
  updated_at?: string
  organisme?: ORGANISME_FINANCEMENT_T | null
  guichet?: GUICHET_T | null
  dossiers?: import('./promoteurs.types').MICRO_PROJET_T[]
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
  micro_projet_id?: number
  budget_id?: number | null
  code?: string | null
  intitule?: string | null
  compte_financement_id?: number | null
  montant_planifie: number
  date_prevue?: string | null
  justificatif_path?: string | null
  lignes?: LIGNE_DECAISSEMENT_T[]
  budget?: BUDGET_T | null
  micro_projet?: import('./promoteurs.types').MICRO_PROJET_T | null
  created_at?: string
  updated_at?: string
}

export type DECAISSEMENT_STATUT_T = 'EN_ATTENTE' | 'VALIDE' | 'NON_VALIDE'

export interface DECAISSEMENT_T {
  id: number
  plan_decaissement_id: number
  ligne_decaissement_id?: number | null
  numero_ligne?: number | null
  object_ligne?: string | null
  montant_ligne?: number | null
  mode_decaisse?: MODE_DECAISSE_T | null
  date_prevue?: string | null
  intitule_prestataire?: string | null
  numero_compte?: string | null
  contact?: string | null
  agence_id?: number | null
  agence?: AGENCE_REGIONALE_T | null
  montant_decaisse?: number
  date_decaissement?: string | null
  reference_banque?: string | null
  statut: DECAISSEMENT_STATUT_T
  observations?: string | null
  plan_decaissement?: PLAN_DECAISSEMENT_T | null
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
  /** Laravel sérialise les colonnes DECIMAL en string dans le JSON. */
  montant_echu: number | string
  montant_paye: number | string
  montant_impaye: number | string
  penalites: number | string
  date_paiement?: string | null
  observations?: string | null
  statut: REMBOURSEMENT_STATUT_T
  promoteur?: import('./promoteurs.types').PROMOTEUR_T | null
  budget?: BUDGET_T | null
  created_at?: string
  updated_at?: string
}

export * from './workflow.types'

/**
 * --- Suivi & exploitation (rapports de visite terrain + emplois créés) ---
 *
 * Ré-exporté comme `workflow.types` ci-dessus : les écrans importent depuis
 * `@/types` sans avoir à connaître le découpage des fichiers. Le détail des
 * arbitrages maquette/API est documenté dans `suivi.types.ts`.
 */
export * from './suivi.types'

/**
 * --- Agrégats de tableau de bord (`/dashboard/*`) ---
 *
 * Ré-exporté ici pour que les écrans importent depuis `@/types`. Ces endpoints
 * répondent `{ data }` SANS `message` : ils n'utilisent donc PAS
 * `API_RESPONSE_T` mais `DASHBOARD_RESPONSE_T`. Détail des relevés live et des
 * arbitrages (clés accentuées, montants en chaîne) dans `dashboard.types.ts`.
 */
export * from './dashboard.types'

/**
 * --- Cadre de résultat (module « Suivi & évaluation », API NON BRANCHÉE) ---
 *
 * Ré-exporté comme `suivi.types` et `dashboard.types` ci-dessus : les écrans,
 * services et schémas importent depuis `@/types` sans connaître le découpage
 * des fichiers.
 *
 * ⚠️ Ces types sont calqués sur un SCHÉMA SQL, pas sur une réponse d'API —
 * l'API n'existe pas encore. Coquilles du schéma reprises telles quelles
 * (`abgrege_cs`, `intutile_cs`, `valeur_cible_indcateur_istr`, `Date_suivi`),
 * incohérences signalées champ par champ : tout le détail est dans
 * `cadreResultat.types.ts`, à relire au moment du branchement.
 */
export * from './cadreResultat.types'

export interface DISPOSITIF_T {
  id: number
  code: string
  projet_id?: number | null
  guichet_id?: number | null
  workflow_version?: any | null // we can refine this later
  intitule: string
  budget_alloue: string | number
  montant_min: string | number
  montant_max: string | number
  taux: string | number
  duree: number
  nbre_emplois_prevu: number
  nbre_beneficiaire_prevu: number
  nbre_micro_projet_prevu: number
  created_at?: string
  updated_at?: string
  projet?: any | null
  guichet?: GUICHET_T | null
}
