import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DataGrid } from '@/components/ui/DataGrid'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GridSection, SUBTAB_TRIGGER_CLASS } from '@/components/shared/GridSection'

import { EcheancierGenerator } from './components/EcheancierGenerator'
import { usePlanRemboursementsGrid } from './hooks/usePlanRemboursementsGrid'

import { RemboursementFormModal } from './components/RemboursementFormModal'
import { useRemboursementsGrid } from './hooks/useRemboursementsGrid'
import { RemboursementsKpiCards } from './components/RemboursementsKpiCards'
import { RemboursementsBuckets } from './components/RemboursementsBuckets'

function EcheancierSubTab() {
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

function PaiementsSubTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const { columnDefs, data, isLoading, modalNode } = useRemboursementsGrid(searchQuery)
  return (
    <div className="space-y-6">
      {modalNode}
      <RemboursementsKpiCards />
      <RemboursementsBuckets />
      <GridSection
        columnDefs={columnDefs}
        data={data}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un remboursement…"
        countLabel={`${data.length} remboursement(s)`}
        newButton={
          <RemboursementFormModal>
            <Button className="h-9"><Plus className="w-4 h-4 mr-2" />Nouveau remboursement</Button>
          </RemboursementFormModal>
        }
      />
    </div>
  )
}

export function RemboursementsPage() {
  const [subTab, setSubTab] = useState<'echeancier' | 'paiements'>('echeancier')

  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29]">Remboursements</h1>
        <p className="text-sm text-[#5A6B80] mt-1">
          Échéancier calculé (capital, taux, durée, différé) et suivi des paiements réels.
        </p>
      </div>

      <Tabs value={subTab} onValueChange={(v) => setSubTab(v as 'echeancier' | 'paiements')} className="w-full">
        <TabsList className="bg-slate-100 p-1 h-auto rounded-md w-fit">
          <TabsTrigger value="echeancier" className={SUBTAB_TRIGGER_CLASS}>Échéancier</TabsTrigger>
          <TabsTrigger value="paiements" className={SUBTAB_TRIGGER_CLASS}>Paiements</TabsTrigger>
        </TabsList>
        <TabsContent value="echeancier" className="mt-4 outline-none">
          <EcheancierSubTab />
        </TabsContent>
        <TabsContent value="paiements" className="mt-2 outline-none">
          <PaiementsSubTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
