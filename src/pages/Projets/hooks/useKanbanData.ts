import { useMemo } from 'react'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { PROJECT_STATUSES } from '@/constants/PROJECT_STATUSES'

export function useKanbanData(projets: MICRO_PROJET_T[]) {
  const columns = useMemo(() => {
    // Collect all dynamic keys from projects
    const existingKeys: string[] = PROJECT_STATUSES.map(s => s.key)
    const otherKeys = Array.from(new Set(projets.map(p => p.statut).filter(Boolean))).filter(k => !existingKeys.includes(k))
    
    // Create base statuses and append dynamic ones as gray columns
    const allStatuses = [
      ...PROJECT_STATUSES,
      ...otherKeys.map(k => ({ 
        key: k, 
        label: k.replace(/_/g, ' '), 
        color: 'bg-gray-100 text-gray-800'
      }))
    ]

    return allStatuses.map(status => {
      // API returns EN_REMBOURSEMENT or others. Use 'BROUILLON' as fallback if null/empty
      const items = projets.filter(p => (p.statut || 'BROUILLON') === status.key)
      
      // Hide columns that are empty if they are purely dynamic or terminal
      const isHiddenIfEmpty = !existingKeys.includes(status.key) || ['ANNULE', 'NON_APPROUVE', 'TERMINE'].includes(status.key)
      
      return {
        ...status,
        items,
        isHidden: isHiddenIfEmpty && items.length === 0
      }
    }).filter(col => !col.isHidden) // Filter out hidden columns
  }, [projets])

  return { columns }
}
