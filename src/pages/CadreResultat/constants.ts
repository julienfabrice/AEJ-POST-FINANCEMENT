import type { CADRE_RESULTAT_NOEUD_T, CADRE_RESULTAT_T } from '@/types'

/**
 * CADRE DE RÉSULTAT — point de branchement unique de l'API, libellés d'onglets
 * et construction de l'arbre hiérarchique.
 *
 * ══════════════════════════════════════════════════════════════════════
 *  LE DISPOSITIF « API NON CONNECTÉE » — à lire avant toute modification
 * ══════════════════════════════════════════════════════════════════════
 * Les cinq endpoints de ce module N'EXISTENT PAS ENCORE côté backend. Tout le
 * code (types, services, schémas, écrans) est néanmoins écrit COMPLET, appels
 * axios compris : il ne restera qu'à vérifier les chemins ci-dessous et à
 * passer `CADRE_RESULTAT_API_PRETE` à `true`. AUCUNE autre modification ne doit
 * être nécessaire — c'est la contrainte de conception de tout le module.
 *
 * Ce que le drapeau change, et où (tout est dans `cadreResultat.services.ts`) :
 *
 *  • LECTURES  — `enabled: CADRE_RESULTAT_API_PRETE`, plus une donnée initiale
 *    de tableau vide. Aucune requête n'est émise : pas de rafale de 404 dans la
 *    console, pas de retry TanStack Query, pas d'écran d'erreur. Les grilles
 *    affichent leur état vide normal.
 *
 *  • ÉCRITURES — la `mutationFn` sort AVANT l'appel axios, affiche un toast
 *    sonner explicatif et renvoie `null`. Aucun cache n'est invalidé, aucune
 *    donnée n'est fabriquée : l'utilisateur comprend que sa saisie n'est pas
 *    perdue par erreur mais impossible pour l'instant.
 *
 *  • ÉCRAN     — bandeau d'INFORMATION discret (bleu, pas rouge) : l'écran est
 *    prêt, il attend ses données. Ce n'est pas une panne.
 *
 * ⚠️ `CADRE_RESULTAT_API_PRETE` est annoté `: boolean` et non laissé au type
 * littéral `false` que TypeScript infère par défaut. Sans cette annotation, le
 * compilateur NARROWIT toutes les branches « API prête » à du code mort et
 * signalerait les comparaisons comme toujours fausses : le jour du branchement,
 * on découvrirait une pluie d'erreurs de compilation là où il ne devait y avoir
 * qu'un `false` → `true`. L'annotation garde les deux branches vivantes et
 * type-vérifiées dès aujourd'hui.
 */
export const CADRE_RESULTAT_API_PRETE: boolean = false

/**
 * Chemins des cinq ressources — SEUL endroit du dépôt où ils sont écrits.
 *
 * PRÉSUMÉS : construits en kebab-case pluriel, convention de l'API existante
 * (`/type-organismes`, `/agences-regionales`, `/plans-decaissement`), à partir
 * des noms de tables du schéma. À VÉRIFIER au branchement — c'est l'unique
 * point de vérification prévu.
 *
 * Le préfixe `/api` est ajouté par `axiosInstance`, comme partout ailleurs.
 */
export const CADRE_RESULTAT_ENDPOINTS = {
  /** Table 1 — `niveaux_cadre_resultat`. */
  niveaux: '/niveaux-cadre-resultat',
  /** Table 2 — `cadres_resultat`. */
  cadres: '/cadres-resultat',
  /** Table 3 — `indicateurs_cadre_resultat`. */
  indicateurs: '/indicateurs-cadre-resultat',
  /** Table 4 — `cibles_indicateur_cadre_resultat`. */
  cibles: '/cibles-indicateur-cadre-resultat',
  /** Table 5 — `suivis_indicateur_cadre_resultat`. */
  suivis: '/suivis-indicateur-cadre-resultat',
} as const

/**
 * Racine des clés de cache TanStack Query du module.
 *
 * Toutes les clés sont préfixées par cette chaîne (`['cadre-resultat', …]`) :
 * une invalidation ciblée reste possible ressource par ressource, et un
 * `invalidateQueries({ queryKey: [CADRE_RESULTAT_QUERY_ROOT] })` rafraîchit le
 * module entier — utile le jour du branchement, où tout est à recharger.
 */
export const CADRE_RESULTAT_QUERY_ROOT = 'cadre-resultat'

/**
 * Message unique affiché par les mutations tant que l'API n'est pas branchée.
 *
 * Formulé pour ne PAS ressembler à une erreur : l'utilisateur n'a rien fait de
 * mal, et rien n'est cassé.
 */
export const MESSAGE_ECRITURE_INDISPONIBLE =
  "L'enregistrement sera possible dès la connexion de l'API du cadre de résultat."

/** Texte du bandeau d'information de la page (état « en attente de l'API »). */
export const MESSAGE_BANDEAU_API_NON_BRANCHEE =
  "L'écran est prêt : les données s'afficheront dès la connexion de l'API du cadre de résultat."

/**
 * Message des sélecteurs alimentés par les ressources du module LUI-MÊME
 * (niveaux, éléments du cadre, indicateurs).
 *
 * À distinguer des messages de `referentielsCadreResultat.services.ts` : ces
 * derniers signalent qu'une SOURCE EXTERNE est inconnue (`programmes`,
 * `structures`…), question qui restera ouverte même une fois l'API branchée.
 * Ici, au contraire, la source est parfaitement connue — c'est l'un des cinq
 * endpoints ci-dessus — elle n'est simplement pas encore joignable. Les
 * confondre laisserait croire à un arbitrage en suspens là où il n'y a qu'une
 * attente de branchement.
 */
export const MESSAGE_SELECTEUR_API_NON_BRANCHEE =
  "Sélecteur indisponible tant que l'API du cadre de résultat n'est pas connectée."

/* ------------------------------------------------------------------ *
 * Onglets                                                             *
 * ------------------------------------------------------------------ */

/** Clés d'onglets — valeurs des `<TabsTrigger value=…>` de la page. */
export const CADRE_RESULTAT_ONGLET_KEYS = {
  /**
   * Onglet de SYNTHÈSE — le seul du module qui n'expose aucune grille : il
   * confronte les cibles annuelles aux réalisations (`UI/OngletAtteinte`).
   */
  ATTEINTE: 'atteinte',
  CADRE: 'cadre',
  INDICATEURS: 'indicateurs',
  CIBLES: 'cibles',
  SUIVIS: 'suivis',
  NIVEAUX: 'niveaux',
} as const

export type CadreResultatOngletKey =
  (typeof CADRE_RESULTAT_ONGLET_KEYS)[keyof typeof CADRE_RESULTAT_ONGLET_KEYS]

/**
 * Description d'un onglet.
 *
 * `compteurSingulier` / `compteurPluriel` alimentent le compteur « N libellé »
 * de la barre d'onglet, présent sur tous les écrans à onglets du dépôt
 * (Suivi, Partenaires). Deux formes plutôt qu'une : « 1 indicateurs » est une
 * faute que la maquette ne commet nulle part.
 */
export interface ONGLET_CADRE_RESULTAT_T {
  key: CadreResultatOngletKey
  label: string
  compteurSingulier: string
  compteurPluriel: string
  /**
   * Libellé du bouton d'ajout de la barre d'onglet.
   *
   * ── Pourquoi OPTIONNEL ──
   * L'onglet « Atteinte des cibles » ne CRÉE rien : c'est une synthèse, il ne
   * fait que rapprocher des lignes saisies dans les autres onglets. Lui donner
   * un bouton « Nouveau… » proposerait de créer une ressource qui n'existe
   * pas. L'absence doit donc pouvoir s'ÉCRIRE dans le catalogue — une chaîne
   * vide, ou un libellé factice jamais affiché, obligerait la page à coder en
   * dur la liste des onglets sans bouton, c'est-à-dire à savoir ce que le
   * catalogue est précisément là pour dire.
   */
  boutonAjout?: string
  /**
   * Placeholder du champ de recherche de la barre d'onglet.
   *
   * OPTIONNEL pour la même raison. La synthèse n'a rien à filtrer par texte :
   * elle tient en une ligne par indicateur, déjà bornée par son sélecteur
   * d'exercice — le seul filtre qui ait un sens sur un rapprochement
   * cible/réalisé.
   *
   * ⚠️ CONTRAT AVEC LA PAGE : les deux champs sont absents ENSEMBLE ou
   * présents ENSEMBLE. Un onglet sans `boutonAjout` est un onglet sans barre
   * d'outils du tout (pas de recherche, pas de compteur, pas de bouton) ; la
   * page teste donc l'un des deux pour décider de rendre la barre, et l'onglet
   * se rend alors seul, comme « Planification & taux » de la page Indicateurs.
   */
  placeholderRecherche?: string
}

/**
 * Ordre d'affichage des onglets : la RÉPONSE d'abord, la SAISIE ensuite.
 *
 * « Atteinte des cibles » ouvre la liste parce que c'est la raison d'être d'un
 * cadre de résultat — savoir où l'on en est —, alors que les cinq autres
 * onglets servent à l'alimenter. Même parti que la page « Indicateurs & suivi »
 * du dépôt, dont l'onglet « Planification & taux » précède les onglets de
 * saisie, et que la maquette applique partout ailleurs : on montre le résultat
 * avant les tables qui le produisent.
 *
 * Les cinq suivants vont du plus structurant au plus opérationnel :
 * l'arborescence d'abord (c'est le sujet de l'écran), les indicateurs qui s'y
 * rattachent ensuite, puis leurs cibles et leurs réalisations, et enfin le
 * référentiel des niveaux — le moins souvent consulté, comme les référentiels
 * ailleurs dans le dépôt.
 */
export const CADRE_RESULTAT_ONGLETS: ONGLET_CADRE_RESULTAT_T[] = [
  {
    key: CADRE_RESULTAT_ONGLET_KEYS.ATTEINTE,
    label: 'Atteinte des cibles',
    /**
     * Le compteur reste renseigné — la synthèse affiche bien UNE LIGNE PAR
     * INDICATEUR — mais il est calculé par l'onglet lui-même (`OngletAtteinte`)
     * et non par `useCadreResultatGrid`, qui n'a pas de grille à lui donner :
     * pour cette clé, l'agrégateur retombe sur sa branche par défaut et
     * renverrait la longueur d'un AUTRE onglet. La page ne doit donc pas
     * afficher de compteur ici — ce qu'elle ne fait pas, faute de barre
     * d'outils (cf. `ONGLET_CADRE_RESULTAT_T`).
     */
    compteurSingulier: 'indicateur',
    compteurPluriel: 'indicateurs',
    // Ni `boutonAjout` ni `placeholderRecherche` : un onglet de synthèse ne
    // crée rien et ne se filtre pas au texte (cf. `ONGLET_CADRE_RESULTAT_T`).
  },
  {
    key: CADRE_RESULTAT_ONGLET_KEYS.CADRE,
    label: 'Cadre de résultat',
    compteurSingulier: 'élément',
    compteurPluriel: 'éléments',
    boutonAjout: 'Nouvel élément',
    placeholderRecherche: 'Rechercher un élément…',
  },
  {
    key: CADRE_RESULTAT_ONGLET_KEYS.INDICATEURS,
    label: 'Indicateurs',
    compteurSingulier: 'indicateur',
    compteurPluriel: 'indicateurs',
    boutonAjout: 'Nouvel indicateur',
    placeholderRecherche: 'Rechercher un indicateur…',
  },
  {
    key: CADRE_RESULTAT_ONGLET_KEYS.CIBLES,
    label: 'Cibles annuelles',
    compteurSingulier: 'cible',
    compteurPluriel: 'cibles',
    boutonAjout: 'Nouvelle cible',
    placeholderRecherche: 'Rechercher une cible…',
  },
  {
    key: CADRE_RESULTAT_ONGLET_KEYS.SUIVIS,
    label: 'Réalisations',
    compteurSingulier: 'réalisation',
    compteurPluriel: 'réalisations',
    boutonAjout: 'Nouvelle réalisation',
    placeholderRecherche: 'Rechercher une réalisation…',
  },
  {
    key: CADRE_RESULTAT_ONGLET_KEYS.NIVEAUX,
    label: 'Niveaux',
    compteurSingulier: 'niveau',
    compteurPluriel: 'niveaux',
    boutonAjout: 'Nouveau niveau',
    placeholderRecherche: 'Rechercher un niveau…',
  },
]

/* ------------------------------------------------------------------ *
 * Construction de l'arbre hiérarchique                                *
 * ------------------------------------------------------------------ */

/**
 * Liste plate d'éléments → forêt hiérarchique, via `parent_cs`.
 *
 * L'API renverra une LISTE PLATE : la hiérarchie n'existe qu'au travers de
 * l'auto-référence `parent_cs`, sans colonne « chemin » ni « profondeur ». La
 * profondeur affichée est donc calculée ici, une fois, plutôt que recalculée
 * par chaque cellule de la grille.
 *
 * ── DEUX PROTECTIONS, et pourquoi elles ne sont pas décoratives ──
 *
 * 1. PARENT INEXISTANT → l'élément REMONTE À LA RACINE.
 *    `parent_cs` est `ON DELETE SET NULL` en base, mais rien ne garantit ce que
 *    l'API livrera : une liste filtrée (par programme, par niveau, par
 *    recherche serveur) contient des éléments dont le parent est hors du lot.
 *    Sans cette protection, ces éléments seraient rattachés à `undefined` et
 *    DISPARAÎTRAIENT de l'affichage — une ligne absente est bien plus grave
 *    qu'une ligne mal indentée. On préfère donc les montrer à la racine.
 *
 * 2. CYCLE → DÉTECTÉ ET NEUTRALISÉ, jamais de récursion infinie.
 *    Aucune contrainte SQL n'interdit A → B → A : PostgreSQL accepte
 *    parfaitement un cycle sur une auto-référence. Une seule donnée cyclique
 *    suffirait à faire boucler l'indentation à l'infini et à figer l'onglet
 *    (pas une erreur visible : un navigateur bloqué). Le maillon qui referme la
 *    boucle est donc détaché et remonté à la racine ; tous les éléments restent
 *    visibles, et l'anomalie saute aux yeux dans l'écran au lieu de le tuer.
 *
 * Le parcours de profondeur est ITÉRATIF (pile explicite) et non récursif :
 * une hiérarchie profonde ne doit pas pouvoir faire déborder la pile d'appels.
 */
export function construireArbre(elements: CADRE_RESULTAT_T[]): CADRE_RESULTAT_NOEUD_T[] {
  // Un nœud par identifiant. Une `Map` dédoublonne au passage : si l'API
  // renvoyait deux fois la même ligne, elle n'apparaîtrait qu'une fois.
  const noeuds = new Map<number, CADRE_RESULTAT_NOEUD_T>()
  for (const element of elements) {
    noeuds.set(element.id_cs, { ...element, enfants: [], profondeur: 0 })
  }

  /**
   * Parent RETENU pour chaque nœud, après application de la protection 1.
   * `null` = rattaché à la racine. On calcule cette table AVANT d'assembler
   * l'arbre : la détection de cycle a besoin de la relation complète.
   */
  const parentRetenu = new Map<number, number | null>()
  for (const noeud of noeuds.values()) {
    const parent = noeud.parent_cs
    const parentValide =
      parent !== null &&
      parent !== undefined &&
      // Un élément qui se déclare son propre parent est le cycle le plus court.
      parent !== noeud.id_cs &&
      // Protection 1 : parent absent du lot reçu → racine.
      noeuds.has(parent)
    parentRetenu.set(noeud.id_cs, parentValide ? parent : null)
  }

  // Protection 2 : on remonte la chaîne des parents de chaque nœud ; si on
  // repasse par un identifiant déjà vu, la boucle est refermée et on détache le
  // nœud de départ. Le premier maillon rencontré est coupé, les suivants
  // trouvent alors une chaîne saine et conservent leur parent : le sous-arbre
  // reste lisible, seule la boucle est ouverte.
  for (const id of parentRetenu.keys()) {
    const vus = new Set<number>([id])
    let courant = parentRetenu.get(id) ?? null
    while (courant !== null) {
      if (vus.has(courant)) {
        parentRetenu.set(id, null)
        break
      }
      vus.add(courant)
      courant = parentRetenu.get(courant) ?? null
    }
  }

  const racines: CADRE_RESULTAT_NOEUD_T[] = []
  for (const noeud of noeuds.values()) {
    const parent = parentRetenu.get(noeud.id_cs) ?? null
    if (parent === null) {
      racines.push(noeud)
      continue
    }
    noeuds.get(parent)?.enfants.push(noeud)
  }

  // Profondeur : parcours en profondeur itératif depuis chaque racine. Les
  // cycles ayant été neutralisés au-dessus, la terminaison est garantie.
  const pile: CADRE_RESULTAT_NOEUD_T[] = [...racines]
  while (pile.length > 0) {
    const noeud = pile.pop()
    if (!noeud) break
    for (const enfant of noeud.enfants) {
      enfant.profondeur = noeud.profondeur + 1
      pile.push(enfant)
    }
  }

  return racines
}

/**
 * Forêt → liste plate ORDONNÉE (parcours préfixe : un parent, puis tous ses
 * descendants, puis le parent suivant).
 *
 * AG Grid n'affiche que des lignes plates : c'est cette fonction qui donne
 * l'ordre d'affichage de l'onglet « Cadre de résultat », chaque ligne portant
 * sa `profondeur` pour l'indentation. Séparée de `construireArbre` parce que
 * l'arbre sert aussi à d'autres usages (sélecteur de parent, comptage des
 * enfants) où l'aplatissement n'a pas lieu d'être.
 *
 * Itérative elle aussi, pour la même raison que ci-dessus.
 */
export function aplatirArbre(noeuds: CADRE_RESULTAT_NOEUD_T[]): CADRE_RESULTAT_NOEUD_T[] {
  const resultat: CADRE_RESULTAT_NOEUD_T[] = []
  // Pile LIFO : on empile les enfants en ordre inverse pour les dépiler dans
  // l'ordre naturel de la liste reçue.
  const pile: CADRE_RESULTAT_NOEUD_T[] = [...noeuds].reverse()
  while (pile.length > 0) {
    const noeud = pile.pop()
    if (!noeud) break
    resultat.push(noeud)
    for (let i = noeud.enfants.length - 1; i >= 0; i -= 1) {
      const enfant = noeud.enfants[i]
      if (enfant) pile.push(enfant)
    }
  }
  return resultat
}
