import type { MICRO_PROJET_T, PROMOTEUR_T } from '@/types/promoteurs.types'
import type { PERSONNEL_T } from '@/types/personnels.types'
import type { REF_ITEM_T } from '@/types/referentials.types'
import type { TYPE_EMPLOI_T, TYPE_ENTREPRISE_T } from '@/types'

/**
 * SUIVI & EXPLOITATION — types calqués sur les réponses LIVE de l'API
 * (relevées le 30/08/2026 sur https://apis.aej-ci.net/public/api).
 *
 * ── Pourquoi « rapport de visite » (maquette) = `/exploitations` (API) ──
 * La maquette appelle « Rapports de visite » la ressource `suivis`. Côté API,
 * la table qui porte RÉELLEMENT le contenu d'une visite terrain (état
 * d'installation, état de l'activité, coordonnées GPS, difficultés,
 * recommandations, observations, photos) s'appelle `/exploitations`. C'est
 * donc elle que ce module consomme.
 *
 * ── Pourquoi `/suivis` n'est PAS utilisée ──
 * `GET /suivis` est VIDE en base et ne porte que des libellés de rattachement :
 * aucune des colonnes du rapport de visite de la maquette n'y existe. S'en
 * servir reviendrait à afficher un écran qui ne peut rien afficher. Arbitrage
 * tranché en faveur de l'API : la ressource retenue est `/exploitations`.
 *
 * ── Pourquoi « En difficulté » n'existe pas ici ──
 * La maquette propose 4 états d'activité (Bonne marche, En exploitation,
 * En difficulté, Sinistrée). L'ENUM de l'API n'en accepte que TROIS
 * (EN_BONNE_MARCHE, EN_EXPLOITATION, SINISTRE) — vérifié en live : POST avec
 * `etat_activite: "EN_DIFFICULTE"` répond « The selected etat activite is
 * invalid. ». Une valeur que l'API refuse n'est jamais proposée à
 * l'utilisateur : « En difficulté » ne figure ni dans le type, ni dans le
 * select, ni dans la table de badges.
 */

/* ------------------------------------------------------------------ *
 * ENUMs — valeurs vérifiées en live (POST /exploitations)             *
 * ------------------------------------------------------------------ */

/** État d'installation du micro-projet. */
export type ETAT_INSTALLATION_T = 'ACHEVE' | 'EN_COURS' | 'NON_ENTAME'

/** État de l'activité. TROIS valeurs — pas quatre (cf. en-tête du fichier). */
export type ETAT_ACTIVITE_T = 'EN_BONNE_MARCHE' | 'EN_EXPLOITATION' | 'SINISTRE'

/**
 * « Réalisation à vide » : champ propre à l'API, ABSENT de la maquette.
 * Structurant (l'API le stocke sur chaque rapport) donc exposé au formulaire,
 * avec un libellé français cohérent avec le vocabulaire de la maquette.
 */
export type REALISATION_VIDE_T = 'OUI' | 'NON'

/* ------------------------------------------------------------------ *
 * Relations embarquées — formes RÉELLEMENT reçues                     *
 * ------------------------------------------------------------------ */

/**
 * Agent auteur du rapport, tel qu'embarqué par `GET /exploitations`.
 *
 * ⚠️ Ce n'est PAS un `PERSONNEL_T` complet : l'API ne renvoie ici que les
 * colonnes de la table `personnels`, sans les relations (`role`, `fonction`,
 * `agence`, `organisme`) ni les `permissions` que `PERSONNEL_T` déclare
 * requises. On décrit donc la forme réelle par un `Pick`, pour qu'aucun écran
 * ne croie pouvoir lire `agent.role`.
 */
export type AGENT_SUIVI_T = Pick<
  PERSONNEL_T,
  | 'id'
  | 'nom'
  | 'prenom'
  | 'email'
  | 'telephone'
  | 'adresse'
  | 'organisme_id'
  | 'agence_regionale_id'
  | 'role_id'
  | 'fonction_id'
  | 'is_active'
  | 'mot_de_passe_change'
  | 'created_at'
  | 'updated_at'
>

/**
 * Promoteur embarqué par `GET /embauches`.
 *
 * ⚠️ Même remarque que pour l'agent : les relations eager-loadées par
 * `GET /promoteurs` (`sexe`, `agence_regionale`, `secteur_activite`…) ne sont
 * PAS présentes ici. On les retire du type plutôt que de laisser croire
 * qu'elles sont disponibles.
 */
export type PROMOTEUR_EMBAUCHE_T = Omit<
  PROMOTEUR_T,
  | 'sexe'
  | 'agence_regionale'
  | 'secteur_activite'
  | 'sous_secteur_activite'
  | 'niveau_etude'
  | 'type_piece_identite'
  | 'pays_nationalite'
  | 'situation_matrimoniale'
  | 'type_situation_handicap'
  | 'lieu_habitation'
  | 'personnel'
>

/* ------------------------------------------------------------------ *
 * Ressources                                                          *
 * ------------------------------------------------------------------ */

/**
 * Photo de visite — `GET /visite-photos`, et relation `visite_photos` d'une
 * exploitation.
 *
 * La maquette prévoyait un champ TEXTE « Pièces jointes (rapport, photos…) ».
 * L'API n'a pas de champ texte : elle a une RELATION vers cette table. Le
 * champ texte de la maquette n'est donc pas reproduit ; la grille affiche le
 * NOMBRE de photos liées.
 */
export interface VISITE_PHOTO_T {
  id: number
  exploitation_id: number
  photo_url: string
  description: string | null
  prise_le: string | null
  prise_par_id: number | null
  /** Embarquée par `GET /visite-photos` (sans ses propres relations). */
  exploitation?: EXPLOITATION_T | null
  prise_par?: AGENT_SUIVI_T | null
}

/**
 * Rapport de visite terrain — `GET /exploitations`.
 *
 * ⚠️ Cette ressource ne renvoie PAS de `updated_at` (contrairement à la
 * quasi-totalité des autres) : le champ est absent du type, pas optionnel,
 * pour qu'aucune colonne « Modifié le » ne soit imaginée.
 */
export interface EXPLOITATION_T {
  id: number
  micro_projet_id: number
  etat_installation: ETAT_INSTALLATION_T
  etat_activite: ETAT_ACTIVITE_T
  realisation_vide: REALISATION_VIDE_T
  nbre_visites: number
  /**
   * PÉRIODE de visite. La maquette n'avait qu'une « Date de visite » unique ;
   * l'API porte un début ET une fin (plus `nbre_visites`). Arbitrage en faveur
   * de l'API : deux champs de saisie, une colonne « Période de visite ».
   * Format reçu : ISO 8601 (« 2025-02-01T00:00:00.000000Z »).
   */
  date_debut_visite: string | null
  date_fin_visite: string | null
  /**
   * La maquette n'avait qu'un textarea « Observations & recommandations » ;
   * l'API a TROIS colonnes distinctes. On expose les trois.
   */
  difficultes: string | null
  recommandations: string | null
  observations: string | null
  /**
   * ⚠️ `string | null` et non `number | null` : Laravel sérialise les colonnes
   * DECIMAL en CHAÎNE dans le JSON (« 5.34500000 »). La maquette n'avait qu'un
   * champ `gps` « lat, lng » ; l'API a deux décimaux → deux champs de saisie,
   * affichage concaténé dans la grille.
   */
  latitude: string | null
  longitude: string | null
  agent_id: number | null
  created_at: string
  /** Relations eager-loadées : aucun fetch supplémentaire nécessaire. */
  micro_projet?: MICRO_PROJET_T | null
  agent?: AGENT_SUIVI_T | null
  visite_photos?: VISITE_PHOTO_T[]
}

/**
 * Entreprise — `GET /entreprises` (petit référentiel : 2 lignes en base,
 * chargement complet acceptable).
 */
export interface ENTREPRISE_T {
  id: number
  numero: string
  raison_sociale: string
  sigle: string | null
  rccm: string | null
  ninea: string | null
  type_entreprise_id: number | null
  adresse: string | null
  contact: string | null
  email: string | null
  region_id: number | null
  commune_id: number | null
  created_at: string
  updated_at: string
  type_entreprise?: TYPE_ENTREPRISE_T | null
  /**
   * Référentiels géographiques : la clé porteuse du libellé varie (`nom` ici),
   * d'où le passage par `REF_ITEM_T` + `refLabel`, comme ailleurs dans le dépôt.
   */
  region?: REF_ITEM_T | null
  commune?: REF_ITEM_T | null
  embauches?: EMBAUCHE_T[]
}

/**
 * Emploi créé — `GET /embauches`.
 *
 * ⚠️ Côté écriture, l'API exige `promoteur_id` ET `poste` (vérifié en live :
 * un POST vide répond « The promoteur id field is required. » /
 * « The poste field is required. ») ; les autres clés étrangères sont
 * facultatives. D'où les `| null` sur `entreprise_id`, `micro_projet_id` et
 * `type_emploi_id`, qui peuvent revenir vides d'anciennes saisies.
 */
export interface EMBAUCHE_T {
  id: number
  promoteur_id: number
  entreprise_id: number | null
  micro_projet_id: number | null
  type_emploi_id: number | null
  poste: string
  created_at: string
  updated_at: string
  promoteur?: PROMOTEUR_EMBAUCHE_T | null
  entreprise?: ENTREPRISE_T | null
  micro_projet?: MICRO_PROJET_T | null
  type_emploi?: TYPE_EMPLOI_T | null
}

/* ------------------------------------------------------------------ *
 * Libellés, options de <Select> et styles de badge                    *
 * ------------------------------------------------------------------ *
 * Les libellés sont ceux de la maquette, MOT POUR MOT : la maquette fait
 * autorité sur la forme, l'API sur le fond.                            */

/** Option de select, forme attendue par les `<Select>` du dépôt. */
export interface SELECT_OPTION_T<V extends string> {
  value: V
  label: string
}

export const ETAT_INSTALLATION_LABELS: Record<ETAT_INSTALLATION_T, string> = {
  ACHEVE: 'Installé',
  EN_COURS: 'En cours',
  NON_ENTAME: 'Non installé',
}

/**
 * Ordre du formulaire de la ressource `suivis` dans la maquette (l.6464) :
 * Non installé → En cours → Installé, soit une PROGRESSION du chantier.
 *
 * ⚠️ La modale terrain `openVisiteSuivi` (l.9711) propose l'ordre INVERSE
 * (Installé en tête, pour la saisie rapide du cas courant). L'écran reproduit
 * ici étant le formulaire de ressource, c'est son ordre qui fait foi.
 */
export const ETAT_INSTALLATION_OPTIONS: SELECT_OPTION_T<ETAT_INSTALLATION_T>[] = [
  { value: 'NON_ENTAME', label: ETAT_INSTALLATION_LABELS.NON_ENTAME },
  { value: 'EN_COURS', label: ETAT_INSTALLATION_LABELS.EN_COURS },
  { value: 'ACHEVE', label: ETAT_INSTALLATION_LABELS.ACHEVE },
]

/**
 * Installation : badge GRIS quel que soit l'état — c'est le choix de la
 * maquette (`badge(r.installation || '—', 'gy')`, l.6472), la couleur ne porte
 * l'information que pour l'état d'activité.
 *
 * Table CONSOMMÉE par `EtatInstallationCellRenderer`. Les trois entrées sont
 * volontairement identiques : elles ne sont pas redondantes, elles constituent
 * le point unique où faire diverger les teintes si le produit décidait un jour
 * de colorer aussi cet état.
 */
export const ETAT_INSTALLATION_BADGE_STYLES: Record<ETAT_INSTALLATION_T, string> = {
  ACHEVE: 'bg-slate-100 text-slate-600 hover:bg-slate-100 border-0',
  EN_COURS: 'bg-slate-100 text-slate-600 hover:bg-slate-100 border-0',
  NON_ENTAME: 'bg-slate-100 text-slate-600 hover:bg-slate-100 border-0',
}

export const ETAT_ACTIVITE_LABELS: Record<ETAT_ACTIVITE_T, string> = {
  EN_BONNE_MARCHE: 'Bonne marche',
  EN_EXPLOITATION: 'En exploitation',
  SINISTRE: 'Sinistrée',
}

/**
 * Ordre de la maquette, AMPUTÉ de « En difficulté » que l'ENUM de l'API
 * refuse. Trois options, pas quatre.
 */
export const ETAT_ACTIVITE_OPTIONS: SELECT_OPTION_T<ETAT_ACTIVITE_T>[] = [
  { value: 'EN_BONNE_MARCHE', label: ETAT_ACTIVITE_LABELS.EN_BONNE_MARCHE },
  { value: 'EN_EXPLOITATION', label: ETAT_ACTIVITE_LABELS.EN_EXPLOITATION },
  { value: 'SINISTRE', label: ETAT_ACTIVITE_LABELS.SINISTRE },
]

/**
 * Couleurs de la maquette : vert (gr), bleu (bl), rouge (rd) — exprimées dans
 * la palette PRODUIT de `src/constants/colors.ts`, et non dans les nuances
 * Tailwind par défaut.
 *
 * Pourquoi : `MicroProjetCellRenderer` et `TypeEmploiCellRenderer` peignent
 * déjà leurs badges avec cette palette (#FBEADE/#C85E18, #E5EDFB/#2D6BD4).
 * Les `blue-100`/`blue-700` de Tailwind faisaient cohabiter DEUX bleus
 * différents dans la même page. Codes en dur plutôt que `COLORS.*` : Tailwind
 * ne peut composer ses classes qu'à partir de littéraux présents dans le
 * source (green.soft/deep, blue.soft/DEFAULT, red.soft/DEFAULT).
 */
export const ETAT_ACTIVITE_BADGE_STYLES: Record<ETAT_ACTIVITE_T, string> = {
  EN_BONNE_MARCHE: 'bg-[#E3F6E7] text-[#178A2E] hover:bg-[#E3F6E7] border-0',
  EN_EXPLOITATION: 'bg-[#E5EDFB] text-[#2D6BD4] hover:bg-[#E5EDFB] border-0',
  SINISTRE: 'bg-[#FBE7E5] text-[#D6453B] hover:bg-[#FBE7E5] border-0',
}

export const REALISATION_VIDE_LABELS: Record<REALISATION_VIDE_T, string> = {
  OUI: 'Oui',
  NON: 'Non',
}

export const REALISATION_VIDE_OPTIONS: SELECT_OPTION_T<REALISATION_VIDE_T>[] = [
  { value: 'OUI', label: REALISATION_VIDE_LABELS.OUI },
  { value: 'NON', label: REALISATION_VIDE_LABELS.NON },
]
