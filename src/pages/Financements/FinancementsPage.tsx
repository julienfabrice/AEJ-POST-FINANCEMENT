import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DataGrid } from '@/components/ui/DataGrid'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { BudgetFormModal } from './components/BudgetFormModal'
import { useBudgetsGrid } from './hooks/useBudgetsGrid'

import { PlanDecaissementFormModal } from './components/PlanDecaissementFormModal'
import { usePlanDecaissementsGrid } from './hooks/usePlanDecaissementsGrid'

import { DecaissementFormModal } from './components/DecaissementFormModal'
import { useDecaissementsGrid } from './hooks/useDecaissementsGrid'

import { EcheancierGenerator } from './components/EcheancierGenerator'
import { usePlanRemboursementsGrid } from './hooks/usePlanRemboursementsGrid'
import type { ColDef } from 'ag-grid-community'

const TAB_TRIGGER_CLASS = "!bg-transparent !shadow-none after:hidden px-4 py-2.5 text-[13.5px] font-semibold text-slate-500 border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B] hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none"

function GridSection({
  columnDefs, data, isLoading, searchQuery, onSearchChange, searchPlaceholder, countLabel, newButton,
}: {
  columnDefs: ColDef[]
  data: unknown[]
  isLoading: boolean
  searchQuery: string
  onSearchChange: (v: string) => void
  searchPlaceholder: string
  countLabel: string
  newButton: React.ReactNode
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 my-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-9 h-9 bg-white border-slate-200"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <span className="text-[12.5px] text-slate-500 whitespace-nowrap">
          {isLoading ? 'Chargement...' : countLabel}
        </span>
        <div className="flex-1" />
        {newButton}
      </div>

      <Card className="p-0 overflow-hidden border-slate-200 rounded-lg shadow-sm">
        {isLoading ? (
          <div className="w-full h-[calc(100vh-360px)] flex flex-col">
            <div className="h-[48px] bg-[#fafbfd] border-b border-[#E5EAF1] flex items-center px-4 gap-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex-1 p-4 space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <DataGrid
            rowData={data}
            columnDefs={columnDefs}
            height="calc(100vh - 360px)"
            rowHeight={55}
            defaultColDef={{ sortable: true, filter: true, resizable: true }}
          />
        )}
      </Card>
    </>
  )
}

function BudgetsTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const { columnDefs, data, isLoading, modalNode } = useBudgetsGrid(searchQuery)
  return (
    <>
      {modalNode}
      <GridSection
        columnDefs={columnDefs}
        data={data}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un budget…"
        countLabel={`${data.length} budget(s)`}
        newButton={
          <BudgetFormModal>
            <Button className="h-9"><Plus className="w-4 h-4 mr-2" />Nouveau budget</Button>
          </BudgetFormModal>
        }
      />
    </>
  )
}

function PlanDecaissementSubTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const { columnDefs, data, isLoading, modalNode } = usePlanDecaissementsGrid(searchQuery)
  return (
    <>
      {modalNode}
      <GridSection
        columnDefs={columnDefs}
        data={data}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un plan…"
        countLabel={`${data.length} plan(s)`}
        newButton={
          <PlanDecaissementFormModal>
            <Button className="h-9"><Plus className="w-4 h-4 mr-2" />Nouveau plan de décaissement</Button>
          </PlanDecaissementFormModal>
        }
      />
    </>
  )
}

function DecaissementExecutionSubTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const { columnDefs, data, isLoading, modalNode } = useDecaissementsGrid(searchQuery)
  return (
    <>
      {modalNode}
      <GridSection
        columnDefs={columnDefs}
        data={data}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un décaissement…"
        countLabel={`${data.length} décaissement(s)`}
        newButton={
          <DecaissementFormModal>
            <Button className="h-9"><Plus className="w-4 h-4 mr-2" />Nouveau décaissement</Button>
          </DecaissementFormModal>
        }
      />
    </>
  )
}

function DecaissementsTab() {
  const [subTab, setSubTab] = useState<'plan' | 'execution'>('plan')
  return (
    <Tabs value={subTab} onValueChange={(v) => setSubTab(v as 'plan' | 'execution')} className="w-full">
      <TabsList className="bg-slate-100 p-1 h-auto rounded-md w-fit">
        <TabsTrigger value="plan" className="text-[13px] px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded">
          Plan de décaissement
        </TabsTrigger>
        <TabsTrigger value="execution" className="text-[13px] px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded">
          Exécution
        </TabsTrigger>
      </TabsList>
      <TabsContent value="plan" className="mt-2 outline-none">
        <PlanDecaissementSubTab />
      </TabsContent>
      <TabsContent value="execution" className="mt-2 outline-none">
        <DecaissementExecutionSubTab />
      </TabsContent>
    </Tabs>
  )
}

function RemboursementsTab() {
  const { columnDefs, data, isLoading } = usePlanRemboursementsGrid()
  return (
    <div className="space-y-8">
      <EcheancierGenerator />
      <div>
        <p className="text-sm font-bold text-[#131C29] mb-3">Échéances enregistrées</p>
        <Card className="p-0 overflow-hidden border-slate-200 rounded-lg shadow-sm">
          {isLoading ? (
            <div className="p-4"><Skeleton className="h-40 w-full" /></div>
          ) : (
            <DataGrid
              rowData={data}
              columnDefs={columnDefs}
              height="420px"
              rowHeight={50}
              defaultColDef={{ sortable: true, filter: true, resizable: true }}
            />
          )}
        </Card>
      </div>
    </div>
  )
}

export function FinancementsPage() {
  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29]">Financements</h1>
        <p className="text-sm text-[#5A6B80] mt-1">
          Budgets, plans de décaissement et échéanciers de remboursement.
        </p>
      </div>

      <Tabs defaultValue="budgets" className="w-full">
        <div className="overflow-x-auto w-full no-scrollbar">
          <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
            <TabsTrigger value="budgets" className={TAB_TRIGGER_CLASS}>Budgets</TabsTrigger>
            <TabsTrigger value="decaissements" className={TAB_TRIGGER_CLASS}>Décaissements</TabsTrigger>
            <TabsTrigger value="remboursements" className={TAB_TRIGGER_CLASS}>Remboursements</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="budgets" className="mt-2 outline-none">
          <BudgetsTab />
        </TabsContent>
        <TabsContent value="decaissements" className="mt-2 outline-none">
          <DecaissementsTab />
        </TabsContent>
        <TabsContent value="remboursements" className="mt-6 outline-none">
          <RemboursementsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
