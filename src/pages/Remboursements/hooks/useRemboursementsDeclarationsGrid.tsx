import { remboursementDeclarationServices } from '@/services/remboursementsDeclarations.services'
import { useMemo, useState } from 'react'
import type { ColDef, ValueFormatterParams, ValueGetterParams } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { RemboursementDeclarationStatutCellRenderer } from '../components/RemboursementDeclarationStatutCellRenderer'
import { PromoteurDeclarationCellRenderer } from '../components/PromoteurDeclarationCellRenderer'
import { BudgetDeclarationCellRenderer } from '../components/BudgetDeclarationCellRenderer'
import { RemboursementDeclarationFormModal } from '../components/RemboursementDeclarationFormModal'
import { money } from '@/helpers/money'
import type { REMBOURSEMENT_DECLARATION_T } from '@/types'

const formatMontant = (params: ValueFormatterParams) => {
  const val = Number(params.value)
  return isNaN(val) ? (params.value ?? '—') : money(val)
}

export function useRemboursementsDeclarationsGrid(searchQuery: string) {
  const { data = [], isLoading } = remboursementDeclarationServices.useGetAll()
  const { mutate: deleteMutation } = remboursementDeclarationServices.useDelete()
  const [editingItem, setEditingItem] = useState<REMBOURSEMENT_DECLARATION_T | null>(null)

  const columnDefs = useMemo<ColDef<REMBOURSEMENT_DECLARATION_T>[]>(
    () => [
      {
        headerName: 'Promoteur',
        minWidth: 230,
        flex: 1.2,
        valueGetter: (p: ValueGetterParams<REMBOURSEMENT_DECLARATION_T>) => {
          const prom = p.data?.promoteur
          return prom
            ? `${prom.nom ?? ''} ${prom.prenom ?? ''} ${prom.matriculeaej ?? ''}`.trim()
            : `#${p.data?.promoteur_id ?? ''}`
        },
        cellRenderer: PromoteurDeclarationCellRenderer,
      },
      {
        field: 'budget_id',
        headerName: 'Budget',
        minWidth: 190,
        flex: 1,
        cellRenderer: BudgetDeclarationCellRenderer,
      },
      {
        field: 'montant_declare',
        headerName: 'Montant déclaré',
        width: 170,
        valueFormatter: formatMontant,
        cellClass: 'font-mono font-semibold text-[#131C29]',
      },
      { field: 'date_declaree', headerName: 'Date déclarée', width: 130 },
      { field: 'reference_banque', headerName: 'Référence bancaire', width: 160 },
      { field: 'statut', headerName: 'Statut', width: 220, cellRenderer: RemboursementDeclarationStatutCellRenderer },
      {
        headerName: 'Actions',
        width: 100,
        minWidth: 100,
        sortable: false,
        filter: false,
        cellRenderer: ActionsCellRenderer,
        cellRendererParams: {
          onEdit: (row: REMBOURSEMENT_DECLARATION_T) => setEditingItem(row),
          onDelete: (id: number) => deleteMutation(id),
        },
      },
    ],
    [deleteMutation]
  )

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || data.length === 0) return data
    const fuse = new Fuse(data, {
      keys: [
        'reference_banque',
        'promoteur.nom',
        'promoteur.prenom',
        'promoteur.matriculeaej',
      ],
      threshold: 0.3,
      ignoreLocation: true,
    })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [data, searchQuery])

  const modalNode = (
    <RemboursementDeclarationFormModal
      open={!!editingItem}
      onOpenChange={(open) => !open && setEditingItem(null)}
      initialData={editingItem}
    />
  )

  return {
    columnDefs,
    data: filteredData,
    isLoading,
    modalNode,
  }
}
