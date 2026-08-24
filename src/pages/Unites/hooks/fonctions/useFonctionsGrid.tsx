import { fonctionServices } from '@/services/fonctions.services'
import { serviceOrgServices } from '@/services/services-org.services'
import { useMemo, useState } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '@/pages/Referentiels/components/PrimaryTextCellRenderer'
import { BadgeCellRenderer } from '@/pages/Referentiels/components/BadgeCellRenderer'
import { FonctionFormModal } from '../../components/FonctionFormModal'
import type { FONCTION_T } from '@/types'

export function useFonctionsGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = fonctionServices.useGetAll()
  const { data: services = [] } = serviceOrgServices.useGetAll()
  const { mutate: deleteMutation } = fonctionServices.useDelete()
  const [editingItem, setEditingItem] = useState<FONCTION_T | null>(null)

  const serviceLabel = useMemo(() => {
    const map = new Map(services.map((s) => [s.id, s.nom]))
    return (id: number) => map.get(id) ?? '—'
  }, [services])

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'code', headerName: 'Code', width: 100, cellRenderer: BadgeCellRenderer },
    { field: 'nom', headerName: 'Fonction', flex: 1, cellRenderer: PrimaryTextCellRenderer },
    {
      field: 'service_id', headerName: 'Service', width: 220,
      cellRenderer: (p: any) => <BadgeCellRenderer {...p} value={serviceLabel(p.value)} />,
    },
    {
      headerName: 'Actions', width: 120, minWidth: 120, sortable: false, filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: { onEdit: (row: FONCTION_T) => setEditingItem(row), onDelete: (id: number) => deleteMutation(id) },
    },
  ], [deleteMutation, serviceLabel])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || fetchedData.length === 0) return fetchedData
    const fuse = new Fuse(fetchedData, { keys: ['nom', 'code'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [fetchedData, searchQuery])

  const modalNode = (
    <FonctionFormModal open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} initialData={editingItem} />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
