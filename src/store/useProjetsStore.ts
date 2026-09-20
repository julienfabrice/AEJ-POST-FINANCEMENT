import { create } from 'zustand'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

type ViewMode = 'kanban' | 'list'

export type PROJETS_SEARCH_T = {
  search?: string
  dispositif_id?: string
  statut?: string
  agence_id?: string
  guichet_id?: string
}

interface ProjetsState {
  pagination: {
    page: number
    perPage: number
  }
  viewMode: ViewMode
  filters: PROJETS_SEARCH_T
  projets: MICRO_PROJET_T[]
  selectedProjet: MICRO_PROJET_T | null
  joindrePlanModalProjet: MICRO_PROJET_T | null
  decaissementModalProjet: MICRO_PROJET_T | null
  validerModalProjet: MICRO_PROJET_T | null
  traiterModalProjet: MICRO_PROJET_T | null
  remboursementsModalProjet: MICRO_PROJET_T | null
  visiteSuiviModalProjet: MICRO_PROJET_T | null
  imputerAlertModalProjet: MICRO_PROJET_T | null

  // Actions
  setPagination: (pagination: Partial<{ page: number; perPage: number }>) => void
  setViewMode: (viewMode: ViewMode) => void
  setSelectedProjet: (projet: MICRO_PROJET_T | null) => void
  setJoindrePlanModalProjet: (projet: MICRO_PROJET_T | null) => void
  setDecaissementModalProjet: (projet: MICRO_PROJET_T | null) => void
  setValiderModalProjet: (projet: MICRO_PROJET_T | null) => void
  setTraiterModalProjet: (projet: MICRO_PROJET_T | null) => void
  setRemboursementsModalProjet: (projet: MICRO_PROJET_T | null) => void
  setVisiteSuiviModalProjet: (projet: MICRO_PROJET_T | null) => void
  setImputerAlertModalProjet: (projet: MICRO_PROJET_T | null) => void
  setProjets: (projets: MICRO_PROJET_T[]) => void
  setFilters: (filters: Partial<PROJETS_SEARCH_T>) => void
  resetFilters: () => void
}

export const useProjetsStore = create<ProjetsState>((set) => ({
  pagination: {
    page: 1,
    perPage: 20,
  },
  viewMode: 'list',
  filters: {},
  projets: [],
  selectedProjet: null,
  joindrePlanModalProjet: null,
  decaissementModalProjet: null,
  validerModalProjet: null,
  traiterModalProjet: null,
  remboursementsModalProjet: null,
  visiteSuiviModalProjet: null,
  imputerAlertModalProjet: null,
  setPagination: (newPagination) => set((state) => {
    // Si on modifie perPage, on force la page à 1
    const page = newPagination.perPage !== undefined ? 1 : (newPagination.page ?? state.pagination.page)
    const perPage = newPagination.perPage ?? state.pagination.perPage
    
    return {
      pagination: { page, perPage }
    }
  }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedProjet: (selectedProjet) => set({ selectedProjet }),
  setJoindrePlanModalProjet: (joindrePlanModalProjet) => set({ joindrePlanModalProjet }),
  setDecaissementModalProjet: (decaissementModalProjet) => set({ decaissementModalProjet }),
  setValiderModalProjet: (validerModalProjet) => set({ validerModalProjet }),
  setTraiterModalProjet: (traiterModalProjet) => set({ traiterModalProjet }),
  setRemboursementsModalProjet: (remboursementsModalProjet) => set({ remboursementsModalProjet }),
  setVisiteSuiviModalProjet: (visiteSuiviModalProjet) => set({ visiteSuiviModalProjet }),
  setImputerAlertModalProjet: (imputerAlertModalProjet) => set({ imputerAlertModalProjet }),
  setProjets: (projets) => set({ projets }),
  setFilters: (newFilters) => set((state) => ({ 
    filters: { ...state.filters, ...newFilters },
    pagination: { ...state.pagination, page: 1 } // Reset pagination on filter change
  })),
  resetFilters: () => set((state) => ({ filters: {}, pagination: { ...state.pagination, page: 1 } })),
}))
