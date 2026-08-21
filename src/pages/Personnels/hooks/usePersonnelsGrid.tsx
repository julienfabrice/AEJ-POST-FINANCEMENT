import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { personnelsServices } from '@/services/personnels.services'
import { PrimaryTextCellRenderer } from '@/pages/Referentiels/components/PrimaryTextCellRenderer'
import { BadgeCellRenderer } from '@/pages/Referentiels/components/BadgeCellRenderer'
import { StatutActifCellRenderer } from '@/pages/Unites/components/StatutActifCellRenderer'
import type { PersonnelsFilterState } from '../components/PersonnelsFilters'

import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { toast } from 'sonner'

export function usePersonnelsGrid(filters: PersonnelsFilterState, onEdit: (data: any) => void) {
  const { data: fetchedData = [], isLoading, isError, error } = personnelsServices.useGetAll()
  const { mutate: deletePersonnel } = personnelsServices.useDelete()

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'nom', headerName: 'Nom & Prénom', flex: 1, minWidth: 200, valueGetter: p => `${p.data.nom} ${p.data.prenom}`, cellRenderer: PrimaryTextCellRenderer },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
    { field: 'telephone', headerName: 'Téléphone', width: 150 },
    { field: 'role.libelle', headerName: 'Rôle', width: 280, valueGetter: p => p.data.role?.libelle || '—', cellRenderer: BadgeCellRenderer },
    { field: 'fonction.nom', headerName: 'Fonction', width: 220, valueGetter: p => p.data.fonction?.nom || '—', cellRenderer: BadgeCellRenderer },
    { field: 'is_active', headerName: 'Statut', width: 110, cellRenderer: StatutActifCellRenderer },
    {
      headerName: 'Actions',
      width: 120,
      minWidth: 120,
      sortable: false,
      filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: {
        onEdit: (data: any) => onEdit(data),
        onDelete: (id: number) => deletePersonnel(id, {
          onSuccess: () => toast.success("Personnel supprimé avec succès."),
          onError: (err) => {
            console.error(err)
            toast.error("Erreur lors de la suppression du personnel.")
          }
        }),
      },
    },
  ], [onEdit, deletePersonnel])

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

  const availableRoles = useMemo(() => {
    const map = new Map<number, string>()
    fetchedData.forEach(p => {
      if (p.role) map.set(p.role.id, p.role.libelle)
    })
    return Array.from(map.entries()).map(([id, libelle]) => ({ id, libelle }))
  }, [fetchedData])

  const availableFonctions = useMemo(() => {
    const map = new Map<number, string>()
    fetchedData.forEach(p => {
      if (p.fonction) map.set(p.fonction.id, p.fonction.nom)
    })
    return Array.from(map.entries()).map(([id, nom]) => ({ id, nom }))
  }, [fetchedData])

  return { columnDefs, data: filteredData, isLoading, isError, error, availableRoles, availableFonctions }
}
