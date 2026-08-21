

import type { PERSONNEL_T } from '@/types/personnels.types'
import type { REF_ITEM_T } from '@/types/referentials.types'

export interface MICRO_PROJET_T {
  id: number
  code: string
  intitule: string
  matricule: string
  description: string | null
  montant_total: string | null
  dispositif_id: number | null
  organisme_id: number | null
  guichet_id: number | null
  secteur_id: number | null
  commune_id: number | null
  agence_id: number | null
  promoteur_id: number

  stade_projet: string

  type_projet: string

  statut: string
  localisation: string | null
  geolocalisation: string | null
  date_certification: string | null
  date_transmission_partenaire: string | null
  created_at: string
  updated_at: string
}

export interface PROMOTEUR_T {
  id: number
  profile: string | null
  nom: string
  prenom: string
  email: string
  telephone: string | null

  tranche_age: string | null
  datenaissance: string | null
  lieunaissance: string | null
  matriculeaej: string
  numerocni: string | null
  numerocmu: string | null
  numerocnps: string | null
  raison_sociale: string | null
  /**
   * Précision LIBRE sur le handicap — `VARCHAR(100)` sans contrainte
   * (info/schema.v2.sql). À ne pas confondre avec `typesituationhandicap_id`,
   * qui référence la catégorie dans `types_situation_handicap`.
   */
  handicap: string | null
  nomdupere: string | null
  nomdelamere: string | null


  sexe_id: number | null
  personnel_id: number | null
  lieuhabitation_id: number | null
  agenceregionale_id: number | null
  secteuractivite_id: number | null
  soussecteuractivite_id: number | null
  situationmatrimoniale_id: number | null
  typesituationhandicap_id: number | null
  typepieceidentite_id: number | null
  niveauetude_id: number | null
  paysnationalite_id: number | null


  statut: boolean
  created_at: string
  updated_at: string

  /**
   * Relations EAGER-LOADED par `GET /promoteurs`.
   *
   * Le libellé est donc DÉJÀ sur la ligne : aucun référentiel à charger pour
   * afficher un promoteur. La clé porteuse du libellé varie d'une relation à
   * l'autre (`libelle` pour la plupart, `nom` pour l'agence et le pays) — d'où
   * le passage systématique par `refLabel`.
   */
  sexe: REF_ITEM_T | null
  agence_regionale: REF_ITEM_T | null
  secteur_activite: REF_ITEM_T | null
  sous_secteur_activite: REF_ITEM_T | null
  niveau_etude: REF_ITEM_T | null
  type_piece_identite: REF_ITEM_T | null
  pays_nationalite: REF_ITEM_T | null
  situation_matrimoniale: REF_ITEM_T | null
  type_situation_handicap: REF_ITEM_T | null
  lieu_habitation: REF_ITEM_T | null
  personnel: PERSONNEL_T | null

  /**
   * ⚠️ ABSENT de la réponse de `GET /promoteurs` — la relation n'était chargée
   * que par l'ancien `POST /filter-with-projects`. Optionnel tant que le
   * backend ne l'expose pas ici (cf. leftover #18).
   */
  micro_projets?: MICRO_PROJET_T[]
}

/**
 * Filtres + pagination de la liste:l'URL est l'unique source de vérité.
 */
export interface PROMOTEUR_SEARCH_T {
  page: number
  perPage: number

  search?: string

 
  tranche_age?: string
  

  statut?: string
  stade_projet?: string
  type_projet?: string
  sexe_id ? : string,

 
  soussecteuractivite_id? : string,
  typepieceidentite_id? : string,
  /** Filtre handicap : c'est bien la CLÉ ÉTRANGÈRE, pas le champ `handicap`. */
  typesituationhandicap_id? : string,
  paysnationalite_id?: string
  niveauetude_id?: string
  situationmatrimoniale_id?: string
  secteuractivite_id?: string
  agenceregionale_id?: string
}

export const PROMOTEUR_FK_PARAMS = [
  'sexe_id',
  'agenceregionale_id',
  'secteuractivite_id',
  'soussecteuractivite_id',
  'niveauetude_id',
  'situationmatrimoniale_id',
  'typepieceidentite_id',
  'paysnationalite_id',
  'typesituationhandicap_id',
] as const;

export type PromoteurFkParam = (typeof PROMOTEUR_FK_PARAMS)[number];


export const PROMOTEUR_PROJET_PARAMS = ['statut', 'stade_projet', 'type_projet'] as const;

export type PromoteurProjetParam = (typeof PROMOTEUR_PROJET_PARAMS)[number];
