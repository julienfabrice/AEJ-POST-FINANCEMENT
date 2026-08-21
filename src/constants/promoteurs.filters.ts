import type { PROMOTEUR_SEARCH_T } from '@/types/promoteurs.types'

/**
 * Listes d'options et DÉFINITIONS des filtres promoteurs attendues pr le backend.
 */

export interface FilterOption {
  value: string
  label: string
}

/** Valeur par defaut :`<Select>` refuse une value vide. */
export const ALL_VALUE = '__all__'

/** `MICRO_PROJET_T.stade_projet` — jeu de valeurs complet. */
export const PROJET_STADE_OPTIONS: FilterOption[] = [
  { value: 'CREATION', label: 'Création' },
  { value: 'DEVELOPPEMENT', label: 'Développement' },
]

/** `MICRO_PROJET_T.type_projet` — jeu de valeurs complet. */
export const PROJET_TYPE_OPTIONS: FilterOption[] = [
  { value: 'INDIVIDUEL', label: 'Individuel' },
  { value: 'COLLECTIF', label: 'Collectif' },
]

/**
 * `MICRO_PROJET_T.statut` — les QUATORZE valeurs de l'ENUM
 * (info/schema.v2.sql), dans l'ordre du circuit.
 *
 * Quatre d'entre elles (`EN_ATTENTE`, `ANNULE`, `NON_APPROUVE`, `APPROUVE`)
 * ne figuraient pas dans la liste transmise initialement : sans elles, aucun
 * moyen de filtrer les dossiers approuvés ou annulés.
 */
export const PROJET_STATUT_OPTIONS: FilterOption[] = [
  { value: 'BROUILLON', label: 'Brouillon' },
  { value: 'EN_SOUMISSION', label: 'En soumission' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'EN_ANALYSE', label: 'En analyse' },
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'ANNULE', label: 'Annulé' },
  { value: 'NON_APPROUVE', label: 'Non approuvé' },
  { value: 'APPROUVE', label: 'Approuvé' },
  { value: 'EN_FORMATION', label: 'En formation' },
  { value: 'EN_FINANCEMENT', label: 'En financement' },
  { value: 'EN_DECAISSEMENT', label: 'En décaissement' },
  { value: 'EN_SUIVI', label: 'En suivi' },
  { value: 'EN_REMBOURSEMENT', label: 'En remboursement' },
  { value: 'TERMINE', label: 'Terminé' },
]

/**
 * `PROMOTEUR_T.tranche_age`.
 *
 * ⚠️ Valeurs alignées sur `ENUM ('18_40', 'PLUS_40')` (info/schema.v2.sql).
 * Il n'y a PAS de tranche « moins de 18 ans », et `PLUS_40` est en majuscules :
 * envoyer `plus_40` ne remonterait aucun résultat.
 */
export const TRANCHE_AGE_OPTIONS: FilterOption[] = [
  { value: '18_40', label: '18 – 40 ans' },
  { value: 'PLUS_40', label: 'Plus de 40 ans' },
]

/* --- Définitions des filtres --------------------------------------------- */

/** Clés de `PROMOTEUR_SEARCH_T` filtrables (hors pagination et recherche). */
export type FilterKey = Exclude<keyof PROMOTEUR_SEARCH_T, 'page' | 'perPage' | 'search'>

export type FilterGroup = 'Promoteur' | 'Projet'

interface BaseFilterDef {
  key: FilterKey
  label: string
  group: FilterGroup
  /** `combobox` pour les listes longues (recherche au clavier), `select` sinon. */
  control: 'select' | 'combobox'
}

/** Options figées dans le code (énumérations métier). */
interface StaticFilterDef extends BaseFilterDef {
  options: FilterOption[]
  ref?: never
}

/** Options chargées depuis un référentiel `/aej/*`. */
interface ReferentialFilterDef extends BaseFilterDef {
  ref: string
  options?: never
}

export type FilterDef = StaticFilterDef | ReferentialFilterDef

export const isReferentialFilter = (def: FilterDef): def is ReferentialFilterDef =>
  typeof def.ref === 'string'

/**
 * Source unique du panneau de filtres : ajouter un filtre = ajouter une entrée.
 */
export const PROMOTEUR_FILTERS: FilterDef[] = [
  // --- Promoteur : référentiels ---
  { key: 'sexe_id', label: 'Sexe', control: 'select', ref: '/aej/sexes', group: 'Promoteur' },
  {
    key: 'paysnationalite_id',
    label: 'Pays de nationalité',
    control: 'combobox',
    ref: '/aej/pays',
    group: 'Promoteur',
  },
  {
    key: 'niveauetude_id',
    label: "Niveau d'étude",
    control: 'select',
    ref: '/aej/niveaux-etudes',
    group: 'Promoteur',
  },
  {
    key: 'situationmatrimoniale_id',
    label: 'Situation matrimoniale',
    control: 'select',
    ref: '/aej/situations-matrimoniale',
    group: 'Promoteur',
  },
  {
    key: 'typepieceidentite_id',
    label: 'Type de pièce',
    control: 'select',
    ref: '/aej/types-pieces-identites',
    group: 'Promoteur',
  },
  {
    key: 'typesituationhandicap_id',
    label: 'Situation handicap',
    control: 'select',
    ref: '/aej/situations-handicaps',
    group: 'Promoteur',
  },
  {
    key: 'agenceregionale_id',
    label: 'Agence régionale',
    control: 'combobox',
    ref: '/aej/agences-regionales',
    group: 'Promoteur',
  },
  {
    key: 'secteuractivite_id',
    label: "Secteur d'activité",
    control: 'combobox',
    ref: '/aej/secteurs',
    group: 'Promoteur',
  },
  {
    key: 'soussecteuractivite_id',
    label: 'Sous-secteur',
    control: 'combobox',
    ref: '/aej/sous-secteurs',
    group: 'Promoteur',
  },

  // --- Promoteur : énumération ---
  {
    key: 'tranche_age',
    label: "Tranche d'âge",
    control: 'select',
    options: TRANCHE_AGE_OPTIONS,
    group: 'Promoteur',
  },

  // --- Projet : filtrent les promoteurs par leurs micro-projets ---
  {
    key: 'statut',
    label: 'Statut du projet',
    control: 'select',
    options: PROJET_STATUT_OPTIONS,
    group: 'Projet',
  },
  {
    key: 'stade_projet',
    label: 'Stade du projet',
    control: 'select',
    options: PROJET_STADE_OPTIONS,
    group: 'Projet',
  },
  {
    key: 'type_projet',
    label: 'Type de projet',
    control: 'select',
    options: PROJET_TYPE_OPTIONS,
    group: 'Projet',
  },
]

export const FILTER_GROUPS: FilterGroup[] = ['Promoteur', 'Projet']

/** Toutes les clés filtrables — sert au comptage et à la réinitialisation. */
export const FILTER_KEYS: FilterKey[] = PROMOTEUR_FILTERS.map((f) => f.key)

/** Tailles de page proposées par le pied de tableau. */
export const PER_PAGE_OPTIONS = [15, 25, 50, 100] as const

export const DEFAULT_PER_PAGE = 15


