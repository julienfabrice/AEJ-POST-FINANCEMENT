import { useState, useMemo, useCallback } from 'react'
import {
  BUDGET_FILTER_KEYS,
  type BudgetFiltersState,
} from '@/constants/budgets.filters'
import type { BUDGET_T } from '@/types'

export interface UseBudgetsFiltersOptions {
  budgets?: BUDGET_T[]
  organismes?: Array<{ id: number; nom?: string | null; sigle?: string | null }>
  initialFilters?: BudgetFiltersState
}

export function useBudgetsFilters(options: UseBudgetsFiltersOptions = {}) {
  const { budgets = [], organismes = [], initialFilters = {} } = options

  const [filters, setFilters] = useState<BudgetFiltersState>(initialFilters)

  const resetFilters = useCallback(() => {
    setFilters({})
  }, [])

  const setFilter = useCallback(
    <K extends keyof BudgetFiltersState>(key: K, value: BudgetFiltersState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value || undefined,
      }))
    },
    [],
  )

  const organismeById = useMemo(() => {
    return new Map(organismes.map((o) => [o.id, o]))
  }, [organismes])

  const activeCount = useMemo(() => {
    return BUDGET_FILTER_KEYS.filter((key) => Boolean(filters[key])).length
  }, [filters])

  const hasFilters = useMemo(() => {
    return Boolean(filters.search) || activeCount > 0
  }, [filters.search, activeCount])

  const filterBudgets = useCallback(
    (items: BUDGET_T[]) => {
      return items.filter((b) => {
        // 1. Statut
        if (filters.statut && b.statut !== filters.statut) return false

        // 2. Signature convention
        if (
          filters.signature_convention &&
          b.signature_convention !== filters.signature_convention
        ) {
          return false
        }

        // 3. Déblocage
        if (filters.deblocage !== undefined && filters.deblocage !== '') {
          const isDebloque = filters.deblocage === 'true'
          if (Boolean(b.deblocage) !== isDebloque) return false
        }

        // 4. Réception acte de crédit
        if (
          filters.reception_acte_credit &&
          b.reception_acte_credit !== filters.reception_acte_credit
        ) {
          return false
        }

        // 5. Organisme / Partenaire
        if (filters.organisme_id) {
          if (String(b.micro_projet?.organisme_id) !== String(filters.organisme_id)) {
            return false
          }
        }

        // 6. Guichet
        if (filters.guichet_id) {
          if (String(b.micro_projet?.guichet_id) !== String(filters.guichet_id)) {
            return false
          }
        }

        // 7. Tranche de montant
        if (filters.tranche_montant) {
          const montant = Number(b.montant_accorde) || 0
          if (filters.tranche_montant === 'less_1m' && montant >= 1_000_000) return false
          if (
            filters.tranche_montant === '1m_5m' &&
            (montant < 1_000_000 || montant > 5_000_000)
          ) {
            return false
          }
          if (
            filters.tranche_montant === '5m_10m' &&
            (montant < 5_000_000 || montant > 10_000_000)
          ) {
            return false
          }
          if (filters.tranche_montant === 'more_10m' && montant <= 10_000_000) return false
        }

        // 8. Stade du projet
        if (filters.stade_projet && b.micro_projet?.stade_projet !== filters.stade_projet) {
          return false
        }

        // 9. Type de projet
        if (filters.type_projet && b.micro_projet?.type_projet !== filters.type_projet) {
          return false
        }

        // 10. Secteur d'activité
        if (filters.secteuractivite_id) {
          const sId = b.micro_projet?.secteur_id ?? b.micro_projet?.promoteur?.secteuractivite_id
          if (String(sId) !== String(filters.secteuractivite_id)) {
            return false
          }
        }

        // 11. Agence régionale
        if (filters.agenceregionale_id) {
          const aId = b.micro_projet?.agence_id ?? b.micro_projet?.promoteur?.agenceregionale_id
          if (String(aId) !== String(filters.agenceregionale_id)) {
            return false
          }
        }

        // 12. Recherche texte
        if (filters.search && filters.search.trim()) {
          const q = filters.search.toLowerCase().trim()
          const matchCode = b.micro_projet?.code?.toLowerCase().includes(q)
          const matchProjet = b.micro_projet?.intitule?.toLowerCase().includes(q)
          const matchIntitule = b.intitule?.toLowerCase().includes(q)
          const matchSource = b.source?.toLowerCase().includes(q)
          const matchPromoteur =
            `${b.micro_projet?.promoteur?.nom ?? ''} ${b.micro_projet?.promoteur?.prenom ?? ''}`
              .toLowerCase()
              .includes(q)
          const org = b.micro_projet?.organisme_id
            ? organismeById.get(b.micro_projet.organisme_id)
            : null
          const matchOrg = (org?.sigle ?? org?.nom ?? '').toLowerCase().includes(q)

          if (
            !matchCode &&
            !matchProjet &&
            !matchIntitule &&
            !matchSource &&
            !matchPromoteur &&
            !matchOrg
          ) {
            return false
          }
        }

        return true
      })
    },
    [filters, organismeById],
  )

  const filteredBudgets = useMemo(() => {
    return filterBudgets(budgets)
  }, [filterBudgets, budgets])

  return {
    filters,
    setFilters,
    setFilter,
    resetFilters,
    activeCount,
    hasFilters,
    filterBudgets,
    filteredBudgets,
  }
}
