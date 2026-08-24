import { guichetServices } from '@/services/guichets.services'
import { ProcedureGuichetCard } from '../UI/ProcedureGuichetCard'
import type { GUICHET_T } from '@/types'

interface ProcedureGuichetListProps {
  searchQuery?: string
  onEdit?: (guichet: GUICHET_T) => void
  onDelete?: (guichet: GUICHET_T) => void
}

export function ProcedureGuichetList({ searchQuery = '', onEdit, onDelete }: ProcedureGuichetListProps) {
  const { data: guichets, isLoading } = guichetServices.useGetAll()

  if (isLoading) {
    return <div>Chargement...</div>
  }

  const filteredGuichets = guichets?.filter(g => {
    const query = searchQuery.toLowerCase()
    return (
      g.libelle.toLowerCase().includes(query) ||
      g.code.toLowerCase().includes(query) ||
      (g.description && g.description.toLowerCase().includes(query))
    )
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
      {filteredGuichets?.map((g) => (
        <ProcedureGuichetCard 
          key={g.id} 
          guichet={g} 
          onEdit={() => onEdit?.(g)} 
          onDelete={() => onDelete?.(g)} 
        />
      ))}
    </div>
  )
}
