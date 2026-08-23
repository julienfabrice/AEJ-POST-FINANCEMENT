import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import type { PERSONNEL_T } from '@/types/personnels.types'
import type { PersonnelsFilterState } from '../components/PersonnelsFilters'

export function usePersonnelsFilters(fetchedData: PERSONNEL_T[]) {
  const [filters, setFilters] = useState<PersonnelsFilterState>({ search: '' })

  const filteredData = useMemo(() => {
    let result = fetchedData

    if (filters.is_active !== undefined) {
      result = result.filter(r => String(r.is_active) === filters.is_active)
    }
    if (filters.role_id !== undefined) {
      result = result.filter(r => String(r.role_id) === filters.role_id)
    }
    if (filters.fonction_id !== undefined) {
      result = result.filter(r => String(r.fonction_id) === filters.fonction_id)
    }

    if (filters.search && filters.search.trim()) {
      const fuse = new Fuse(result, { keys: ['nom', 'prenom', 'email', 'telephone'], threshold: 0.3, ignoreLocation: true })
      result = fuse.search(filters.search).map((r) => r.item)
    }

    return result
  }, [fetchedData, filters])

  return { filters, setFilters, filteredData }
}
