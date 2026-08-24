import { useState } from 'react'
import { ProcedureGuichetModal } from '../components/ProcedureGuichetModal'
import { guichetServices } from '@/services/guichets.services'
import type { GUICHET_T } from '@/types'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'

export function useProcedureGuichet() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [guichetToEdit, setGuichetToEdit] = useState<GUICHET_T | null>(null)
  
  const [guichetToDelete, setGuichetToDelete] = useState<GUICHET_T | null>(null)

  const { mutate: deleteGuichet } = guichetServices.useDelete()

  const handleAddGuichet = () => {
    setGuichetToEdit(null)
    setIsModalOpen(true)
  }

  const handleEditGuichet = (guichet: GUICHET_T) => {
    setGuichetToEdit(guichet)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (guichet: GUICHET_T) => {
    setGuichetToDelete(guichet)
  }

  const confirmDelete = () => {
    if (guichetToDelete) {
      deleteGuichet(guichetToDelete.id, {
        onSuccess: () => setGuichetToDelete(null)
      })
    }
  }

  const modalNode = (
    <>
      <ProcedureGuichetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        guichetToEdit={guichetToEdit}
      />
      <DeleteConfirmModal 
        open={!!guichetToDelete}
        onOpenChange={(open) => !open && setGuichetToDelete(null)}
        itemLabel={guichetToDelete?.libelle}
        onConfirm={confirmDelete}
      />
    </>
  )

  return {
    searchQuery,
    setSearchQuery,
    handleAddGuichet,
    handleEditGuichet,
    handleDeleteClick,
    modalNode,
  }
}
