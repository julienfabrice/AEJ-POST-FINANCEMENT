/**
 * CATALOGUE DES RAPPORTS — arbitrage maquette / API
 * =================================================
 * Règle du commanditaire : en cas d'écart entre la maquette et l'API, c'est
 * TOUJOURS l'API qui l'emporte. La maquette fait autorité sur la FORME
 * (disposition, libellés, couleurs, graphiques) ; l'API fait autorité sur le
 * FOND (ce qui est agrégeable, selon quelles dimensions, avec quelles mesures).
 *
 * Chaque entrée déclare donc explicitement SA SOURCE et SES MESURES. La colonne
 * « Montant engagé » de la maquette n'apparaît QUE là où l'API sait produire un
 * montant ; partout ailleurs le rapport s'exprime en nombre de dossiers et en
 * part (%). Aucune mesure n'est estimée, extrapolée ni mockée.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⛔ RETRAIT ASSUMÉ n°1 — « Bénéficiaires par sexe » de la maquette est SUPPRIMÉ
 * ══════════════════════════════════════════════════════════════════════════
 * La maquette propose un rapport `par_sexe`. Il est IMPOSSIBLE à produire :
 *   - `GET /projets?sexe_id=1&per_page=1` renvoie `pagination.total = 110 000`,
 *     c'est-à-dire la baseline complète : le paramètre est purement IGNORÉ par
 *     l'API (vérifié en live le 30/08/2026, contrairement à `statut`,
 *     `stade_projet` ou `type_projet` qui, eux, filtrent réellement) ;
 *   - aucun endpoint `/dashboard/*` n'agrège quoi que ce soit par sexe.
 * Le sexe existe bien sur le promoteur (`sexe_id`), mais l'obtenir imposerait de
 * charger les 110 000 micro-projets ET leurs promoteurs (~200 Mo) pour agréger
 * côté client. Exclu. Plutôt que d'afficher un rapport faux ou vide sans
 * explication, la ligne est retirée du catalogue et remplacée par deux
 * répartitions RÉELLEMENT filtrables : `par_stade` et `par_type`.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ✂️ RETRAIT ASSUMÉ n°2 — le mot « montants » disparaît du libellé « secteur »
 * ══════════════════════════════════════════════════════════════════════════
 * La maquette intitule un rapport « Projets & montants par secteur ». L'API ne
 * sait sommer AUCUN montant par dimension : `/projets` ne renvoie que des
 * lignes et un `pagination.total`, et il n'existe pas d'endpoint
 * `financement-secteur`. Promettre des « montants » dans un titre alors que la
 * colonne ne peut pas exister serait mentir à l'utilisateur : le libellé
 * devient « Micro-projets par secteur », et la mesure est le nombre de dossiers.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * 📅 ARBITRAGE n°3 — « Tendance des soumissions par mois »
 * ══════════════════════════════════════════════════════════════════════════
 * La maquette affiche une tendance mensuelle des soumissions de micro-projets.
 * Aucun endpoint ne regroupe les micro-projets par mois, et `/projets` ne
 * permet pas de filtrer par date (`date_debut`/`date_fin` sont ignorés). La
 * SEULE série mensuelle réellement agrégée par l'API est
 * `/dashboard/partenaires/evolution-remboursements`
 * (`[{ mois: "2025-01", montant_recupere, nombre_operations }]`). L'écran doit
 * donc afficher CETTE série, sous son vrai nom (« Évolution des remboursements
 * par mois »), ou afficher un état vide — jamais une tendance inventée.
 */

/* ------------------------------------------------------------------ *
 * Reprise à l'identique de la maquette (autorité sur la FORME)         *
 * ------------------------------------------------------------------ */

/**
 * Palette des graphiques — copiée telle quelle de `maquette/aej-demo.html`
 * (l. 8009). Les six premières teintes reprennent la charte AEJ de
 * `src/constants/colors.ts` (orange, vert, bleu, ambre…), les suivantes
 * complètent pour les dimensions à forte cardinalité (49 secteurs).
 * Indexation cyclique : `CHART_COLORS[i % CHART_COLORS.length]`.
 */
export const CHART_COLORS = [
  '#E7722B',
  '#20A83A',
  '#2D6BD4',
  '#E0A106',
  '#8E44AD',
  '#0E7490',
  '#D6453B',
  '#BE185D',
  '#0A9A54',
  '#6B7280',
] as const

/** Abréviations de mois — reprises à l'identique de la maquette (l. 8016). */
export const MONTHS = [
  'jan',
  'fév',
  'mar',
  'avr',
  'mai',
  'jun',
  'jui',
  'aoû',
  'sep',
  'oct',
  'nov',
  'déc',
] as const

/**
 * `"2025-01"` → `"jan 2025"`. Format renvoyé par
 * `/dashboard/partenaires/evolution-remboursements`. Retourne la chaîne brute
 * si le format n'est pas celui attendu : mieux vaut afficher la valeur reçue
 * qu'un mois faux.
 */
export function moisLabel(mois: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(mois ?? '')
  if (!m) return mois ?? ''
  const index = Number(m[2]) - 1
  const abrev = MONTHS[index]
  return abrev ? `${abrev} ${m[1]}` : mois
}

/**
 * `"2025-01"` → `"jan"`. Étiquette SOUS la barre de tendance, exactement comme
 * le `.blab` de la maquette (l. 8016) qui n'affiche que `MONTHS[mm-1]`.
 *
 * L'année n'y figure pas : la colonne fait 38 px de large et « jan 2025 » y
 * doublait la largeur de l'étiquette. L'année reste portée par l'infobulle de
 * la barre, construite avec `moisLabel` — l'information n'est donc pas perdue,
 * elle est juste sortie d'un emplacement qui ne peut pas la contenir.
 */
export function moisAbrege(mois: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(mois ?? '')
  if (!m) return mois ?? ''
  return MONTHS[Number(m[2]) - 1] ?? mois
}

/* ------------------------------------------------------------------ *
 * Vocabulaire du catalogue                                            *
 * ------------------------------------------------------------------ */

/** Clés des types de rapport réellement productibles. */
export type RAPPORT_CLE_T =
  | 'par_statut'
  | 'par_agence'
  | 'par_region'
  | 'par_dispositif'
  | 'par_secteur'
  | 'par_stade'
  | 'par_type'
  | 'emplois_secteur'
  | 'emplois_type'
  | 'top_recruteuses'

export type RAPPORT_GROUPE_T = 'MICRO_PROJETS' | 'EMPLOIS_ENTREPRISES'

/**
 * D'où vient la donnée :
 *  - `AGREGAT`  : un endpoint `/dashboard/*` agrège côté serveur (1 requête) ;
 *  - `COMPTAGE` : aucune agrégation serveur n'existe sur cette dimension, on
 *                 émet une requête `/projets?<filtre>&per_page=1` PAR VALEUR.
 */
export type RAPPORT_SOURCE_T = 'AGREGAT' | 'COMPTAGE'

/**
 * Mesures qu'un rapport peut porter.
 *  - `NB`      : un dénombrement exact (dossiers, emplois) — toujours présent ;
 *  - `MONTANT` : une somme d'argent — présente UNIQUEMENT si l'API la fournit.
 * `MONTANT` déclaré ici signifie « cette source PEUT en produire », pas
 * « il y en a aujourd'hui » : c'est `aMontant` (cf. `useRapportData`) qui,
 * à l'exécution, décide d'afficher ou non la colonne « Montant engagé ».
 */
export type RAPPORT_MESURE_T = 'NB' | 'MONTANT'

/** Les trois filtres de la barre de filtres de la maquette. */
export type RAPPORT_FILTRE_T = 'statut' | 'region' | 'dispositif'

/** Libellés des filtres — repris de la maquette (Guichet / Région / Statut). */
export const FILTRE_LABELS: Record<RAPPORT_FILTRE_T, string> = {
  dispositif: 'Guichet',
  region: 'Région',
  statut: 'Statut',
}

export interface RAPPORT_TYPE_T {
  cle: RAPPORT_CLE_T
  /** Libellé affiché dans le select « Type de rapport ». */
  label: string
  /**
   * Libellé de repli quand l'API n'a fourni AUCUN montant pour ce rapport
   * (`aMontant` faux). Il n'existe que pour les entrées dont le `label` promet
   * de l'argent : « Financement engagé par région » sur une carte qui n'affiche
   * que des nombres de dossiers serait un titre mensonger — exactement le
   * contresens déjà corrigé sur « Projets & montants par secteur ».
   *
   * Absent ⇒ le `label` vaut dans tous les cas. Cf. `libelleRapport`.
   */
  labelSansMontant?: string
  groupe: RAPPORT_GROUPE_T
  /** Intitulé du groupe, pour un `optgroup` dans le select. */
  groupeLabel: string
  /** Clé technique de la dimension ventilée. */
  dimension: string
  /** En-tête de la première colonne du détail chiffré (ex. « Étape »). */
  libelleDimension: string
  source: RAPPORT_SOURCE_T
  /** Provenance exacte, affichable sous le titre (traçabilité du chiffre). */
  sourceLabel: string
  mesures: RAPPORT_MESURE_T[]
  /** Nom de ce qui est dénombré : « dossiers », « emplois »… */
  uniteN: string
  /** Filtres que ce rapport applique RÉELLEMENT. Les autres sont désactivés. */
  filtresApplicables: RAPPORT_FILTRE_T[]
  /**
   * Pourquoi tel filtre est désactivé — texte d'infobulle. La consigne est
   * explicite : un filtre non applicable doit être VISIBLEMENT désactivé avec
   * une explication, jamais silencieusement ignoré.
   */
  raisonsFiltres: Partial<Record<RAPPORT_FILTRE_T, string>>
}

/* ------------------------------------------------------------------ *
 * Valeurs d'ENUM comptées via /projets (dimensions sans agrégat)       *
 * ------------------------------------------------------------------ */

/**
 * Stades de projet — valeurs de l'ENUM `stade_projet`, vérifiées en live :
 * CREATION → 54 911, DEVELOPPEMENT → 55 089, EXTENSION → 0.
 * EXTENSION est conservé dans la liste (le filtre est honoré, la valeur est
 * légitime) ; c'est le moteur qui écarte les lignes à zéro à l'affichage.
 */
export const STADES_PROJET = [
  { cle: 'CREATION', label: 'Création' },
  { cle: 'DEVELOPPEMENT', label: 'Développement' },
  { cle: 'EXTENSION', label: 'Extension' },
] as const

/**
 * Types de portage — valeurs de l'ENUM `type_projet`, vérifiées en live :
 * COLLECTIF → 54 918, INDIVIDUEL → 55 082.
 */
export const TYPES_PORTAGE = [
  { cle: 'INDIVIDUEL', label: 'Individuel' },
  { cle: 'COLLECTIF', label: 'Collectif' },
] as const

/* ------------------------------------------------------------------ *
 * LE CATALOGUE                                                        *
 * ------------------------------------------------------------------ */

const GROUPE_MICRO_PROJETS = 'Micro-projets'
const GROUPE_EMPLOIS = 'Emplois & entreprises'

/** Raison partagée : l'endpoint d'agrégation par agence n'accepte aucun filtre. */
const RAISON_AGREGAT_AGENCE_SANS_PARAM =
  "L'agrégat par agence ne renvoie aujourd'hui aucune ligne (agence_id est nul sur les 110 000 micro-projets) : aucun paramètre ne peut être vérifié en live, on n'en transmet donc aucun."

/**
 * ══════════════════════════════════════════════════════════════════════════
 * RÈGLE HOMOGÈNE — filtrer un rapport PAR SA PROPRE DIMENSION reste ACTIF
 * ══════════════════════════════════════════════════════════════════════════
 * Le catalogue se contredisait : `par_dispositif` désactivait le filtre
 * « Guichet » au motif que « le filtrer réduirait le rapport à une seule
 * ligne », alors que `par_statut` laissait « Statut » actif et que
 * `par_agence`/`par_region` laissaient « Région » active — trois cas
 * strictement identiques, deux décisions opposées.
 *
 * L'arbitrage retenu est le second, appliqué PARTOUT : filtrer par la dimension
 * analysée est une opération LÉGITIME — c'est ainsi qu'on isole une catégorie
 * pour la lire seule (« combien de dossiers sur le guichet X, et quelle part du
 * total ? »). Un rapport ramené à une seule ligne n'est pas un rapport cassé,
 * c'est une sélection ; l'utilisateur voit la valeur qu'il a choisie et peut la
 * retirer d'un clic. Désactiver le filtre, au contraire, lui interdirait un
 * usage normal sans qu'aucune limite technique ne l'impose.
 *
 * Conséquence côté moteur : sur un rapport de COMPTAGE, ce filtre ne peut PAS
 * voyager par `filtresTransverses` (les filtres du bucket l'emportent, cf.
 * `projetsServices.useCounts`) ; il est traduit en RESTRICTION de la liste des
 * buckets — cf. `useRapportData`. Le résultat est le même qu'un
 * `?dispositif_id=…` côté serveur : une seule ligne, non un filtre ignoré.
 */

/** Raison partagée : les agrégats « entreprises » ignorent les filtres projets. */
const RAISON_SOURCE_ENTREPRISES =
  "Ce rapport porte sur les entreprises et leurs embauches, pas sur les micro-projets : les filtres Statut, Région et Guichet du parcours de financement ne s'y appliquent pas."

export const RAPPORTS: RAPPORT_TYPE_T[] = [
  /* ---- Groupe « Micro-projets » ---------------------------------- */
  {
    cle: 'par_statut',
    label: 'Micro-projets par étape du parcours',
    groupe: 'MICRO_PROJETS',
    groupeLabel: GROUPE_MICRO_PROJETS,
    dimension: 'statut',
    libelleDimension: 'Étape',
    source: 'AGREGAT',
    sourceLabel: 'Agrégat serveur — /dashboard/agences/projets-statut',
    // Cet endpoint renvoie `{ statut, count }` : un dénombrement, jamais un montant.
    mesures: ['NB'],
    uniteN: 'dossiers',
    filtresApplicables: ['statut', 'region'],
    raisonsFiltres: {
      dispositif:
        "Le paramètre dispositif_id est IGNORÉ par /dashboard/agences/projets-statut (réponse identique avec et sans) : le transmettre laisserait croire à un filtrage inexistant.",
    },
  },
  {
    cle: 'par_agence',
    label: 'Activité par agence régionale',
    groupe: 'MICRO_PROJETS',
    groupeLabel: GROUPE_MICRO_PROJETS,
    dimension: 'agence',
    libelleDimension: 'Agence',
    source: 'AGREGAT',
    sourceLabel:
      'Agrégats serveur — /dashboard/agences/projets-agence (+ /financement-agence pour les montants)',
    // Deux agrégats fusionnés : le nombre vient de projets-agence, le montant de
    // financement-agence — SEULE source de montant par dimension de toute l'API.
    mesures: ['NB', 'MONTANT'],
    uniteN: 'dossiers',
    // Le filtre Région est appliqué CÔTÉ CLIENT sur les lignes renvoyées :
    // 33 lignes au maximum, coût nul, et aucun paramètre non vérifié n'est émis.
    filtresApplicables: ['region'],
    raisonsFiltres: {
      statut: RAISON_AGREGAT_AGENCE_SANS_PARAM,
      dispositif: RAISON_AGREGAT_AGENCE_SANS_PARAM,
    },
  },
  {
    cle: 'par_region',
    label: 'Financement engagé par région',
    /**
     * `/dashboard/agences/financement-agence` répond `{"data":[]}` (état du
     * 30/08/2026) : tant qu'aucun montant n'est réellement lu, ce rapport
     * n'affiche que des NOMBRES de dossiers. Le titre suit alors la mesure
     * effectivement présentée, comme le fait déjà le titre du donut.
     */
    labelSansMontant: 'Activité par région',
    groupe: 'MICRO_PROJETS',
    groupeLabel: GROUPE_MICRO_PROJETS,
    dimension: 'region',
    libelleDimension: 'Région',
    source: 'AGREGAT',
    sourceLabel:
      'Agrégats serveur — /dashboard/agences/financement-agence (+ /projets-agence pour le nombre)',
    /**
     * ── Pourquoi « région » et « agence » partagent la même source ──
     * Dans ce système, « région » ≡ « agence régionale » : `/aej/agences-regionales`
     * et `/aej/division-regionale` renvoient les MÊMES 33 entrées, avec les mêmes
     * codes et les mêmes noms (vérifié en live). Il n'existe donc pas de niveau
     * « région » distinct à agréger, et deux entrées de catalogue nourries par la
     * même source ne sont pas une redondance : elles répondent à deux lectures
     * métier différentes (activité d'une agence vs financement d'un territoire),
     * avec des mesures principales différentes — nombre ici, montant là.
     */
    mesures: ['NB', 'MONTANT'],
    uniteN: 'dossiers',
    filtresApplicables: ['region'],
    raisonsFiltres: {
      statut: RAISON_AGREGAT_AGENCE_SANS_PARAM,
      dispositif: RAISON_AGREGAT_AGENCE_SANS_PARAM,
    },
  },
  {
    cle: 'par_dispositif',
    label: 'Répartition par guichet',
    groupe: 'MICRO_PROJETS',
    groupeLabel: GROUPE_MICRO_PROJETS,
    dimension: 'dispositif_id',
    libelleDimension: 'Guichet',
    source: 'COMPTAGE',
    sourceLabel: 'Comptage exact — /projets?dispositif_id=…&per_page=1, un appel par guichet',
    // Aucun endpoint n'agrège par dispositif : la mesure ne peut être qu'un nombre.
    mesures: ['NB'],
    uniteN: 'dossiers',
    // « Guichet » est ici la dimension analysée, et il reste ACTIF : voir la
    // règle homogène en tête de section. Le moteur le traduit en restriction
    // des buckets, pas en paramètre transverse (qui serait écrasé).
    filtresApplicables: ['statut', 'region', 'dispositif'],
    raisonsFiltres: {},
  },
  {
    cle: 'par_secteur',
    // Libellé de la maquette : « Projets & montants par secteur ». Le mot
    // « montants » est RETIRÉ — voir le retrait assumé n°2 en tête de fichier.
    label: 'Micro-projets par secteur',
    groupe: 'MICRO_PROJETS',
    groupeLabel: GROUPE_MICRO_PROJETS,
    dimension: 'secteur_id',
    libelleDimension: 'Secteur',
    source: 'COMPTAGE',
    sourceLabel: 'Comptage exact — /projets?secteur_id=…&per_page=1, un appel par secteur (49)',
    mesures: ['NB'],
    uniteN: 'dossiers',
    filtresApplicables: ['statut', 'region', 'dispositif'],
    raisonsFiltres: {},
  },
  {
    cle: 'par_stade',
    // REMPLACE « Bénéficiaires par sexe » (retrait assumé n°1) : même intention
    // — comprendre la composition du portefeuille — mais sur une dimension que
    // l'API sait réellement filtrer.
    label: 'Micro-projets par stade',
    groupe: 'MICRO_PROJETS',
    groupeLabel: GROUPE_MICRO_PROJETS,
    dimension: 'stade_projet',
    libelleDimension: 'Stade',
    source: 'COMPTAGE',
    sourceLabel: 'Comptage exact — /projets?stade_projet=…&per_page=1 (3 appels)',
    mesures: ['NB'],
    uniteN: 'dossiers',
    filtresApplicables: ['statut', 'region', 'dispositif'],
    raisonsFiltres: {},
  },
  {
    cle: 'par_type',
    // Second remplaçant de « Bénéficiaires par sexe ».
    label: 'Micro-projets par type de portage',
    groupe: 'MICRO_PROJETS',
    groupeLabel: GROUPE_MICRO_PROJETS,
    dimension: 'type_projet',
    libelleDimension: 'Type de portage',
    source: 'COMPTAGE',
    sourceLabel: 'Comptage exact — /projets?type_projet=…&per_page=1 (2 appels)',
    mesures: ['NB'],
    uniteN: 'dossiers',
    filtresApplicables: ['statut', 'region', 'dispositif'],
    raisonsFiltres: {},
  },

  /* ---- Groupe « Emplois & entreprises » --------------------------- */
  {
    cle: 'emplois_secteur',
    label: 'Emplois créés par secteur',
    groupe: 'EMPLOIS_ENTREPRISES',
    groupeLabel: GROUPE_EMPLOIS,
    dimension: 'secteur',
    libelleDimension: 'Secteur',
    source: 'AGREGAT',
    sourceLabel: 'Agrégat serveur — /dashboard/entreprises/emplois-secteur',
    mesures: ['NB'],
    uniteN: 'emplois',
    filtresApplicables: [],
    raisonsFiltres: {
      statut: RAISON_SOURCE_ENTREPRISES,
      region: RAISON_SOURCE_ENTREPRISES,
      dispositif: RAISON_SOURCE_ENTREPRISES,
    },
  },
  {
    cle: 'emplois_type',
    label: 'Emplois par type de contrat',
    groupe: 'EMPLOIS_ENTREPRISES',
    groupeLabel: GROUPE_EMPLOIS,
    dimension: 'type_emploi',
    libelleDimension: 'Type de contrat',
    source: 'AGREGAT',
    sourceLabel: 'Agrégat serveur — /dashboard/entreprises/types-emplois',
    mesures: ['NB'],
    uniteN: 'emplois',
    filtresApplicables: [],
    raisonsFiltres: {
      statut: RAISON_SOURCE_ENTREPRISES,
      region: RAISON_SOURCE_ENTREPRISES,
      dispositif: RAISON_SOURCE_ENTREPRISES,
    },
  },
  {
    cle: 'top_recruteuses',
    label: 'Top entreprises recruteuses',
    groupe: 'EMPLOIS_ENTREPRISES',
    groupeLabel: GROUPE_EMPLOIS,
    dimension: 'entreprise',
    libelleDimension: 'Entreprise',
    source: 'AGREGAT',
    sourceLabel: 'Agrégat serveur — /dashboard/entreprises/top-recruteuses',
    mesures: ['NB'],
    uniteN: 'emplois',
    filtresApplicables: [],
    raisonsFiltres: {
      statut: RAISON_SOURCE_ENTREPRISES,
      region: RAISON_SOURCE_ENTREPRISES,
      dispositif: RAISON_SOURCE_ENTREPRISES,
    },
  },
]

/** Accès direct par clé — évite un `.find()` à chaque rendu. */
export const RAPPORTS_PAR_CLE: Record<RAPPORT_CLE_T, RAPPORT_TYPE_T> = RAPPORTS.reduce(
  (acc, r) => {
    acc[r.cle] = r
    return acc
  },
  {} as Record<RAPPORT_CLE_T, RAPPORT_TYPE_T>,
)

/**
 * Rapport par défaut : `par_statut`. C'est le SEUL rapport de micro-projets qui
 * porte de la donnée aujourd'hui (les autres dimensions ont leurs clés
 * étrangères nulles en base). Ouvrir la page sur un écran vide serait un
 * mauvais premier contact, alors qu'aucun code n'a à être changé le jour où les
 * dimensions manquantes seront saisies.
 */
export const RAPPORT_PAR_DEFAUT: RAPPORT_CLE_T = 'par_statut'

/** Ce filtre agit-il réellement sur ce rapport ? */
export const filtreEstApplicable = (
  rapport: RAPPORT_TYPE_T,
  filtre: RAPPORT_FILTRE_T,
): boolean => rapport.filtresApplicables.includes(filtre)

/**
 * Texte d'infobulle d'un filtre désactivé, ou `null` s'il est actif.
 * À brancher sur le `title` / le tooltip du champ grisé.
 */
export const raisonFiltreDesactive = (
  rapport: RAPPORT_TYPE_T,
  filtre: RAPPORT_FILTRE_T,
): string | null => {
  if (filtreEstApplicable(rapport, filtre)) return null
  return (
    rapport.raisonsFiltres[filtre] ??
    "Ce filtre n'est pas honoré par la source de données de ce rapport."
  )
}

/** Le libellé à afficher pour ce rapport, selon la mesure réellement fournie. */
export const libelleRapport = (rapport: RAPPORT_TYPE_T, aMontant: boolean): string =>
  !aMontant && rapport.labelSansMontant ? rapport.labelSansMontant : rapport.label

/* ------------------------------------------------------------------ *
 * ÉTATS VIDES — dire la VRAIE cause, pas la plus commode              *
 * ------------------------------------------------------------------ */

/**
 * Message d'état vide. Distingue les causes possibles, parce qu'elles
 * n'appellent pas la même réaction de l'utilisateur : une dimension non encore
 * saisie en base n'est PAS un filtre trop restrictif.
 */
export const MESSAGE_VIDE_DIMENSION =
  "Aucune donnée pour cette dimension. Les micro-projets existants n'ont pas encore cette information renseignée ; le rapport s'affichera dès que la saisie sera faite."

export const MESSAGE_VIDE_FILTRES =
  'Aucune donnée ne correspond aux filtres sélectionnés.'

/**
 * Filtres portant sur une clé étrangère NON ALIMENTÉE en base (vérifié en live
 * le 30/08/2026 : `agence_id` et `dispositif_id` sont NULS sur les 110 000
 * micro-projets ; `/projets?agence_id=1&per_page=1` → total 0, et
 * `/dashboard/agences/projets-statut?agence_id=1` → `{"data":[]}`).
 *
 * Aucune valeur de ces deux filtres ne peut remonter quoi que ce soit
 * aujourd'hui. Leur opposer « Aucune donnée ne correspond aux filtres
 * sélectionnés » inviterait l'utilisateur à essayer les 33 régions l'une après
 * l'autre pour un résultat identique : ce serait une raison FAUSSE.
 */
const FILTRES_NON_ALIMENTES: RAPPORT_FILTRE_T[] = ['region', 'dispositif']

const MESSAGES_VIDE_RATTACHEMENT: Record<'region' | 'dispositif', string> = {
  region:
    "Le rattachement des micro-projets aux régions n'est pas encore saisi en base : aucun filtre par région ne peut remonter de donnée aujourd'hui, quelle que soit la région choisie. Retirez ce filtre pour consulter le rapport sur l'ensemble du portefeuille.",
  dispositif:
    "Le rattachement des micro-projets aux guichets n'est pas encore saisi en base : aucun filtre par guichet ne peut remonter de donnée aujourd'hui, quel que soit le guichet choisi. Retirez ce filtre pour consulter le rapport sur l'ensemble du portefeuille.",
}

/**
 * Choisit le message d'état vide d'après la CAUSE réelle du vide, et non
 * d'après la simple PRÉSENCE d'un filtre — qui attribuait le vide au filtre
 * dans le cas aujourd'hui le plus fréquent, où il n'y est pour rien.
 *
 * Trois cas, dans cet ordre de priorité :
 *  1. un filtre est posé sur une dimension dont la clé étrangère est nulle en
 *     base ⇒ ce filtre ne PEUT rien remonter, on le dit explicitement ;
 *  2. le filtre « Statut » est posé ⇒ c'est le seul réellement discriminant
 *     aujourd'hui, le vide lui est donc légitimement imputable ;
 *  3. aucun filtre en cause ⇒ c'est la dimension analysée elle-même qui n'est
 *     pas alimentée.
 */
export function messageEtatVide(
  rapport: RAPPORT_TYPE_T,
  filtresActifs: Partial<Record<RAPPORT_FILTRE_T, string | undefined>>,
): string {
  for (const f of FILTRES_NON_ALIMENTES) {
    if (filtreEstApplicable(rapport, f) && filtresActifs[f]) {
      return MESSAGES_VIDE_RATTACHEMENT[f as 'region' | 'dispositif']
    }
  }
  if (filtreEstApplicable(rapport, 'statut') && filtresActifs.statut) {
    return MESSAGE_VIDE_FILTRES
  }
  return MESSAGE_VIDE_DIMENSION
}
