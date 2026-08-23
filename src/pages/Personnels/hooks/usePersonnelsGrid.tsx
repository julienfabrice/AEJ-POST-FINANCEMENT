import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import { personnelsServices } from '@/services/personnels.services'
import { PrimaryTextCellRenderer } from '@/pages/Referentiels/components/PrimaryTextCellRenderer'
import { BadgeCellRenderer } from '@/pages/Referentiels/components/BadgeCellRenderer'
import { StatutActifCellRenderer } from '@/pages/Unites/components/StatutActifCellRenderer'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { toast } from 'sonner'

export function usePersonnelsGrid(
  onEdit: (data: any) => void,
  onChangePassword: (data: any) => void
) {
  const { data: fetchedData = [], isLoading, isError, error } = personnelsServices.useGetAll()
  const { mutate: deletePersonnel } = personnelsServices.useDelete()

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'nom', headerName: 'Nom & Prénom', flex: 1, minWidth: 200, pinned: 'left', valueGetter: p => `${p.data.nom} ${p.data.prenom}`, cellRenderer: PrimaryTextCellRenderer },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
    { field: 'telephone', headerName: 'Téléphone', width: 150 },
    { field: 'role.libelle', headerName: 'Rôle', width: 280, valueGetter: p => p.data.role?.libelle || '—', cellRenderer: BadgeCellRenderer },
    { field: 'fonction.nom', headerName: 'Fonction', width: 220, valueGetter: p => p.data.fonction?.nom || '—', cellRenderer: BadgeCellRenderer },
    { field: 'is_active', headerName: 'Statut', width: 110, cellRenderer: StatutActifCellRenderer },
    {
      headerName: 'Actions',
      width: 140, // increased slightly to accommodate the 3rd button
      minWidth: 140,
      sortable: false,
      filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: {
        onEdit: (data: any) => onEdit(data),
        onChangePassword: (data: any) => onChangePassword(data),
        onDelete: (id: number) => deletePersonnel(id, {
          onSuccess: () => toast.success("Personnel supprimé avec succès."),
          onError: (err) => {
            console.error(err)
            toast.error("Erreur lors de la suppression du personnel.")
          }
        }),
      },
    },
  ], [onEdit, onChangePassword, deletePersonnel])

  const availableRoles = useMemo(() => {
    const map = new Map<number, string>()
    fetchedData.forEach(({role}) => {
      if (role) map.set(role.id, role.libelle)
    })
    return Array.from(map.entries()).map(([id, libelle]) => ({ id, libelle }))
  }, [fetchedData])

  const availableFonctions = useMemo(() => {
    const map = new Map<number, string>()
    fetchedData.forEach(({fonction}) => {
      if (fonction) map.set(fonction.id, fonction.nom)
    })
    return Array.from(map.entries()).map(([id, nom]) => ({ id, nom }))
  }, [fetchedData])

  return { columnDefs, fetchedData, isLoading, isError, error, availableRoles, availableFonctions }
}
