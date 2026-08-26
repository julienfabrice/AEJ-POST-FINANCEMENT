import { useState } from 'react'
import { DispositifModal } from '../components/DispositifModal'
import { DispositifDetailsDrawer } from '../components/DispositifDetailsDrawer'
import { dispositifServices } from '@/services/dispositifs.services'
import type { DISPOSITIF_T } from '@/types'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'

export function useDispositif() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dispositifToEdit, setDispositifToEdit] = useState<DISPOSITIF_T | null>(null)
  
  const [dispositifToDelete, setDispositifToDelete] = useState<DISPOSITIF_T | null>(null)
  const [dispositifToView, setDispositifToView] = useState<DISPOSITIF_T | null>(null)

  const { mutate: deleteDispositif } = dispositifServices.useDelete()

  const handleAddDispositif = () => {
    setDispositifToEdit(null)
    setIsModalOpen(true)
  }

  const handleEditDispositif = (dispositif: DISPOSITIF_T) => {
    setDispositifToEdit(dispositif)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (dispositif: DISPOSITIF_T) => {
    setDispositifToDelete(dispositif)
  }
  
  const handleViewDetails = (dispositif: DISPOSITIF_T) => {
    setDispositifToView(dispositif)
  }

  const confirmDelete = () => {
    if (dispositifToDelete) {
      deleteDispositif(dispositifToDelete.id, {
        onSuccess: () => setDispositifToDelete(null)
      })
    }
  }

  const modalNode = (
    <>
      <DispositifModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dispositifToEdit={dispositifToEdit}
      />
      <DispositifDetailsDrawer
        dispositif={dispositifToView}
        onClose={() => setDispositifToView(null)}
      />
      <DeleteConfirmModal 
        open={!!dispositifToDelete}
        onOpenChange={(open) => !open && setDispositifToDelete(null)}
        itemLabel={dispositifToDelete?.intitule}
        onConfirm={confirmDelete}
      />
    </>
  )

  return {
    searchQuery,
    setSearchQuery,
    handleAddDispositif,
    handleEditDispositif,
    handleDeleteClick,
    handleViewDetails,
    modalNode,
  }
}
