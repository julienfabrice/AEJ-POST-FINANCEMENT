/**
 * AGRÉGATS DE TABLEAU DE BORD — `/dashboard/*`
 * ============================================
 * ⚠️ CE FICHIER PORTE DEUX JEUX DE TYPES, issus de la fusion de `amadou` dans
 * `younouss` (PR #37). Les deux ont été écrits en parallèle sur les mêmes
 * endpoints, avec des conventions de nommage différentes, et les deux sont
 * UTILISÉS — aucun n'est mort, aucun n'est redondant :
 *
 *  • `Dashboard*` (PascalCase) — consommés par les écrans de tableau de bord
 *    (`pages/Dashboard/{Admin,Agent,Partner}Dashboard/hooks/*`).
 *  • `*_T` (UPPER_SNAKE) — consommés par le moteur de rapports
 *    (`pages/Rapports/hooks/useRapportData.ts`).
 *
 * Aucune collision de noms entre les deux (vérifié à la fusion), d'où leur
 * coexistence sans arbitrage. Une unification ultérieure est possible mais
 * n'a pas été faite ici : elle toucherait les deux familles d'écrans à la
 * fois, ce qui n'a pas sa place dans une résolution de conflit.
 */

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

export interface DashboardEntrepriseRegion {
  region: string | null
  nombre_entreprises: number
}

export interface DashboardSecteur {
  secteur: string
  count: number
  montant?: string | number
}

/* ================================================================== *
 * Types du moteur de RAPPORTS (branche amadou)                       *
 * ================================================================== */

/**
 * TYPES DES ENDPOINTS D'AGRÉGATION `/dashboard/*`
 * ================================================
 * Calqués sur les réponses LIVE relevées le 30/08/2026 sur
 * https://apis.aej-ci.net/public/api — pas sur `info/schema.v2.sql` ni sur la
 * collection Postman, qui sont tous deux EN RETARD sur l'API.
 *
 * ── Pourquoi une enveloppe dédiée et non `API_RESPONSE_T` ──
 * Le reste de l'API répond `{ message, data }`. Les endpoints `/dashboard/*`
 * répondent `{ data }` TOUT COURT : aucune clé `message`. Réutiliser
 * `API_RESPONSE_T` mentirait sur la forme reçue (`message` serait déclaré
 * obligatoire alors qu'il est absent), d'où `DASHBOARD_RESPONSE_T` ci-dessous.
 *
 * ── Pourquoi les montants sont typés `string | number` ──
 * Laravel sérialise les colonnes DECIMAL en CHAÎNE. Relevé sur
 * `/dashboard/agences/kpis` : `"montant_financé": "2783414198498.94"` (chaîne)
 * mais `"montant_décaissé": 0` (nombre, parce que la valeur agrégée est nulle
 * et remonte en entier). Les deux formes coexistent donc RÉELLEMENT sur le même
 * objet : le type doit les accepter, et toute conversion doit passer par une
 * fonction défensive (`toNumber(x) ?? 0`, cf. `src/helpers/numbers.ts`).
 */

/**
 * Enveloppe des réponses `/dashboard/*` : `{ data }` sans `message`.
 * Vérifié sur les 20 endpoints d'agrégation relevés le 30/08/2026.
 */
export interface DASHBOARD_RESPONSE_T<T> {
  data: T
}

/* ------------------------------------------------------------------ *
 * /dashboard/agences/*                                                *
 * ------------------------------------------------------------------ */

/**
 * `GET /dashboard/agences/kpis`
 *
 * ⚠️ CLÉS ACCENTUÉES — ce n'est pas une coquille de notre part, c'est la forme
 * RÉELLE renvoyée par l'API :
 *   {"nombre_agences":33,"nombre_projets":110000,"nombre_promoteurs":109990,
 *    "montant_financé":"2783414198498.94","montant_décaissé":0,"emplois_créés":1}
 * On les déclare LITTÉRALEMENT (entre quotes) plutôt que de les « corriger » en
 * `montant_finance` : renommer côté type ferait échouer l'accès à l'exécution.
 * Conséquence pour les appelants : ces trois champs s'atteignent en notation
 * crochets — `kpis['montant_financé']` — parce que la notation pointée sur un
 * identifiant accentué est fragile selon les outillages.
 */
export interface DASHBOARD_AGENCES_KPIS_T {
  nombre_agences: number
  nombre_projets: number
  nombre_promoteurs: number
  /** Somme des financements engagés. Chaîne DECIMAL Laravel le plus souvent. */
  'montant_financé': string | number
  /** Somme des décaissements. Remonte en `0` (nombre) quand rien n'est décaissé. */
  'montant_décaissé': string | number
  'emplois_créés': number
}

/**
 * `GET /dashboard/agences/projets-statut`
 * Relevé : `[{"statut":"BROUILLON","count":11059}, … 14 entrées]`.
 * Les 14 valeurs de `statut` correspondent EXACTEMENT aux clés de
 * `src/constants/PROJECT_STATUSES.ts`. On garde néanmoins `string` : si le
 * backend ajoute un statut demain, le rapport doit l'afficher (libellé brut)
 * plutôt que de planter au typage.
 *
 * Filtres HONORÉS par cet endpoint (testés un par un) : `statut`, `agence_id`.
 * Filtres IGNORÉS : `dispositif_id`, `date_debut`, `date_fin` — ne jamais les
 * transmettre, cf. `dashboard.services.ts`.
 */
export interface PROJETS_PAR_STATUT_T {
  statut: string
  count: number | string
}

/**
 * `GET /dashboard/agences/projets-agence`
 *
 * ⚠️ FORME NON OBSERVABLE À CE JOUR : l'endpoint répond `{"data":[]}`, parce que
 * `agence_id` est NUL sur les 110 000 micro-projets du jeu actuel. Nous ne
 * pouvons donc pas relever ses clés en live, et nous refusons d'inventer un
 * contrat ferme sur une réponse jamais vue.
 *
 * Arbitrage : le type déclare, en OPTIONNEL, les noms de clés plausibles au vu
 * des conventions constatées sur les autres endpoints `/dashboard/*`
 * (`nombre_emplois`, `nombre_entreprises`, `count`…). La lecture réelle passe
 * par un normaliseur tolérant (cf. `useRapportData.ts`) qui prend la PREMIÈRE
 * clé présente. Le jour où la donnée sera saisie, l'écran s'allumera seul quelle
 * que soit la clé retenue par le backend, sans redéploiement de type.
 */
export interface PROJETS_PAR_AGENCE_T {
  agence_id?: number | string | null
  id?: number | string | null
  agence?: string | null
  nom?: string | null
  libelle?: string | null
  code?: string | null
  nombre_projets?: number | string | null
  nombre?: number | string | null
  count?: number | string | null
  total?: number | string | null
}

/**
 * `GET /dashboard/agences/financement-agence`
 *
 * ⚠️ Même situation que `PROJETS_PAR_AGENCE_T` : répond `{"data":[]}` aujourd'hui.
 * C'est la SEULE source susceptible de fournir un MONTANT par agence/région —
 * `/projets` ne sait sommer aucun montant par dimension. Tant qu'elle renvoie
 * une liste vide, la colonne « Montant engagé » ne s'affiche pas : elle n'est
 * ni estimée, ni extrapolée (cf. `aMontant` dans `useRapportData.ts`).
 */
export interface FINANCEMENT_AGENCE_T {
  agence_id?: number | string | null
  id?: number | string | null
  agence?: string | null
  nom?: string | null
  libelle?: string | null
  code?: string | null
  /** Le montant peut porter l'un de ces noms — clés accentuées incluses. */
  montant?: number | string | null
  montant_finance?: number | string | null
  'montant_financé'?: number | string | null
  montant_engage?: number | string | null
  'montant_engagé'?: number | string | null
  montant_total?: number | string | null
  nombre_projets?: number | string | null
  count?: number | string | null
}

/**
 * `GET /dashboard/agences/classement`
 * Répond `{"data":[]}` aujourd'hui (même cause : `agence_id` nul partout).
 * Type volontairement tolérant, pour la même raison que ci-dessus.
 */
export interface CLASSEMENT_AGENCE_T {
  id?: number | string | null
  agence?: string | null
  nom?: string | null
  nombre_projets?: number | string | null
  montant?: number | string | null
}

/**
 * `GET /dashboard/agences/alertes`
 * Relevé : `{"dossiers_en_attente":11059,"financements_non_decaisses":0,"projets_en_retard":0}`
 */
export interface DASHBOARD_AGENCES_ALERTES_T {
  dossiers_en_attente: number
  financements_non_decaisses: number
  projets_en_retard: number
}

/* ------------------------------------------------------------------ *
 * /dashboard/partenaires/*                                            *
 * ------------------------------------------------------------------ */

/**
 * `GET /dashboard/partenaires/kpis`
 * Relevé : `{"nombre_partenaires":2,"projets_finances":98941,
 *            "montant_accorde":"2783414198498.94","montant_decaisse":0,
 *            "encours":2783413198498.94,"taux_recouvrement":0}`
 * Noter l'incohérence de sérialisation ASSUMÉE par l'API : `montant_accorde`
 * est une chaîne, `encours` un nombre. D'où `string | number` partout.
 */
export interface DASHBOARD_PARTENAIRES_KPIS_T {
  nombre_partenaires: number
  projets_finances: number
  montant_accorde: string | number
  montant_decaisse: string | number
  encours: string | number
  /** Pourcentage (0–100) tel que renvoyé, sans re-calcul côté client. */
  taux_recouvrement: string | number
}

/**
 * `GET /dashboard/partenaires/evolution-remboursements`
 * Relevé : `[{"mois":"2025-01","montant_recupere":"1000000.00","nombre_operations":1}]`
 * `mois` est au format `AAAA-MM` (voir `moisLabel()` dans `Rapports/constants.ts`).
 * C'est la SEULE série mensuelle réellement agrégée par l'API.
 */
export interface EVOLUTION_REMBOURSEMENT_T {
  mois: string
  montant_recupere: string | number
  nombre_operations: number | string
}

/**
 * `GET /dashboard/partenaires/alertes`
 * Relevé : `{"financements_non_decaisses":…,"impayes":…,"remboursements_en_retard":…}`
 */
export interface DASHBOARD_PARTENAIRES_ALERTES_T {
  financements_non_decaisses: number
  impayes: number
  remboursements_en_retard: number
}

/* ------------------------------------------------------------------ *
 * /dashboard/entreprises/*                                            *
 * ------------------------------------------------------------------ */

/**
 * `GET /dashboard/entreprises/kpis`
 * Relevé : `{"nombre_entreprises":2,"entreprises_recruteuses":1,"emplois_crees":1,
 *            "projets_associes":2,"secteurs_representes":0,"regions_representees":0}`
 * Ici les clés sont SANS accent (`emplois_crees`), contrairement à
 * `/dashboard/agences/kpis` (`emplois_créés`). L'API est incohérente entre ses
 * deux familles de KPI ; on reproduit chaque forme telle qu'elle est reçue.
 */
export interface DASHBOARD_ENTREPRISES_KPIS_T {
  nombre_entreprises: number
  entreprises_recruteuses: number
  emplois_crees: number
  projets_associes: number
  secteurs_representes: number
  regions_representees: number
}

/**
 * `GET /dashboard/entreprises/emplois-secteur`
 * Relevé : `[{"secteur":null,"nombre_emplois":1}]`
 * `secteur` est NULLABLE et vaut `null` aujourd'hui (les entreprises n'ont pas
 * encore de secteur renseigné) : l'écran affiche alors « Secteur non renseigné »,
 * ce qui est la traduction honnête d'un `null`, pas une donnée inventée.
 */
export interface EMPLOIS_SECTEUR_T {
  secteur: string | null
  nombre_emplois: number | string
}

/**
 * `GET /dashboard/entreprises/types-emplois`
 * Relevé : `[{"type_emploi":"CDD","nombre":1}]`
 */
export interface TYPES_EMPLOIS_T {
  type_emploi: string | null
  nombre: number | string
}

/**
 * `GET /dashboard/entreprises/top-recruteuses`
 * Relevé : `[{"id":1,"raison_sociale":"Entreprise Agricole SA","sigle":"EASA","nombre_emplois":1},
 *            {"id":5,"raison_sociale":"AgriTech solutions","sigle":"AGRIT","nombre_emplois":0}]`
 */
export interface TOP_RECRUTEUSE_T {
  id: number
  raison_sociale: string
  sigle: string | null
  nombre_emplois: number | string
}

/**
 * `GET /dashboard/entreprises/region`
 * Relevé : `[{"region":null,"nombre_entreprises":2}]` — `region` nullable.
 */
export interface ENTREPRISES_REGION_T {
  region: string | null
  nombre_entreprises: number | string
}

/**
 * `GET /dashboard/entreprises/secteur`
 *
 * ⚠️ PIÈGE DE NOMMAGE : l'endpoint s'appelle « secteur » mais ventile en
 * réalité par TYPE JURIDIQUE d'entreprise — relevé :
 * `[{"type_entreprise":"SARL","nombre_entreprises":1},{"type_entreprise":"SA","nombre_entreprises":1}]`
 * Aucun secteur d'activité là-dedans. Le catalogue de rapports ne s'en sert donc
 * PAS pour « par secteur » ; il est exposé pour ce qu'il est réellement.
 */
export interface ENTREPRISES_TYPE_T {
  type_entreprise: string | null
  nombre_entreprises: number | string
}

/**
 * `GET /dashboard/entreprises/classement`
 * Relevé : `[{"id":1,"raison_sociale":"…","sigle":"…","region":null,
 *             "nombre_emplois":1,"nombre_projets_associes":1}]`
 */
export interface CLASSEMENT_ENTREPRISE_T {
  id: number
  raison_sociale: string
  sigle: string | null
  region: string | null
  nombre_emplois: number | string
  nombre_projets_associes: number | string
}

/**
 * `GET /dashboard/entreprises/alertes`
 * Relevé : `{"entreprises_sans_projets":…,"entreprises_inactives":…,"projets_sans_embauches":…}`
 */
export interface DASHBOARD_ENTREPRISES_ALERTES_T {
  entreprises_sans_projets: number
  entreprises_inactives: number
  projets_sans_embauches: number
}
