import { useState, useMemo } from 'react'
import dayjs from 'dayjs'
import { SearchX, WalletCards } from 'lucide-react'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DataGrid } from '@/components/ui/DataGrid'
import { EmptyState } from '@/components/generics/emptyState'
import { StatusBadge } from '../../EspacePartenaireFinancier/components/StatusBadge'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { money } from '@/helpers/money'
import { budgetServices } from '@/services/budgets.services'
import { guichetServices } from '@/services/guichets.services'
import { organismeServices } from '@/services/organismes.services'
import { secteurServices } from '@/services/secteurs.services'
import { agenceRegionaleServices } from '@/services/agences-regionales.services'
import { BudgetFormModal } from '@/components/generics/BudgetFormModal'
import { BudgetImportModal } from '../components/BudgetImportModal'
import { BudgetsFilters } from './BudgetsFilters'
import { useBudgetsFilters } from '../hooks/useBudgetsFilters'
import type { BUDGET_T } from '@/types'

export function TabBudgetsAccordes() {
  const { data: budgets = [], isLoading } = budgetServices.useGetAll()
  const { mutate: deleteBudget } = budgetServices.useDelete()
  const { data: guichets = [] } = guichetServices.useGetAll()
  const { data: organismes = [] } = organismeServices.useGetAll()
  const { data: secteurs = [] } = secteurServices.useGetAll()
  const { data: agences = [] } = agenceRegionaleServices.useGetAll()

  const {
    filters,
    setFilters,
    resetFilters,
    hasFilters,
    filteredBudgets: filteredData,
  } = useBudgetsFilters({
    budgets,
    organismes,
  })

  const [budgetToEdit, setBudgetToEdit] = useState<BUDGET_T | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)

  const guichetById = useMemo(() => new Map(guichets.map((g) => [g.id, g])), [guichets])
  const organismeById = useMemo(() => new Map(organismes.map((o) => [o.id, o])), [organismes])

  const columnDefs = useMemo<ColDef<BUDGET_T>[]>(() => [
    {
      headerName: 'Projet',
      minWidth: 220,
      flex: 1.2,
      valueGetter: (p) =>
        `${p.data?.micro_projet?.code ?? ''} ${p.data?.micro_projet?.intitule ?? ''} ${p.data?.intitule ?? ''}`.trim(),
      cellRenderer: (p: ICellRendererParams<BUDGET_T>) => {
        const projet = p.data?.micro_projet
        return (
          <div className="flex flex-col justify-center min-w-0 py-1 leading-tight">
            <b className="text-[#2D6BD4] font-semibold text-[13px] truncate">
              {projet?.code ?? `#${p.data?.micro_projet_id}`}
            </b>
            <span className="text-[#5A6B80] text-xs truncate">
              {projet?.intitule ?? p.data?.intitule ?? '—'}
            </span>
          </div>
        )
      },
    },
    {
      headerName: 'Guichet',
      width: 110,
      valueGetter: (p) => {
        const gId = p.data?.micro_projet?.guichet_id
        return gId ? (guichetById.get(gId)?.code ?? '—') : '—'
      },
      cellRenderer: (p: ICellRendererParams<BUDGET_T>) => (
        <div className="flex items-center h-full">
          <span className="inline-flex items-center font-mono font-semibold text-[11px] px-2 py-0.5 rounded-full bg-[#EEF2F7] text-[#5A6B80] h-fit leading-tight">
            {p.value}
          </span>
        </div>
      ),
    },
    {
      headerName: 'Partenaire',
      width: 150,
      valueGetter: (p) => {
        const oId = p.data?.micro_projet?.organisme_id
        if (!oId) return '—'
        const org = organismeById.get(oId)
        return org?.sigle ?? org?.nom ?? '—'
      },
      cellRenderer: (p: ICellRendererParams<BUDGET_T>) => (
        <span className="text-[13px] text-[#131C29] truncate">{p.value}</span>
      ),
    },
    {
      headerName: 'Transmis',
      width: 120,
      valueGetter: (p) =>
        p.data?.micro_projet?.date_transmission_partenaire
          ? dayjs(p.data.micro_projet.date_transmission_partenaire).format('DD/MM/YYYY')
          : '—',
      cellRenderer: (p: ICellRendererParams<BUDGET_T>) => (
        <span className="text-[13px] text-[#5A6B80]">{p.value}</span>
      ),
    },
    {
      field: 'montant_accorde',
      headerName: 'Montant',
      width: 150,
      valueGetter: (p) => Number(p.data?.montant_accorde) || 0,
      cellRenderer: (p: ICellRendererParams<BUDGET_T>) => (
        <span className="text-[13px] font-mono font-semibold text-[#131C29]">
          {money(p.value)}
        </span>
      ),
    },
    {
      field: 'statut',
      headerName: 'Approbation',
      width: 140,
      cellRenderer: (p: ICellRendererParams<BUDGET_T>) => (
        <div className="flex items-center h-full">
          <StatusBadge
            label={p.value}
            variant={p.value === 'APPROUVE' ? 'gr' : p.value === 'EN_ATTENTE' ? 'am' : 'rd'}
          />
        </div>
      ),
    },
    {
      headerName: 'Taux Int.',
      width: 100,
      valueGetter: (p) =>
        p.data?.plan_remboursements?.interets != null
          ? `${p.data.plan_remboursements.interets}%`
          : '—',
      cellRenderer: (p: ICellRendererParams<BUDGET_T>) => (
        <span className="text-[13px] text-[#5A6B80]">{p.value}</span>
      ),
    },
    {
      headerName: 'Durée Remb',
      width: 120,
      valueGetter: (p) =>
        p.data?.plan_remboursements?.duree_remboursement != null
          ? `${p.data.plan_remboursements.duree_remboursement} mois`
          : '—',
      cellRenderer: (p: ICellRendererParams<BUDGET_T>) => (
        <span className="text-[13px] text-[#5A6B80]">{p.value}</span>
      ),
    },
    {
      field: 'signature_convention',
      headerName: 'Convention',
      width: 130,
      cellRenderer: (p: ICellRendererParams<BUDGET_T>) => (
        <div className="flex items-center h-full">
          <StatusBadge
            label={p.value === 'SIGNEE' ? 'Signée' : 'En cours'}
            variant={p.value === 'SIGNEE' ? 'gr' : 'am'}
          />
        </div>
      ),
    },
    {
      field: 'deblocage',
      headerName: 'Déblocage',
      width: 130,
      cellRenderer: (p: ICellRendererParams<BUDGET_T>) => (
        <div className="flex items-center h-full">
          <StatusBadge
            label={p.value ? 'DEBLOQUE' : 'NON'}
            variant={p.value ? 'gr' : 'gy'}
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
        onEdit: (row: BUDGET_T) => setBudgetToEdit(row),
        onDelete: (id: number) => deleteBudget(Number(id)),
      },
    },
  ], [guichetById, organismeById, deleteBudget])

  return (
    <div className="space-y-4">
      <BudgetFormModal 
        open={isCreateOpen || !!budgetToEdit} 
        onOpenChange={(val) => {
          if (!val) {
            setBudgetToEdit(null)
            setIsCreateOpen(false)
          }
        }} 
        initialData={budgetToEdit} 
      />

      {/* Advanced Filters Bar & Dialog */}
      <BudgetsFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
        totalCount={budgets.length}
        filteredCount={filteredData.length}
        isLoading={isLoading}
        onAddNew={() => setIsCreateOpen(true)}
        onImport={() => setIsImportOpen(true)}
        organismes={organismes}
        guichets={guichets}
        secteurs={secteurs}
        agences={agences}
      />

      <BudgetImportModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
      />

      <Card className="p-0 overflow-hidden border-slate-200 rounded-lg shadow-sm">
        {isLoading ? (
          <div className="w-full h-[calc(100vh-340px)] flex flex-col">
            <div className="h-[48px] bg-[#fafbfd] border-b border-[#E5EAF1] flex items-center px-4 gap-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-32" />
              <div className="flex-1" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex-1 p-4 space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-48" />
                  <div className="flex-1" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-7 rounded-md" />
                    <Skeleton className="h-7 w-7 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <EmptyState
            variant="bare"
            icon={hasFilters ? SearchX : WalletCards}
            title={hasFilters ? 'Aucun résultat' : 'Aucun budget accordé'}
            description={
              hasFilters
                ? 'Aucun budget ne correspond à vos critères de recherche. Modifiez ou réinitialisez les filtres.'
                : 'Les budgets accordés apparaîtront ici dès leur enregistrement.'
            }
          >
            {hasFilters && (
              <Button
                variant="outline"
                onClick={resetFilters}
                className="cursor-pointer mt-2"
              >
                Réinitialiser les filtres
              </Button>
            )}
          </EmptyState>
        ) : (
          <DataGrid 
            rowData={filteredData} 
            columnDefs={columnDefs} 
            height="calc(100vh - 340px)"
            rowHeight={60}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
          />
        )}
      </Card>
    </div>
  )
}