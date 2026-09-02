import { dispositifServices } from '@/services/dispositifs.services'
import { DispositifCard } from '../UI/DispositifCard'
import { DispositifListSkeleton } from './DispositifListSkeleton'
import type { DISPOSITIF_T } from '@/types'

interface DispositifListProps {
  searchQuery?: string
  onEdit?: (dispositif: DISPOSITIF_T) => void
  onDelete?: (dispositif: DISPOSITIF_T) => void
  onView?: (dispositif: DISPOSITIF_T) => void
}

export function DispositifList({ searchQuery = '', onEdit, onDelete, onView }: DispositifListProps) {
  const { data: dispositifs, isLoading } = dispositifServices.useGetAll()

  if (isLoading) {
    return <DispositifListSkeleton />
  }

  const filteredDispositifs = dispositifs?.filter((g: DISPOSITIF_T) => {
    const query = searchQuery.toLowerCase()
    return (
      g.intitule.toLowerCase().includes(query) ||
      g.code.toLowerCase().includes(query) ||
      (g.workflow_version?.name && g.workflow_version?.name.toLowerCase().includes(query))
    )
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
      {filteredDispositifs?.map((g: DISPOSITIF_T) => (
        <DispositifCard 
          key={g.id} 
          dispositif={g} 
          onEdit={() => onEdit?.(g)} 
          onDelete={() => onDelete?.(g)} 
          onView={() => onView?.(g)}
        />
      ))}
    </div>
  )
}
