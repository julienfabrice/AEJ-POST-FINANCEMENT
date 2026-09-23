import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GridSection } from '@/components/shared/GridSection'

import { useRemboursements } from './hooks/useRemboursements'
import { KPIs } from './components/KPIs'
import { GroupsGrid } from './UI/GroupsGrid'
import { RemboursementsTable } from './UI/RemboursementsTable'

import { useRemboursementsDeclarationsGrid } from './hooks/useRemboursementsDeclarationsGrid'
import { RemboursementDeclarationFormModal } from './components/RemboursementDeclarationFormModal'

function SuiviSubTab() {
  const { kpis, dossiersGroups } = useRemboursements()
  return (
    <>
      <KPIs kpis={kpis} />
      <GroupsGrid dossiersGroups={dossiersGroups} />
      <RemboursementsTable />
    </>
  )
}

function DeclarationsSubTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const { columnDefs, data, isLoading, modalNode } = useRemboursementsDeclarationsGrid(searchQuery)
  return (
    <>
      {modalNode}
      <GridSection
        columnDefs={columnDefs}
        data={data}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher une déclaration…"
        countLabel={`${data.length} déclaration(s)`}
        newButton={
          <RemboursementDeclarationFormModal>
            <Button className="h-9"><Plus className="w-4 h-4 mr-2" />Nouvelle déclaration</Button>
          </RemboursementDeclarationFormModal>
        }
      />
    </>
  )
}

export function RemboursementsPage() {
  const [subTab, setSubTab] = useState<'suivi' | 'declarations'>('suivi')

  return (
    <div className="space-y-6">
      <Tabs
        value={subTab}
        onValueChange={(v) => setSubTab(v as 'suivi' | 'declarations')}
        className="w-full"
      >
        <div className="overflow-x-auto w-full no-scrollbar">
          <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
            <TabsTrigger
              value="suivi"
              className="
                  !bg-transparent !shadow-none after:hidden
                  px-4 py-2.5 text-[13.5px] font-semibold text-slate-500
                  border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent
                  data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B]
                  hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none
                "
            >
              Suivi
            </TabsTrigger>
            <TabsTrigger
              value="declarations"
              className="
                  !bg-transparent !shadow-none after:hidden
                  px-4 py-2.5 text-[13.5px] font-semibold text-slate-500
                  border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent
                  data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B]
                  hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none
                "
            >
              Déclarations de paiement
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="suivi" className="mt-5 outline-none space-y-6">
          <SuiviSubTab />
        </TabsContent>

        <TabsContent value="declarations" className="mt-5 outline-none">
          <DeclarationsSubTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
