import { DispositifHeader } from './UI/DispositifHeader'
import { DispositifList } from './components/DispositifList'
import { useDispositif } from './hooks/useDispositif'

export function DispositifPage() {
  const {
    searchQuery,
    setSearchQuery,
    handleAddDispositif,
    handleEditDispositif,
    handleDeleteClick,
    modalNode,
  } = useDispositif()

  return (
    <div className="flex flex-col gap-6">
      {modalNode}
      <DispositifHeader 
        onAdd={handleAddDispositif} 
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />
      <DispositifList 
        searchQuery={searchQuery} 
        onEdit={handleEditDispositif} 
        onDelete={handleDeleteClick}
      />
    </div>
  )
}
