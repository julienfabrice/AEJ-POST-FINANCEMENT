import { ProcedureGuichetHeader } from './UI/ProcedureGuichetHeader'
import { ProcedureGuichetList } from './components/ProcedureGuichetList'
import { useProcedureGuichet } from './hooks/useProcedureGuichet'

export function ProcedureGuichetPage() {
  const {
    searchQuery,
    setSearchQuery,
    handleAddGuichet,
    handleEditGuichet,
    handleDeleteClick,
    modalNode,
  } = useProcedureGuichet()

  return (
    <div className="flex flex-col gap-6">
      {modalNode}
      <ProcedureGuichetHeader 
        onAdd={handleAddGuichet} 
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />
      <ProcedureGuichetList 
        searchQuery={searchQuery} 
        onEdit={handleEditGuichet} 
        onDelete={handleDeleteClick}
      />
    </div>
  )
}
