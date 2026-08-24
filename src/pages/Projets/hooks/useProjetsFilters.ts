import { useEffect, useState } from 'react'
import { useProjetsStore } from '@/store/useProjetsStore'

const SEARCH_DEBOUNCE_MS = 350

export function useProjetsFilters() {
  const { filters, setFilters, resetFilters } = useProjetsStore()
  
  // Local state pour le champ de recherche, avec debouncing
  const [term, setTerm] = useState(filters.search ?? '')

  useEffect(() => {
    setTerm(filters.search ?? '')
  }, [filters.search])

  useEffect(() => {
    const current = filters.search ?? ''
    if (term === current) return

    const timer = setTimeout(() => {
      setFilters({ search: term.trim() || undefined })
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [term, filters.search, setFilters])

  return {
    filters,
    setFilters,
    resetFilters,
    term,
    setTerm,
  }
}
