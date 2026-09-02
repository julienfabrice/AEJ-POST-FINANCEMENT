import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import type { ColDef, ValueFormatterParams } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { compteFinancementServices } from '@/services/compteFinancements.services'
import { CompteFinancementFormModal } from '../components/CompteFinancementFormModal'
import type { COMPTE_FINANCEMENT_T } from '@/types'

const formatDate = (params: ValueFormatterParams) =>
  params.value ? dayjs(params.value).format('DD/MM/YYYY') : '—'

export function useCompteFinancementsGrid(searchQuery: string) {
  const { data: comptes = [], isLoading } = compteFinancementServices.useGetAll()
  const { mutate: deleteMutation } = compteFinancementServices.useDelete()
  const [editingItem, setEditingItem] = useState<COMPTE_FINANCEMENT_T | null>(null)

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'micro_projet_id', headerName: 'Micro-projet', width: 130 },
    { field: 'organisme_id', headerName: 'Partenaire', width: 120 },
    { field: 'etat_ouverture', headerName: "État d'ouverture", width: 150 },
    { field: 'localite_ouverture', headerName: 'Localité', width: 140 },
    { field: 'date_ouverture', headerName: "Date d'ouverture", width: 140, valueFormatter: formatDate },
    { field: 'avis_partenaire', headerName: 'Avis partenaire', width: 140 },
    {
      headerName: 'Actions', width: 100, minWidth: 100, sortable: false, filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: { onEdit: (row: COMPTE_FINANCEMENT_T) => setEditingItem(row), onDelete: (id: number) => deleteMutation(id) },
    },
  ], [deleteMutation])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || comptes.length === 0) return comptes
    const fuse = new Fuse(comptes, { keys: ['localite_ouverture', 'observations'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [comptes, searchQuery])

  const modalNode = (
    <CompteFinancementFormModal open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} initialData={editingItem} />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
