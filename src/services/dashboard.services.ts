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
        const { data } = await axiosInstance.get<{ data: { region: string; count: number }[] }>('/dashboard/entreprises/region')
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
