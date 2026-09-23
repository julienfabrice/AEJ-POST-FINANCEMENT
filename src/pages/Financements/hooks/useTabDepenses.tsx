import { useState, useMemo, useCallback } from 'react'
import dayjs from 'dayjs'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { StatusBadge } from '../../EspacePartenaireFinancier/components/StatusBadge'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { money } from '@/helpers/money'
import { transactionServices } from '@/services/transactions.services'
import type { TRANSACTION_T, TRANSACTION_STATUT_T } from '@/types'

export const TRANSACTION_STATUT_VARIANTS: Record<TRANSACTION_STATUT_T, 'gr' | 'am' | 'rd' | 'gy'> = {
  BROUILLON: 'gy',
  SOUMIS: 'am',
  VALIDE: 'gr',
  REJETE: 'rd',
  ANNULE: 'gy',
}

export function useTabDepenses() {
  const { data: depenses = [], isLoading } = transactionServices.useGetAll()
  const { mutate: deleteTransaction } = transactionServices.useDelete()

  const [searchQuery, setSearchQuery] = useState('')
  const [toEdit, setToEdit] = useState<TRANSACTION_T | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const handleCloseModal = useCallback((open: boolean) => {
    if (!open) {
      setToEdit(null)
      setIsCreateOpen(false)
    }
  }, [])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || depenses.length === 0) return depenses
    const fuse = new Fuse(depenses, {
      keys: [
        'libelle',
        'micro_projet.code',
        'micro_projet.intitule',
        'statut',
        'reference',
      ],
      threshold: 0.3,
      ignoreLocation: true,
    })
    return fuse.search(searchQuery).map((res) => res.item)
  }, [depenses, searchQuery])

  const columnDefs = useMemo<ColDef<TRANSACTION_T>[]>(() => [
    {
      headerName: 'Micro-projet',
      minWidth: 200,
      flex: 1.2,
      valueGetter: (p) =>
        p.data?.micro_projet
          ? `${p.data.micro_projet.code} ${p.data.micro_projet.intitule}`
          : `#${p.data?.micro_projet_id ?? ''}`,
      cellRenderer: (p: ICellRendererParams<TRANSACTION_T>) => {
        const projet = p.data?.micro_projet
        return projet ? (
          <div className="flex items-center gap-1.5 min-w-0 py-1">
            <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FBEADE] text-[#C85E18] shrink-0 h-fit leading-tight">
              {projet.code}
            </span>
            <span className="text-[#5A6B80] truncate text-sm">{projet.intitule}</span>
          </div>
        ) : (
          <span className="text-[#8595A8]">#{p.data?.micro_projet_id}</span>
        )
      },
    },
    {
      field: 'categorie_id',
      headerName: 'Catégorie',
      width: 140,
      valueGetter: (p) => (p.data?.categorie_id ? `Catégorie #${p.data.categorie_id}` : '—'),
      cellRenderer: (p: ICellRendererParams<TRANSACTION_T>) => (
        <span className="text-[13px] text-[#5A6B80]">{p.value}</span>
      ),
    },
    {
      field: 'libelle',
      headerName: 'Intitulé',
      flex: 1,
      minWidth: 180,
      cellRenderer: (p: ICellRendererParams<TRANSACTION_T>) => (
        <span className="text-[13px] text-[#131C29] font-medium truncate">{p.value || '—'}</span>
      ),
    },
    {
      field: 'montant',
      headerName: 'Montant',
      width: 150,
      valueGetter: (p) => Number(p.data?.montant) || 0,
      cellRenderer: (p: ICellRendererParams<TRANSACTION_T>) => (
        <span className="text-[13px] font-mono font-semibold text-[#131C29]">
          {money(p.value)}
        </span>
      ),
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 120,
      valueGetter: (p) => (p.data?.date ? dayjs(p.data.date).format('DD/MM/YYYY') : '—'),
      cellRenderer: (p: ICellRendererParams<TRANSACTION_T>) => (
        <span className="text-[13px] text-[#5A6B80]">{p.value}</span>
      ),
    },
    {
      field: 'statut',
      headerName: 'Statut',
      width: 130,
      cellRenderer: (p: ICellRendererParams<TRANSACTION_T>) => (
        <div className="flex items-center h-full">
          <StatusBadge
            label={p.value}
            variant={TRANSACTION_STATUT_VARIANTS[p.value as TRANSACTION_STATUT_T] ?? 'gy'}
          />
        </div>
      ),
    },
    {
      headerName: 'Actions',
      width: 100,
      pinned: 'right',
      sortable: false,
      filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: {
        onEdit: (row: TRANSACTION_T) => setToEdit(row),
        onDelete: (id: number) => deleteTransaction(Number(id)),
      },
    },
  ], [deleteTransaction])

  return {
    depenses,
    isLoading,
    searchQuery,
    setSearchQuery,
    filteredData,
    columnDefs,
    toEdit,
    setToEdit,
    isCreateOpen,
    setIsCreateOpen,
    handleCloseModal,
    deleteTransaction,
  }
}
