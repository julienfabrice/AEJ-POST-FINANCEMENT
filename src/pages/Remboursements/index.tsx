import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GridSection, SUBTAB_TRIGGER_CLASS } from '@/components/shared/GridSection'

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
      {/* ---- En-tête ---- */}
      <div>
        <h1 className="text-[24px] font-extrabold text-[#131C29] font-['Archivo'] tracking-tight">
          Remboursements
        </h1>
        <p className="text-[13px] text-[#5A6B80] mt-1">Échéances, encaissements et impayés.</p>
      </div>

      <Tabs value={subTab} onValueChange={(v) => setSubTab(v as 'suivi' | 'declarations')} className="w-full">
        <TabsList className="bg-slate-100 p-1 h-auto rounded-md w-fit">
          <TabsTrigger value="suivi" className={SUBTAB_TRIGGER_CLASS}>Suivi</TabsTrigger>
          <TabsTrigger value="declarations" className={SUBTAB_TRIGGER_CLASS}>Déclarations de paiement</TabsTrigger>
        </TabsList>
        <TabsContent value="suivi" className="mt-2 outline-none space-y-6">
          <SuiviSubTab />
        </TabsContent>
        <TabsContent value="declarations" className="mt-2 outline-none">
          <DeclarationsSubTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
