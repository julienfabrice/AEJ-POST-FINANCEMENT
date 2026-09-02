import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export interface PROJETS_API_RESPONSE_T {
  message: string
  data: MICRO_PROJET_T[]
  pagination: {
    current_page: number
    per_page: number
    total: number
    last_page: number
    /** `null` quand la page est vide — vérifié en live sur un filtre à 0 résultat. */
    from: number | null
    to: number | null
  }
}

/** Taille de lot d'une recherche de micro-projets (cf. `useSearch`). */
export const PROJETS_SEARCH_PER_PAGE = 25

/**
 * Résultat d'une recherche de micro-projets : les lignes du lot, et le nombre
 * TOTAL de correspondances côté serveur (qui le dépasse presque toujours).
 * Même forme que `PROMOTEURS_PAGE_T` de `promoteurs.services.ts`.
 */
export interface PROJETS_SEARCH_PAGE_T {
  rows: MICRO_PROJET_T[]
  total: number
}


/* ------------------------------------------------------------------ *
 * COMPTAGES — agréger sans charger les lignes                         *
 * ------------------------------------------------------------------ */

/**
 * Filtres RÉELLEMENT honorés par `GET /projets`, testés un par un le 30/08/2026
 * sur une baseline de 110 000 lignes :
 *   statut ✅ · stade_projet ✅ · type_projet ✅ · promoteur_id ✅ · search ✅
 *   dispositif_id ✅ · secteur_id ✅ · agence_id ✅ · commune_id ✅
 *   organisme_id ✅ · guichet_id ✅
 *     (ces six-là filtrent bien, mais renvoient 0 : les clés étrangères
 *      correspondantes sont NULLES sur l'intégralité du jeu de données actuel)
 *
 * ⛔ `sexe_id` est IGNORÉ par l'API : le passer renvoie les 110 000 lignes.
 *    Il est donc volontairement ABSENT de ce type — une dimension « sexe » ne
 *    peut pas être produite, et on ne laisse pas l'appelant croire le contraire.
 */
export interface PROJETS_FILTRES_T {
  statut?: string
  dispositif_id?: number | string
  secteur_id?: number | string
  agence_id?: number | string
  commune_id?: number | string
  organisme_id?: number | string
  guichet_id?: number | string
  stade_projet?: string
  type_projet?: string
  promoteur_id?: number | string
  search?: string
}

/**
 * `per_page=1` : on ne veut PAS les lignes, seulement `pagination.total`.
 *
 * ── Coût RÉELLEMENT MESURÉ (30/08/2026) ──
 *   • filtre à 0 résultat  → ≈ 150 octets (`?secteur_id=22` : 151 octets) ;
 *   • filtre à ≥ 1 résultat → ≈ 2,1 Ko (`?stade_projet=CREATION` : 2 137
 *     octets), parce que `per_page=1` renvoie tout de même UNE ligne de
 *     micro-projet COMPLÈTE, avec ses 9 relations imbriquées (dispositif,
 *     organisme, guichet, secteur, commune, agence, agence_imputation,
 *     promoteur, workflow_instance).
 * L'API n'expose aucun `per_page=0` ni aucun endpoint de comptage : ces 2,1 Ko
 * sont le plancher atteignable. À comparer aux ≈ 90 Ko d'un `per_page=50` et
 * aux ≈ 200 Mo d'un chargement des 110 000 micro-projets.
 */
const PROJETS_COUNT_PER_PAGE = 1

/** 15 min : un comptage sur 110 000 dossiers ne bouge que de quelques unités par jour. */
const PROJETS_COUNT_STALE_TIME = 15 * 60 * 1000

/**
 * Une valeur d'une dimension à compter (un secteur, un guichet, un stade…).
 * `filtres` porte le filtre PROPRE à cette valeur ; les filtres transverses
 * (statut, région) sont passés à part et fusionnés par `useCounts`.
 */
export interface COUNT_BUCKET_T {
  /** Identifiant stable de la valeur — sert de clé de ligne et de jointure. */
  cle: string
  /** Libellé affiché à l'utilisateur. */
  label: string
  filtres: PROJETS_FILTRES_T
}

/** Une ligne de comptage résolue. */
export interface COUNT_ROW_T {
  cle: string
  label: string
  n: number
}

export interface COUNTS_RESULT_T {
  /** Dans l'ORDRE des buckets fournis — le tri par mesure est du ressort de l'appelant. */
  rows: COUNT_ROW_T[]
  isLoading: boolean
  isError: boolean
}

/**
 * Retire les valeurs vides : `?statut=` n'est pas neutre côté Laravel, et
 * surtout `{ statut: '' }` et `{}` doivent produire la MÊME clé de cache.
 */
const nettoyerFiltres = (
  filtres: PROJETS_FILTRES_T,
): Record<string, string | number> =>
  Object.fromEntries(
    Object.entries(filtres).filter(
      ([, v]) => v !== undefined && v !== null && v !== '',
    ),
  ) as Record<string, string | number>

/** Clé de cache PARTAGÉE entre `useCount` et chaque requête de `useCounts`. */
const cleComptage = (filtres: Record<string, string | number>) =>
  ['projets', 'count', filtres] as const

const compter = async (filtres: Record<string, string | number>): Promise<number> => {
  const { data } = await axiosInstance.get<PROJETS_API_RESPONSE_T>('/projets', {
    params: { ...filtres, per_page: PROJETS_COUNT_PER_PAGE },
  })

  /**
   * ⚠️ AUCUN repli sur `0`.
   *
   * Une réponse HTTP 200 dépourvue de `pagination.total` — changement de
   * contrat, page d'erreur HTML servie en 200 par un proxy, réponse tronquée —
   * serait convertie en un comptage de ZÉRO indiscernable d'un zéro légitime :
   * `dispositif_id`, `secteur_id` et `agence_id` renvoient précisément 0
   * aujourd'hui. La requête passerait pour réussie, `isError` resterait faux, et
   * l'écran afficherait une répartition de zéros parfaitement crédible — un
   * chiffre INVENTÉ, exporté en CSV et imprimé sur une fiche de synthèse.
   *
   * On lève donc une erreur : TanStack Query bascule la requête en échec,
   * `useCounts` propage `isError`, et l'écran montre son bloc d'erreur.
   */
  const total = data?.pagination?.total
  if (typeof total !== 'number' || !Number.isFinite(total)) {
    throw new Error(
      "Réponse /projets sans pagination.total exploitable : le comptage n'est pas fiable.",
    )
  }
  return total
}

export const projetsServices = {
  useGetAll: (page = 1, perPage = 20, filters: Record<string, string | undefined> = {}) => {
    // Nettoyer les filtres vides
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '' && v !== 'tous_disp' && v !== 'tous_statut' && v !== 'toutes_agences')
    )

    return useQuery({
      queryKey: ['projets', page, perPage, cleanFilters],
      queryFn: async () => {
        const { data } = await axiosInstance.get<PROJETS_API_RESPONSE_T>('/projets', {
          params: { page, per_page: perPage, ...cleanFilters }
        })
        return data
      },
      // Keep previous data when fetching the next page
      placeholderData: (previousData) => previousData,
    })
  },

  /**
   * RECHERCHE SERVEUR de micro-projets — alimente les comboboxes de sélection.
   *
   * Pourquoi un hook dédié plutôt que `useGetAll` : la base compte ~110 000
   * micro-projets. Charger « tous les projets » pour peupler un select est
   * exclu (≈900 Ko pour 500 lignes seulement). Le paramètre `search` filtre
   * réellement côté serveur (vérifié en live : « restaurant » → 5 470
   * résultats au lieu de 110 000), alors que `code` et `intitule` sont
   * IGNORÉS par l'API : on ne passe donc que `search`.
   *
   * `per_page` volontairement modeste (25) : une combobox n'affiche jamais
   * plus. `total` est renvoyé pour permettre d'indiquer à l'utilisateur qu'il
   * reste des résultats non listés et qu'il doit affiner sa saisie.
   *
   * Requête ACTIVE même sans terme de recherche : `?search=` vide renvoie la
   * première page (25 lignes), ce qui amorce la liste dès l'ouverture de la
   * combobox au lieu d'un vide décourageant. Le paramètre `enabled` reste là
   * pour couper la requête tant que la combobox n'est pas ouverte.
   *
   * ⚠️ L'appelant est responsable du DÉBOUNCE (~300 ms) sur `term` : la clé de
   * cache change à chaque frappe.
   */
  useSearch: (term: string, enabled = true) => {
    const search = term.trim()

    return useQuery({
      queryKey: ['projets', 'search', search],
      queryFn: async (): Promise<PROJETS_SEARCH_PAGE_T> => {
        const { data } = await axiosInstance.get<PROJETS_API_RESPONSE_T>('/projets', {
          params: { search, per_page: PROJETS_SEARCH_PER_PAGE },
        })
        return { rows: data.data, total: data.pagination.total }
      },
      enabled,
      // Évite le clignotement de la liste entre deux frappes débouncées.
      placeholderData: keepPreviousData,
    })
  },

  /**
   * COMPTAGE EXACT d'une combinaison de filtres, sans charger une seule ligne.
   *
   * Pourquoi ce hook existe : l'API n'expose AUCUN endpoint d'agrégation par
   * dispositif, secteur, stade ou type de portage. Le seul moyen honnête
   * d'obtenir ces répartitions est d'interroger `/projets?<filtre>&per_page=1`
   * et de ne lire que `pagination.total` — un comptage SQL côté serveur, rendu
   * pour ≈ 150 octets quand le filtre ne ramène rien et ≈ 2,1 Ko dès qu'une
   * ligne correspond (cf. `PROJETS_COUNT_PER_PAGE`). C'est un chiffre exact,
   * pas une estimation.
   *
   * ⚠️ Renvoie un NOMBRE, jamais les lignes : ce hook ne doit jamais servir à
   * afficher des micro-projets (voir `useGetAll` / `useSearch` pour cela).
   */
  useCount: (filtres: PROJETS_FILTRES_T = {}, enabled = true) => {
    const clean = nettoyerFiltres(filtres)
    return useQuery({
      queryKey: cleComptage(clean),
      queryFn: () => compter(clean),
      staleTime: PROJETS_COUNT_STALE_TIME,
      enabled,
    })
  },

  /**
   * COMPTAGE PARALLÈLE d'une dimension entière : une requête par valeur.
   *
   * ── Coût, assumé et MESURÉ en live le 30/08/2026 ──
   * Une requête HTTP `?<filtre>&per_page=1` PAR VALEUR de la dimension. Le poids
   * d'une réponse dépend du RÉSULTAT, pas du filtre :
   *   • ≈ 150 octets quand le comptage vaut zéro (`{"data":[],…}`) ;
   *   • ≈ 2,1 Ko dès qu'une ligne correspond — `per_page=1` renvoie une ligne
   *     de micro-projet complète avec ses 9 relations imbriquées.
   * Le navigateur sérialise ces requêtes par paquets de ~6 sur une même
   * origine ; 20 requêtes parallèles vers cet endpoint ont été chronométrées à
   * 2,45 s.
   *
   * État actuel du catalogue, dimension par dimension :
   *   • `par_stade`      : 3 requêtes ≈ 6,3 Ko ;
   *   • `par_type`       : 2 requêtes ≈ 4,2 Ko ;
   *   • `par_dispositif` : ~4 requêtes, aujourd'hui ≈ 150 octets chacune
   *     (`dispositif_id` est nul en base, tous les comptages valent 0) ;
   *   • `par_secteur`    : 49 requêtes ≈ 7,4 Ko aujourd'hui (comptages à zéro),
   *     mais ≈ 103 Ko et ~5 s le jour où `secteur_id` sera réellement saisi.
   *     C'est le point de vigilance de ce hook : le coût AUGMENTERA avec la
   *     qualité des données, il ne diminuera pas.
   *
   * ── Pourquoi ce coût est le bon arbitrage ──
   * L'alternative serait de charger les micro-projets pour les agréger côté
   * client : 110 000 lignes, ~200 Mo. Exclu. Et aucune agrégation serveur
   * n'existe sur ces dimensions (`/dashboard/*` ne couvre que statut, agence,
   * secteur d'emploi et entreprises). Le comptage parallèle est donc la seule
   * façon EXACTE de produire ces répartitions.
   *
   * ── Ce que ce hook ne fait pas ──
   * Aucun tri, aucun filtrage des lignes à zéro : il renvoie les valeurs dans
   * l'ordre des buckets fournis. La mise en forme appartient au moteur de
   * rapport, qui seul connaît la mesure principale.
   *
   * `buckets` vide ⇒ aucune requête émise (`useQueries` sur un tableau vide).
   */
  useCounts: (
    buckets: COUNT_BUCKET_T[],
    filtresTransverses: PROJETS_FILTRES_T = {},
  ): COUNTS_RESULT_T => {
    const resultats = useQueries({
      queries: buckets.map((bucket) => {
        // Les filtres du bucket l'emportent : si la dimension comptée est le
        // guichet, c'est bien le `dispositif_id` du bucket qui doit s'appliquer.
        const clean = nettoyerFiltres({ ...filtresTransverses, ...bucket.filtres })
        return {
          queryKey: cleComptage(clean),
          queryFn: () => compter(clean),
          staleTime: PROJETS_COUNT_STALE_TIME,
        }
      }),
    })

    // Projection directe, sans `useMemo` : au plus quelques dizaines d'entrées,
    // et `resultats` change d'identité à chaque rendu de toute façon — mémoïser
    // ici ne ferait qu'ajouter un tableau de dépendances faux à maintenir.
    const rows = buckets.map((bucket, i) => ({
      cle: bucket.cle,
      label: bucket.label,
      n: resultats[i]?.data ?? 0,
    }))

    return {
      rows,
      // `isLoading` = au moins un comptage encore en premier chargement ; on
      // n'affiche pas une répartition partielle, elle serait trompeuse.
      isLoading: resultats.some((r) => r.isLoading),
      isError: resultats.some((r) => r.isError),
    }
  },
}
