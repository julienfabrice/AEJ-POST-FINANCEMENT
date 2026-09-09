import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type {
  DashboardAgencesKpis,
  DashboardProjetStatut,
  DashboardProjetAgence,
  DashboardFinancementAgence,
  DashboardClassementItem,
  DashboardAlerte,
  DashboardPartenairesKpis,
  DashboardPortefeuilleItem,
  DashboardEtatFinancement,
  DashboardEvolutionRemboursement,
  DashboardEntreprisesKpis,
  DashboardEmploisSecteur,
  DashboardTypeEmploi,
  DashboardTopRecruteuse,
  DashboardSecteur,
} from '@/types'
import type {
  CLASSEMENT_AGENCE_T,
  CLASSEMENT_ENTREPRISE_T,
  DASHBOARD_AGENCES_ALERTES_T,
  DASHBOARD_AGENCES_KPIS_T,
  DASHBOARD_ENTREPRISES_ALERTES_T,
  DASHBOARD_ENTREPRISES_KPIS_T,
  DASHBOARD_PARTENAIRES_ALERTES_T,
  DASHBOARD_PARTENAIRES_KPIS_T,
  DASHBOARD_RESPONSE_T,
  EMPLOIS_SECTEUR_T,
  ENTREPRISES_REGION_T,
  ENTREPRISES_TYPE_T,
  EVOLUTION_REMBOURSEMENT_T,
  FINANCEMENT_AGENCE_T,
  PROJETS_PAR_AGENCE_T,
  PROJETS_PAR_STATUT_T,
  TOP_RECRUTEUSE_T,
  TYPES_EMPLOIS_T,
} from '@/types/dashboard.types'

/**
 * SERVICES D'AGRÉGATION `/dashboard/*`
 * ====================================
 * ⚠️ CE FICHIER PORTE DEUX JEUX DE SERVICES, issus de la fusion de `amadou`
 * dans `younouss` (PR #37). Les deux interrogent les mêmes endpoints mais
 * servent des écrans différents, et les DEUX sont utilisés :
 *
 *  • `dashboardAgencesServices` / `dashboardPartenairesServices` /
 *    `dashboardEntreprisesServices` — consommés par les tableaux de bord
 *    (`pages/Dashboard/{Admin,Agent,Partner}Dashboard/hooks/*`).
 *  • `dashboardServices` (+ `dashboardKeys`) — consommé par le moteur de
 *    rapports (`pages/Rapports/hooks/useRapportData.ts`). Il se distingue par
 *    un `staleTime` explicite, des clés de cache paramétrables et le passage
 *    des seuls filtres réellement honorés par l'API.
 *
 * Aucune collision de noms entre les deux (vérifié à la fusion). Les unifier
 * demanderait de réécrire les six hooks de tableau de bord ET le moteur de
 * rapports : hors périmètre d'une résolution de conflit.
 */


export const dashboardAgencesServices = {
  useKpis: () =>
    useQuery({
      queryKey: ['dashboard', 'agences', 'kpis'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardAgencesKpis }>('/dashboard/agences/kpis')
        return data.data
      },
    }),

  useProjetsStatut: () =>
    useQuery({
      queryKey: ['dashboard', 'agences', 'projets-statut'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardProjetStatut[] }>('/dashboard/agences/projets-statut')
        return data.data
      },
    }),

  useProjetsAgence: () =>
    useQuery({
      queryKey: ['dashboard', 'agences', 'projets-agence'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardProjetAgence[] }>('/dashboard/agences/projets-agence')
        return data.data
      },
    }),

  useFinancementAgence: () =>
    useQuery({
      queryKey: ['dashboard', 'agences', 'financement-agence'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardFinancementAgence[] }>('/dashboard/agences/financement-agence')
        return data.data
      },
    }),

  useClassement: () =>
    useQuery({
      queryKey: ['dashboard', 'agences', 'classement'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardClassementItem[] }>('/dashboard/agences/classement')
        return data.data
      },
    }),

  useAlertes: () =>
    useQuery({
      queryKey: ['dashboard', 'agences', 'alertes'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardAlerte[] }>('/dashboard/agences/alertes')
        return data.data
      },
    }),
}

export const dashboardPartenairesServices = {
  useKpis: () =>
    useQuery({
      queryKey: ['dashboard', 'partenaires', 'kpis'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardPartenairesKpis }>('/dashboard/partenaires/kpis')
        return data.data
      },
    }),

  usePortefeuille: () =>
    useQuery({
      queryKey: ['dashboard', 'partenaires', 'portefeuille'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardPortefeuilleItem[] }>('/dashboard/partenaires/portefeuille-partenaire')
        return data.data
      },
    }),

  useAccordeVsDecaisse: () =>
    useQuery({
      queryKey: ['dashboard', 'partenaires', 'accorde-vs-decaisse'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: unknown }>('/dashboard/partenaires/accorde-vs-decaisse')
        return data.data
      },
    }),

  useEtatFinancements: () =>
    useQuery({
      queryKey: ['dashboard', 'partenaires', 'etat-financements'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardEtatFinancement[] }>('/dashboard/partenaires/etat-financements')
        return data.data
      },
    }),

  useEvolutionRemboursements: () =>
    useQuery({
      queryKey: ['dashboard', 'partenaires', 'evolution-remboursements'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardEvolutionRemboursement[] }>('/dashboard/partenaires/evolution-remboursements')
        return data.data
      },
    }),

  useClassement: () =>
    useQuery({
      queryKey: ['dashboard', 'partenaires', 'classement'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardClassementItem[] }>('/dashboard/partenaires/classement')
        return data.data
      },
    }),

  useAlertes: () =>
    useQuery({
      queryKey: ['dashboard', 'partenaires', 'alertes'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardAlerte[] }>('/dashboard/partenaires/alertes')
        return data.data
      },
    }),
}

export const dashboardEntreprisesServices = {
  useKpis: () =>
    useQuery({
      queryKey: ['dashboard', 'entreprises', 'kpis'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardEntreprisesKpis }>('/dashboard/entreprises/kpis')
        return data.data
      },
    }),

  useRegion: () =>
    useQuery({
      queryKey: ['dashboard', 'entreprises', 'region'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: { region: string | null; nombre_entreprises: number }[] }>('/dashboard/entreprises/region')
        return data.data
      },
    }),

  useEmploisSecteur: () =>
    useQuery({
      queryKey: ['dashboard', 'entreprises', 'emplois-secteur'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardEmploisSecteur[] }>('/dashboard/entreprises/emplois-secteur')
        return data.data
      },
    }),

  useTypesEmplois: () =>
    useQuery({
      queryKey: ['dashboard', 'entreprises', 'types-emplois'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardTypeEmploi[] }>('/dashboard/entreprises/types-emplois')
        return data.data
      },
    }),

  useTopRecruteuses: () =>
    useQuery({
      queryKey: ['dashboard', 'entreprises', 'top-recruteuses'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardTopRecruteuse[] }>('/dashboard/entreprises/top-recruteuses')
        return data.data
      },
    }),

  useSecteur: () =>
    useQuery({
      queryKey: ['dashboard', 'entreprises', 'secteur'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardSecteur[] }>('/dashboard/entreprises/secteur')
        return data.data
      },
    }),

  useClassement: () =>
    useQuery({
      queryKey: ['dashboard', 'entreprises', 'classement'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardClassementItem[] }>('/dashboard/entreprises/classement')
        return data.data
      },
    }),

  useAlertes: () =>
    useQuery({
      queryKey: ['dashboard', 'entreprises', 'alertes'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ data: DashboardAlerte[] }>('/dashboard/entreprises/alertes')
        return data.data
      },
    }),
}

/* ================================================================== *
 * Services du moteur de RAPPORTS (branche amadou)                    *
 * ================================================================== */

/**
 * SERVICES D'AGRÉGATION `/dashboard/*`
 * ====================================
 * Ce sont les SEULS endpoints d'agrégation qui existent : `/rapports` et
 * `/statistiques` répondent 404 (vérifié en live le 30/08/2026).
 *
 * ⚠️ `axiosInstance` porte déjà `baseURL = /api` : les chemins s'écrivent SANS
 * `/api` et SANS `/public`. Le préfixe `/public` ne sert qu'à l'exploration
 * manuelle en lecture anonyme, jamais dans le code applicatif.
 *
 * ⚠️ Enveloppe `{ data }` sans `message` → `DASHBOARD_RESPONSE_T`, pas
 * `API_RESPONSE_T` (cf. `src/types/dashboard.types.ts`).
 */

/**
 * 15 minutes. Ce sont des agrégats sur 110 000 lignes : ils ne bougent qu'au
 * rythme de la saisie terrain (quelques dossiers par jour), et chaque appel
 * coûte cher côté serveur. Un `staleTime` généreux évite de relancer 10 requêtes
 * d'agrégation à chaque va-et-vient entre deux types de rapport.
 */
const DASHBOARD_STALE_TIME = 15 * 60 * 1000

/**
 * Clés de cache : `['dashboard', <famille>, <endpoint>, <params>]`.
 * Les paramètres font partie de la clé — deux filtres différents sont deux
 * entrées de cache distinctes, et revenir au filtre précédent est instantané.
 * Le segment `params` vaut `{}` quand l'endpoint n'accepte aucun filtre, ce qui
 * garde la forme de clé homogène sur toute la famille.
 */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  agences: (endpoint: string, params: Record<string, string | number> = {}) =>
    ['dashboard', 'agences', endpoint, params] as const,
  partenaires: (endpoint: string, params: Record<string, string | number> = {}) =>
    ['dashboard', 'partenaires', endpoint, params] as const,
  entreprises: (endpoint: string, params: Record<string, string | number> = {}) =>
    ['dashboard', 'entreprises', endpoint, params] as const,
}

/**
 * Retire les paramètres vides AVANT l'envoi. Un `?statut=` vide n'est pas
 * neutre pour tous les backends Laravel, et surtout il polluerait la clé de
 * cache : `{ statut: '' }` et `{}` doivent désigner la même requête.
 */
const nettoyerParams = (params: object): Record<string, string | number> =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== '',
    ),
  ) as Record<string, string | number>

/** Lecture d'un agrégat en LISTE. `?? []` : jamais `undefined` chez l'appelant. */
const lireListe = async <T>(
  chemin: string,
  params: Record<string, string | number> = {},
): Promise<T[]> => {
  const { data } = await axiosInstance.get<DASHBOARD_RESPONSE_T<T[]>>(chemin, { params })
  return data?.data ?? []
}

/** Lecture d'un agrégat OBJET (KPI, alertes). */
const lireObjet = async <T>(
  chemin: string,
  params: Record<string, string | number> = {},
): Promise<T> => {
  const { data } = await axiosInstance.get<DASHBOARD_RESPONSE_T<T>>(chemin, { params })
  return data.data
}

/**
 * Filtres RÉELLEMENT honorés par `GET /dashboard/agences/projets-statut`,
 * testés un par un le 30/08/2026 :
 *   - `statut=EN_SUIVI` → `[{statut:"EN_SUIVI",count:11114}]`   ✅ HONORÉ
 *   - `agence_id=1`     → `[]`                                   ✅ HONORÉ
 *   - `dispositif_id=1` → réponse identique à la baseline        ⛔ IGNORÉ
 *   - `date_debut` / `date_fin` → identiques à la baseline       ⛔ IGNORÉ
 *
 * Ce type n'expose QUE les deux paramètres honorés : on ne transmet jamais un
 * paramètre que l'endpoint ignore, sous peine de faire croire à l'utilisateur
 * que son filtre s'applique. Un filtre non applicable doit être visiblement
 * désactivé dans l'écran, pas silencieusement avalé par le réseau.
 */
export interface PROJETS_STATUT_PARAMS_T {
  statut?: string
  agence_id?: number | string
}

export const dashboardServices = {
  /* ---------------------------------------------------------------- *
   * Famille AGENCES                                                   *
   * ---------------------------------------------------------------- */

  /** `GET /dashboard/agences/kpis` — clés accentuées, cf. le type. */
  useAgencesKpis: (enabled = true) =>
    useQuery({
      queryKey: dashboardKeys.agences('kpis'),
      queryFn: () => lireObjet<DASHBOARD_AGENCES_KPIS_T>('/dashboard/agences/kpis'),
      staleTime: DASHBOARD_STALE_TIME,
      enabled,
    }),

  /**
   * `GET /dashboard/agences/projets-statut` — LA source d'agrégation qui porte
   * réellement de la donnée aujourd'hui (14 statuts, 110 000 dossiers ventilés).
   * Seuls `statut` et `agence_id` sont transmis (cf. `PROJETS_STATUT_PARAMS_T`).
   */
  useProjetsParStatut: (params: PROJETS_STATUT_PARAMS_T = {}, enabled = true) => {
    const clean = nettoyerParams(params)
    return useQuery({
      queryKey: dashboardKeys.agences('projets-statut', clean),
      queryFn: () => lireListe<PROJETS_PAR_STATUT_T>('/dashboard/agences/projets-statut', clean),
      staleTime: DASHBOARD_STALE_TIME,
      enabled,
    })
  },

  /**
   * `GET /dashboard/agences/projets-agence` — nombre de dossiers par agence.
   * Renvoie `[]` aujourd'hui : `agence_id` est nul sur les 110 000 micro-projets.
   * AUCUN paramètre n'est transmis : la réponse étant vide, il est impossible de
   * vérifier en live qu'un filtre serait honoré, et on ne transmet pas un
   * paramètre dont on ne sait pas prouver l'effet. Le filtre « Région » est donc
   * appliqué CÔTÉ CLIENT sur les lignes renvoyées (33 lignes au maximum, coût nul).
   */
  useProjetsParAgence: (enabled = true) =>
    useQuery({
      queryKey: dashboardKeys.agences('projets-agence'),
      queryFn: () => lireListe<PROJETS_PAR_AGENCE_T>('/dashboard/agences/projets-agence'),
      staleTime: DASHBOARD_STALE_TIME,
      enabled,
    }),

  /**
   * `GET /dashboard/agences/financement-agence` — SEULE source capable de
   * fournir un MONTANT par agence/région. `/projets` ne sait sommer aucun
   * montant par dimension. Renvoie `[]` aujourd'hui → la colonne
   * « Montant engagé » reste masquée tant que cette liste est vide.
   */
  useFinancementParAgence: (enabled = true) =>
    useQuery({
      queryKey: dashboardKeys.agences('financement-agence'),
      queryFn: () => lireListe<FINANCEMENT_AGENCE_T>('/dashboard/agences/financement-agence'),
      staleTime: DASHBOARD_STALE_TIME,
      enabled,
    }),

  /** `GET /dashboard/agences/classement` — `[]` aujourd'hui (même cause). */
  useAgencesClassement: (enabled = true) =>
    useQuery({
      queryKey: dashboardKeys.agences('classement'),
      queryFn: () => lireListe<CLASSEMENT_AGENCE_T>('/dashboard/agences/classement'),
      staleTime: DASHBOARD_STALE_TIME,
      enabled,
    }),

  /** `GET /dashboard/agences/alertes` */
  useAgencesAlertes: (enabled = true) =>
    useQuery({
      queryKey: dashboardKeys.agences('alertes'),
      queryFn: () => lireObjet<DASHBOARD_AGENCES_ALERTES_T>('/dashboard/agences/alertes'),
      staleTime: DASHBOARD_STALE_TIME,
      enabled,
    }),

  /* ---------------------------------------------------------------- *
   * Famille PARTENAIRES                                               *
   * ---------------------------------------------------------------- *
   * Ne sont exposés ici que les endpoints dont la forme a pu être RELEVÉE en
   * live. `portefeuille-partenaire`, `accorde-vs-decaisse`, `etat-financements`
   * et `classement` répondent tous `{"data":[]}` : leur forme est inobservable,
   * aucun écran ne s'en sert pour l'instant, et déclarer un contrat inventé
   * pour eux serait exactement ce que la règle d'arbitrage interdit. Ils seront
   * ajoutés le jour où ils renverront de la donnée.
   */

  /** `GET /dashboard/partenaires/kpis` */
  usePartenairesKpis: (enabled = true) =>
    useQuery({
      queryKey: dashboardKeys.partenaires('kpis'),
      queryFn: () => lireObjet<DASHBOARD_PARTENAIRES_KPIS_T>('/dashboard/partenaires/kpis'),
      staleTime: DASHBOARD_STALE_TIME,
      enabled,
    }),

  /**
   * `GET /dashboard/partenaires/evolution-remboursements` — SEULE série
   * mensuelle réellement agrégée par l'API (`[{mois:"2025-01", …}]`).
   * La maquette affiche une « Tendance des soumissions par mois » : cette
   * mesure-là n'existe nulle part côté API (aucun regroupement mensuel des
   * micro-projets). L'écran doit donc afficher CETTE série et la nommer pour ce
   * qu'elle est. Arbitrage documenté dans `Rapports/constants.ts`.
   */
  useEvolutionRemboursements: (enabled = true) =>
    useQuery({
      queryKey: dashboardKeys.partenaires('evolution-remboursements'),
      queryFn: () =>
        lireListe<EVOLUTION_REMBOURSEMENT_T>('/dashboard/partenaires/evolution-remboursements'),
      staleTime: DASHBOARD_STALE_TIME,
      enabled,
    }),

  /** `GET /dashboard/partenaires/alertes` */
  usePartenairesAlertes: (enabled = true) =>
    useQuery({
      queryKey: dashboardKeys.partenaires('alertes'),
      queryFn: () => lireObjet<DASHBOARD_PARTENAIRES_ALERTES_T>('/dashboard/partenaires/alertes'),
      staleTime: DASHBOARD_STALE_TIME,
      enabled,
    }),

  /* ---------------------------------------------------------------- *
   * Famille ENTREPRISES                                               *
   * ---------------------------------------------------------------- */

  /** `GET /dashboard/entreprises/kpis` — clés SANS accent ici, cf. le type. */
  useEntreprisesKpis: (enabled = true) =>
    useQuery({
      queryKey: dashboardKeys.entreprises('kpis'),
      queryFn: () => lireObjet<DASHBOARD_ENTREPRISES_KPIS_T>('/dashboard/entreprises/kpis'),
      staleTime: DASHBOARD_STALE_TIME,
      enabled,
    }),

  /** `GET /dashboard/entreprises/emplois-secteur` */
  useEmploisParSecteur: (enabled = true) =>
    useQuery({
      queryKey: dashboardKeys.entreprises('emplois-secteur'),
      queryFn: () => lireListe<EMPLOIS_SECTEUR_T>('/dashboard/entreprises/emplois-secteur'),
      staleTime: DASHBOARD_STALE_TIME,
      enabled,
    }),

  /** `GET /dashboard/entreprises/types-emplois` (CDD, CDI, stage…). */
  useTypesEmplois: (enabled = true) =>
    useQuery({
      queryKey: dashboardKeys.entreprises('types-emplois'),
      queryFn: () => lireListe<TYPES_EMPLOIS_T>('/dashboard/entreprises/types-emplois'),
      staleTime: DASHBOARD_STALE_TIME,
      enabled,
    }),

  /** `GET /dashboard/entreprises/top-recruteuses` */
  useTopRecruteuses: (enabled = true) =>
    useQuery({
      queryKey: dashboardKeys.entreprises('top-recruteuses'),
      queryFn: () => lireListe<TOP_RECRUTEUSE_T>('/dashboard/entreprises/top-recruteuses'),
      staleTime: DASHBOARD_STALE_TIME,
      enabled,
    }),

  /** `GET /dashboard/entreprises/region` — `region` nullable (nul partout à ce jour). */
  useEntreprisesParRegion: (enabled = true) =>
    useQuery({
      queryKey: dashboardKeys.entreprises('region'),
      queryFn: () => lireListe<ENTREPRISES_REGION_T>('/dashboard/entreprises/region'),
      staleTime: DASHBOARD_STALE_TIME,
      enabled,
    }),

  /**
   * `GET /dashboard/entreprises/secteur` — ATTENTION : ventile par TYPE
   * JURIDIQUE (`type_entreprise`: SARL, SA…), pas par secteur d'activité,
   * malgré le nom de l'endpoint. Ne pas l'utiliser pour un rapport « secteur ».
   */
  useEntreprisesParType: (enabled = true) =>
    useQuery({
      queryKey: dashboardKeys.entreprises('secteur'),
      queryFn: () => lireListe<ENTREPRISES_TYPE_T>('/dashboard/entreprises/secteur'),
      staleTime: DASHBOARD_STALE_TIME,
      enabled,
    }),

  /** `GET /dashboard/entreprises/classement` */
  useEntreprisesClassement: (enabled = true) =>
    useQuery({
      queryKey: dashboardKeys.entreprises('classement'),
      queryFn: () => lireListe<CLASSEMENT_ENTREPRISE_T>('/dashboard/entreprises/classement'),
      staleTime: DASHBOARD_STALE_TIME,
      enabled,
    }),

  /** `GET /dashboard/entreprises/alertes` */
  useEntreprisesAlertes: (enabled = true) =>
    useQuery({
      queryKey: dashboardKeys.entreprises('alertes'),
      queryFn: () => lireObjet<DASHBOARD_ENTREPRISES_ALERTES_T>('/dashboard/entreprises/alertes'),
      staleTime: DASHBOARD_STALE_TIME,
      enabled,
    }),
}
