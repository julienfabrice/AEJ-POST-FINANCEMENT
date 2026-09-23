import {
  type FilterOption,
  PROJET_STADE_OPTIONS,
  PROJET_TYPE_OPTIONS,
} from './promoteurs.filters'

export type { FilterOption }

export interface BudgetFiltersState {
  search?: string
  statut?: string
  signature_convention?: string
  deblocage?: string
  reception_acte_credit?: string
  organisme_id?: string
  guichet_id?: string
  tranche_montant?: string
  stade_projet?: string
  type_projet?: string
  secteuractivite_id?: string
  agenceregionale_id?: string
}

export const BUDGET_FILTER_KEYS: (keyof Omit<BudgetFiltersState, 'search'>)[] = [
  'statut',
  'signature_convention',
  'deblocage',
  'reception_acte_credit',
  'organisme_id',
  'guichet_id',
  'tranche_montant',
  'stade_projet',
  'type_projet',
  'secteuractivite_id',
  'agenceregionale_id',
]

export const STATUT_APPROBATION_OPTIONS: FilterOption[] = [
  { value: 'APPROUVE', label: 'Approuvé' },
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'NON_APPROUVE', label: 'Non approuvé / Rejeté' },
]

export const CONVENTION_OPTIONS: FilterOption[] = [
  { value: 'SIGNEE', label: 'Signée' },
  { value: 'NON_SIGNEE', label: 'Non signée / En cours' },
]

export const DEBLOCAGE_OPTIONS: FilterOption[] = [
  { value: 'true', label: 'Débloqué' },
  { value: 'false', label: 'Non débloqué' },
]

export const ACTE_CREDIT_OPTIONS: FilterOption[] = [
  { value: 'OUI', label: 'Reçu' },
  { value: 'NON', label: 'Non reçu' },
  { value: 'PARTIEL', label: 'Partiel' },
]

export const TRANCHE_MONTANT_OPTIONS: FilterOption[] = [
  { value: 'less_1m', label: 'Moins de 1 000 000 FCFA' },
  { value: '1m_5m', label: '1 000 000 – 5 000 000 FCFA' },
  { value: '5m_10m', label: '5 000 000 – 10 000 000 FCFA' },
  { value: 'more_10m', label: 'Plus de 10 000 000 FCFA' },
]

/** Réutilisation directe des options communes de projet */
export const STADE_PROJET_OPTIONS: FilterOption[] = PROJET_STADE_OPTIONS
export const TYPE_PROJET_OPTIONS: FilterOption[] = PROJET_TYPE_OPTIONS
