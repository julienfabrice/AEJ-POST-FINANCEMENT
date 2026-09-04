/**
 * CADRE DE RÉSULTAT — types calqués sur le SCHÉMA PostgreSQL fourni par le
 * commanditaire (cadre-resultat-schema.sql), et NON sur une réponse d'API :
 * l'API n'existe pas encore.
 *
 * ── Conséquence directe sur la façon de lire ce fichier ──
 * Tout ce qui est ici est une PROMESSE de contrat, pas un relevé. Chaque point
 * où le schéma est ambigu, incohérent ou fautif est signalé en commentaire à
 * l'endroit exact du champ concerné, pour que la vérification au branchement se
 * fasse champ par champ, sans avoir à relire le SQL.
 *
 * ── Pourquoi les COQUILLES du schéma sont reprises telles quelles ──
 * `abgrege_cs` (pour « abrégé »), `intutile_cs` (pour « intitulé »),
 * `valeur_cible_indcateur_istr` (pour « indicateur »), `Date_suivi` (majuscule
 * initiale isolée) sont des fautes de frappe manifestes du schéma. Les corriger
 * ici produirait un front qui ne parle pas la même langue que l'API : le JSON
 * porterait `intutile_cs` et le type attendrait `intitule_cs`. On reprend donc
 * la faute, on la SIGNALE, et le jour où le backend renomme, la correction est
 * un rechercher/remplacer sur un nom unique dans le dépôt.
 *
 * ── Pourquoi les NUMERIC sont `string | number` ──
 * Convention déjà établie dans le dépôt (`BUDGET_T.montant_accorde`,
 * `REMBOURSEMENT_T.montant_echu`) : Laravel sérialise les colonnes DECIMAL en
 * CHAÎNE dans le JSON. Tant que le backend n'est pas branché, on ne peut pas
 * savoir s'il suivra cette convention — on accepte donc les deux formes, et les
 * écrans passent par un formateur numérique plutôt que par une arithmétique
 * directe.
 */

/* ------------------------------------------------------------------ *
 * 1. Niveaux du cadre de résultat                                     *
 * ------------------------------------------------------------------ */

/**
 * Référentiel des niveaux hiérarchiques (« Axe », « Effet », « Produit »…).
 * Table `niveaux_cadre_resultat`.
 */
export interface NIVEAU_CADRE_RESULTAT_T {
  id_nsc: number
  /**
   * Code du niveau, VARCHAR(20).
   * ⚠️ UNIQUE conjointement avec `programme` — pas seul : deux programmes
   * peuvent réutiliser le même code de niveau.
   */
  code_number_nsc: string
  /** Libellé affiché, VARCHAR(100). Ex. « Axe », « Effet », « Produit ». */
  libelle_nsc: string
  /** Ordre / profondeur du niveau dans la hiérarchie. INTEGER NOT NULL. */
  nombre_nsc: number
  /**
   * FK → `programmes(id_programme)`, NULLABLE.
   *
   * ⚠️ RÉFÉRENTIEL INCONNU : la table `programmes` n'existe ni dans l'API
   * actuelle ni dans le dépôt — c'est un concept NOUVEAU. Le champ est typé
   * `number | null` (une clé) sans hypothèse sur sa source ; sa résolution en
   * libellé passe par `referentielsCadreResultat.services.ts`, seul endroit à
   * modifier le jour où l'endpoint sera connu.
   *
   * ⚠️ Nommé `programme` (au singulier, sans suffixe `_nsc`) dans le schéma,
   * contrairement à toutes les autres colonnes de la table. Repris tel quel.
   */
  programme: number | null
  /**
   * VARCHAR(10) NOT NULL. Le schéma donne pour exemples « 1 », « 2 », « 3 » :
   * c'est donc un NUMÉRO DE NIVEAU stocké en texte, pas un libellé de type.
   * Typé `string` — convertir en nombre serait perdre les valeurs non
   * numériques que la colonne autorise.
   */
  type_niveau: string
}

/* ------------------------------------------------------------------ *
 * 2. Éléments du cadre de résultat                                    *
 * ------------------------------------------------------------------ */

/**
 * État d'un élément du cadre — colonne `etat VARCHAR(30) NULL`.
 *
 * ⚠️ QUESTION OUVERTE : le schéma ne documente AUCUNE valeur pour cette
 * colonne, ni ENUM, ni CHECK, ni commentaire. Inventer ici une union
 * (« ACTIF » | « CLOTURE » …) reviendrait à fabriquer une donnée : le premier
 * état renvoyé par l'API tomberait hors du type et l'écran afficherait un vide.
 * On type donc `string | null` et on rend l'état en badge GRIS générique
 * (`ETAT_CADRE_RESULTAT_BADGE_STYLE`), quelle que soit la valeur reçue. Le jour
 * où le backend documente ses états, ce type devient une union et la table de
 * badges gagne une couleur par valeur.
 */
export type ETAT_CADRE_RESULTAT_T = string | null

/**
 * Badge GRIS générique de l'état, palette produit (#F1F4F8 / #5A6B80).
 *
 * Une seule constante et non une table `Record<…, string>` : tant qu'aucune
 * valeur d'état n'est documentée, il n'y a rien à indexer. Codes en dur plutôt
 * que `COLORS.*` — Tailwind ne compose ses classes qu'à partir de littéraux
 * présents dans le source (même raison que `ETAT_ACTIVITE_BADGE_STYLES`).
 */
export const ETAT_CADRE_RESULTAT_BADGE_STYLE =
  'bg-[#F1F4F8] text-[#5A6B80] hover:bg-[#F1F4F8] border-0'

/**
 * Élément du cadre de résultat (axe, effet, produit…). Table `cadres_resultat`.
 *
 * C'est l'entité HIÉRARCHIQUE : `parent_cs` s'auto-référence, et c'est cette
 * seule colonne qui porte l'arborescence. `construireArbre()`
 * (`src/pages/CadreResultat/constants.ts`) la transforme en `CADRE_RESULTAT_NOEUD_T[]`.
 */
export interface CADRE_RESULTAT_T {
  id_cs: number
  /**
   * VARCHAR(20) NOT NULL. Ex. « OS1 ».
   * ⚠️ COQUILLE DU SCHÉMA : `abgrege_cs` pour « abrégé » (`abrege_cs`).
   * Reprise telle quelle — c'est la clé que l'API produira.
   */
  abgrege_cs: string
  /** VARCHAR(20) NOT NULL UNIQUE. Ex. « S01 ». */
  code_cs: string
  /**
   * TEXT NOT NULL — l'intitulé complet de l'élément.
   * ⚠️ COQUILLE DU SCHÉMA : `intutile_cs` pour « intitulé » (`intitule_cs`).
   * Reprise telle quelle.
   */
  intutile_cs: string
  /**
   * DATE NOT NULL DEFAULT CURRENT_DATE — posée par le serveur à la création.
   * Typée nullable côté front malgré le NOT NULL : rien ne garantit que l'API
   * la renverra sur toutes ses routes (une liste allégée peut l'omettre), et un
   * `null` reçu sur un champ typé non-nullable est un bug silencieux.
   */
  date_enregistrement: string | null
  /** DATE NULL — renseignée par le serveur à la modification. */
  date_modification: string | null
  /** VARCHAR(30) NULL — valeurs non documentées, cf. `ETAT_CADRE_RESULTAT_T`. */
  etat: ETAT_CADRE_RESULTAT_T
  /** FK → `niveaux_cadre_resultat(id_nsc)`, NOT NULL. */
  niveau_cs: number
  /**
   * FK → `cadres_resultat(id_cs)`, NULLABLE — AUTO-RÉFÉRENCE.
   *
   * `null` = élément racine. C'est l'unique porteur de la hiérarchie : aucune
   * colonne « chemin » ni « profondeur » n'existe en base, la profondeur est
   * donc CALCULÉE côté front par `construireArbre()`.
   */
  parent_cs: number | null
  /**
   * FK → `partenaires(id_partenaire)`, NULLABLE.
   *
   * ⚠️ RÉFÉRENTIEL À CONFIRMER : la table `partenaires` n'existe pas sous ce
   * nom dans l'API. La correspondance retenue est `/organismes`
   * (`ORGANISME_FINANCEMENT_T`) — voir `referentielsCadreResultat.services.ts`.
   */
  partenaire_cs: number | null

  /* --- Relations éventuellement embarquées ---------------------------- *
   * TOUTES optionnelles, sans exception : le contrat d'eager-loading de l'API
   * n'est pas connu (l'API n'existe pas). Les marquer requises reviendrait à
   * promettre un `niveau.libelle_nsc` que le premier GET pourrait ne pas
   * renvoyer. Les écrans doivent donc systématiquement prévoir le repli sur la
   * clé étrangère brute. */

  /** Niveau hiérarchique résolu — si l'API l'eager-load. */
  niveau?: NIVEAU_CADRE_RESULTAT_T | null
  /** Parent résolu — si l'API l'eager-load. */
  parent?: CADRE_RESULTAT_T | null
  /** Enfants résolus — si l'API les eager-load. */
  enfants?: CADRE_RESULTAT_T[]
}

/**
 * Élément du cadre ENRICHI pour l'affichage hiérarchique.
 *
 * `enfants` devient REQUIS (toujours un tableau, éventuellement vide) et
 * `profondeur` est calculée à partir de la racine (0 pour une racine). Produit
 * exclusivement par `construireArbre()` : ne jamais fabriquer ce type à la
 * main, la profondeur y serait fausse.
 */
export type CADRE_RESULTAT_NOEUD_T = CADRE_RESULTAT_T & {
  enfants: CADRE_RESULTAT_NOEUD_T[]
  /** 0 = racine. Sert à l'indentation de la colonne « Intitulé » de la grille. */
  profondeur: number
}

/* ------------------------------------------------------------------ *
 * 3. Indicateurs du cadre de résultat                                 *
 * ------------------------------------------------------------------ */

/**
 * Indicateur rattaché à un élément du cadre.
 * Table `indicateurs_cadre_resultat`.
 *
 * ⚠️ À NE PAS CONFONDRE avec `INDICATEUR_T` (`src/types/index.ts`), qui décrit
 * la ressource `/indicateurs` DÉJÀ EN LIGNE du module « Indicateurs & suivi ».
 * Ce sont deux tables différentes, aux colonnes disjointes ; d'où le suffixe
 * `_CADRE_RESULTAT_T`.
 */
export interface INDICATEUR_CADRE_RESULTAT_T {
  /**
   * ⚠️ Clé primaire nommée `id_indicateur_str` (« str »), alors que TOUTES les
   * autres colonnes de la table utilisent le suffixe « istr ». Les FK des
   * tables 4 et 5 pointent bien vers ce `id_indicateur_str`. Repris tel quel.
   */
  id_indicateur_str: number
  /**
   * VARCHAR(30) NOT NULL UNIQUE. Ex. « R002 ».
   * ⚠️ PIÈGE DE NOMMAGE : dans CETTE table, `code_indicateur_istr` est un CODE
   * MÉTIER TEXTUEL. Dans les tables 4 et 5, une colonne du MÊME NOM est un
   * ENTIER, clé étrangère vers `id_indicateur_str`. Même nom, deux types : voir
   * `CIBLE_INDICATEUR_T` et `SUIVI_INDICATEUR_T`.
   */
  code_indicateur_istr: string
  /** TEXT NOT NULL — libellé complet de l'indicateur. */
  intitule_indicateur_istr: string
  /** TEXT NULL. */
  description_istr: string | null
  /**
   * FK → `cadres_resultat(id_cs)`, NOT NULL, ON DELETE CASCADE.
   * ⚠️ Nommée `code_istr` alors qu'elle porte un ID numérique, pas un code.
   */
  code_istr: number
  /**
   * INTEGER NULL.
   *
   * ⚠️ QUESTION OUVERTE, mentionnée telle quelle dans le schéma : « à
   * confirmer : FK vers niveaux_cadre_resultat ou simple entier ? ». Aucune
   * contrainte REFERENCES n'est déclarée. Typé `number | null` — ce qui est
   * vrai dans les deux hypothèses. Le formulaire le traite en SAISIE NUMÉRIQUE
   * libre tant que la question n'est pas tranchée : en faire un sélecteur de
   * niveaux préjugerait de la réponse et empêcherait de saisir une valeur
   * légitime si c'est un simple entier.
   */
  niveau_istr: number | null
  /**
   * FK → `programmes(id_programme)`, NULLABLE.
   * ⚠️ Même référentiel inconnu que `NIVEAU_CADRE_RESULTAT_T.programme`.
   */
  programme_istr: number | null
  /**
   * FK → `structures(id_structure)`, NULLABLE.
   * ⚠️ RÉFÉRENTIEL INCONNU : aucune table `structures` dans l'API ni dans le
   * dépôt, et aucune correspondance plausible identifiée (à la différence de
   * `partenaires` → `/organismes`). Résolution dans
   * `referentielsCadreResultat.services.ts`.
   */
  structure_istr: number | null
  /**
   * VARCHAR(30) NULL. Ex. « Trimestriel ».
   *
   * ⚠️ Aucune liste de valeurs n'est documentée : typé `string`, SANS union et
   * SANS liste d'options toute faite. Proposer un `<Select>` « Mensuel /
   * Trimestriel / Semestriel / Annuel » serait inventer un référentiel que le
   * backend n'a pas défini. Saisie texte libre bornée à 30 caractères tant que
   * la question n'est pas tranchée.
   *
   * ⚠️ Suffixe `_iop` isolé au milieu des `_istr` de la table : probable
   * copier-coller depuis une autre table. Repris tel quel.
   */
  periodicite_iop: string | null
  /** VARCHAR(100) NULL — nom du responsable, texte libre (pas une FK). */
  responsable_istr: string | null
  /** VARCHAR(150) NULL — source de la donnée, texte libre. */
  source_istr: string | null

  /* --- Relations éventuellement embarquées (cf. CADRE_RESULTAT_T) ------ */

  /** Élément du cadre auquel l'indicateur est rattaché (`code_istr` résolu). */
  cadre?: CADRE_RESULTAT_T | null
  /** Niveau résolu — n'existera que si `niveau_istr` est bien une FK. */
  niveau?: NIVEAU_CADRE_RESULTAT_T | null
}

/* ------------------------------------------------------------------ *
 * 4. Cibles annuelles                                                 *
 * ------------------------------------------------------------------ */

/**
 * Valeur cible ANNUELLE d'un indicateur, par programme et unité de gestion.
 * Table `cibles_indicateur_cadre_resultat`.
 *
 * UNIQUE (code_indicateur_istr, code_programme, code_ug, annee) : une seule
 * cible par indicateur / programme / UG / année.
 */
export interface CIBLE_INDICATEUR_T {
  id_cible_indicateur_istr: number
  /**
   * Colonne DATE (et non INTEGER) alors qu'elle porte une ANNÉE : le schéma
   * donne « 2019-01-01 » en exemple, soit le 1er janvier de l'année visée.
   * Typée `string | null` (date ISO) ; la conversion « année saisie → date du
   * 1er janvier » est faite par `toApiPayload` du service, jamais par l'écran.
   */
  annee: string | null
  /**
   * NUMERIC(15,2) NOT NULL.
   * ⚠️ COQUILLE DU SCHÉMA : `valeur_cible_indcateur_istr` pour
   * « indicateur » (`valeur_cible_indicateur_istr`). Reprise telle quelle.
   * `string | number` : convention DECIMAL du dépôt (cf. en-tête).
   */
  valeur_cible_indcateur_istr: string | number
  /**
   * FK → `indicateurs_cadre_resultat(id_indicateur_str)`, NOT NULL.
   * ⚠️ ENTIER ici, alors que la colonne du MÊME NOM dans la table 3 est un
   * VARCHAR(30) (cf. `INDICATEUR_CADRE_RESULTAT_T.code_indicateur_istr`).
   */
  code_indicateur_istr: number
  /**
   * FK → programmes, NOT NULL.
   *
   * ⚠️ INCOHÉRENCE DU SCHÉMA : déclarée `REFERENCES programmes(code_programme)`
   * alors que la table 1 référence `programmes(id_programme)`. Deux colonnes
   * cibles différentes pour la même table — l'une des deux est fausse, et le
   * schéma ne permet pas de dire laquelle. Typée `number` : c'est vrai dans les
   * deux cas (SERIAL ou code numérique), et c'est la seule chose qu'on puisse
   * affirmer sans deviner.
   */
  code_programme: number
  /**
   * FK → `unites_gestion(code_ug)`, NULLABLE.
   * ⚠️ RÉFÉRENTIEL INCONNU : pas de table `unites_gestion` dans l'API. Les
   * candidats du dépôt (agences régionales, directions, services, fonctions,
   * guichets) sont cinq référentiels distincts, aucun ne s'impose. Résolution
   * dans `referentielsCadreResultat.services.ts`.
   */
  code_ug: number | null

  /** Relation éventuellement embarquée (cf. CADRE_RESULTAT_T). */
  indicateur?: INDICATEUR_CADRE_RESULTAT_T | null
}

/* ------------------------------------------------------------------ *
 * 5. Suivis / réalisations                                            *
 * ------------------------------------------------------------------ */

/**
 * Réalisation périodique d'un indicateur.
 * Table `suivis_indicateur_cadre_resultat`.
 *
 * ⚠️ TABLE LA PLUS ABÎMÉE DU SCHÉMA — trois défauts, traités ici et non masqués :
 *
 *  1. Il manque une virgule après `Date_suivi date NOT NULL` : le SQL tel quel
 *     ne se compile pas. Sans conséquence sur le modèle (la colonne suivante
 *     est manifestement `code_ug`), mais c'est le signe que la table n'a jamais
 *     été exécutée telle quelle.
 *
 *  2. La contrainte `UNIQUE (code_indicateur_istr, code_programme, code_ug,
 *     periode_suivi)` et deux index citent `code_programme` et `periode_suivi`,
 *     DEUX COLONNES QUI NE SONT PAS DÉCLARÉES dans la table. Le type ci-dessous
 *     porte les colonnes RÉELLEMENT déclarées ; `code_programme` est ajouté en
 *     OPTIONNEL (la contrainte le suppose), `periode_suivi` ne l'est pas —
 *     `Date_suivi` joue déjà ce rôle et en ajouter une seconde inventerait une
 *     colonne.
 *
 *  3. `Date_suivi` porte une majuscule initiale, seule de tout le schéma.
 *     PostgreSQL replierait l'identifiant non quoté en `date_suivi`, mais rien
 *     ne dit ce que l'ORM exposera dans le JSON. Repris tel quel — au
 *     branchement, c'est le premier champ à vérifier.
 */
export interface SUIVI_INDICATEUR_T {
  id_suivi_indicateur_istr: number
  /**
   * FK → `indicateurs_cadre_resultat(id_indicateur_str)`, NOT NULL.
   * ⚠️ ENTIER, comme dans la table 4 — pas le code textuel de la table 3.
   */
  code_indicateur_istr: number
  /**
   * DATE NOT NULL — date de la mesure.
   * ⚠️ Majuscule initiale conservée (cf. point 3 de l'en-tête).
   */
  Date_suivi: string | null
  /**
   * FK → `unites_gestion(code_ug)`, NULLABLE.
   * ⚠️ Même référentiel inconnu que `CIBLE_INDICATEUR_T.code_ug`.
   */
  code_ug: number | null
  /** NUMERIC(15,2) NOT NULL — convention DECIMAL du dépôt (cf. en-tête). */
  valeur_realisee_istr: string | number
  /** TEXT NULL. */
  commentaire_suivi_istr: string | null
  /** TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP — posé par le serveur. */
  date_enregistrement: string | null
  /** VARCHAR(100) NULL — texte libre, pas une FK vers `personnels`. */
  modifier_par: string | null
  /**
   * ⚠️ COLONNE NON DÉCLARÉE mais exigée par la contrainte UNIQUE et par un
   * index de la table (point 2 de l'en-tête).
   *
   * OPTIONNELLE (`?`) et non requise : tant que le backend n'a pas tranché
   * entre « ajouter la colonne » et « corriger la contrainte », l'exiger dans
   * le formulaire bloquerait la saisie sur un champ peut-être inexistant. Le
   * service ne l'envoie QUE si elle est renseignée — envoyer `null` sur une
   * colonne absente ferait échouer la validation Laravel.
   */
  code_programme?: number | null

  /** Relation éventuellement embarquée (cf. CADRE_RESULTAT_T). */
  indicateur?: INDICATEUR_CADRE_RESULTAT_T | null
}

/* ------------------------------------------------------------------ *
 * Options de sélecteur pour les référentiels externes                 *
 * ------------------------------------------------------------------ */

/**
 * Option d'un `<Select>` de référentiel EXTERNE (programme, structure, unité de
 * gestion, partenaire).
 *
 * `value` est un NOMBRE, contrairement au `SELECT_OPTION_T<V extends string>`
 * de `suivi.types.ts` qui décrit des ENUMs textuels : ici les valeurs sont des
 * clés étrangères entières. Les deux types coexistent sans se recouvrir.
 */
export interface REFERENTIEL_OPTION_T {
  value: number
  label: string
}

/**
 * Retour uniforme des hooks de `referentielsCadreResultat.services.ts`.
 *
 * `disponible` est le cœur du dispositif : il vaut `false` tant que la SOURCE
 * du référentiel n'est pas connue. Un sélecteur dont le référentiel n'est pas
 * disponible est DÉSACTIVÉ et affiche `messageIndisponible` — jamais peuplé de
 * valeurs inventées.
 */
export interface REFERENTIEL_CADRE_RESULTAT_T {
  options: REFERENTIEL_OPTION_T[]
  isLoading: boolean
  /** `false` = source inconnue ou non branchée → sélecteur désactivé. */
  disponible: boolean
  /**
   * Raison de l'indisponibilité, à afficher dans le sélecteur désactivé.
   * `null` quand `disponible` vaut `true`.
   */
  messageIndisponible: string | null
}
