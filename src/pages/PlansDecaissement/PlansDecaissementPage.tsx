import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GridSection, SUBTAB_TRIGGER_CLASS } from '@/components/shared/GridSection'

import { PlanDecaissementFormModal } from './components/PlanDecaissementFormModal'
import { usePlanDecaissementsGrid } from './hooks/usePlanDecaissementsGrid'

import { DecaissementFormModal } from './components/DecaissementFormModal'
import { useDecaissementsGrid } from './hooks/useDecaissementsGrid'

import { CompteFinancementFormModal } from './components/CompteFinancementFormModal'
import { useCompteFinancementsGrid } from './hooks/useCompteFinancementsGrid'

function PlanSubTab() {
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

function ExecutionSubTab() {
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

function CompteFinancementSubTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const { columnDefs, data, isLoading, modalNode } = useCompteFinancementsGrid(searchQuery)
  return (
    <>
      {modalNode}
      <GridSection
        columnDefs={columnDefs}
        data={data}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un compte…"
        countLabel={`${data.length} compte(s)`}
        newButton={
          <CompteFinancementFormModal>
            <Button className="h-9"><Plus className="w-4 h-4 mr-2" />Nouveau compte de financement</Button>
          </CompteFinancementFormModal>
        }
      />
    </>
  )
}

export function PlansDecaissementPage() {
  const [subTab, setSubTab] = useState<'plan' | 'execution' | 'compte'>('plan')

  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29]">Plans de décaissement</h1>
        <p className="text-sm text-[#5A6B80] mt-1">
          Planification par prestataire, puis exécution réelle des décaissements.
        </p>
      </div>

      <Tabs value={subTab} onValueChange={(v) => setSubTab(v as 'plan' | 'execution' | 'compte')} className="w-full">
        <TabsList className="bg-slate-100 p-1 h-auto rounded-md w-fit">
          <TabsTrigger value="plan" className={SUBTAB_TRIGGER_CLASS}>Plan de décaissement</TabsTrigger>
          <TabsTrigger value="execution" className={SUBTAB_TRIGGER_CLASS}>Exécution</TabsTrigger>
          <TabsTrigger value="compte" className={SUBTAB_TRIGGER_CLASS}>Comptes de financement</TabsTrigger>
        </TabsList>
        <TabsContent value="plan" className="mt-2 outline-none">
          <PlanSubTab />
        </TabsContent>
        <TabsContent value="execution" className="mt-2 outline-none">
          <ExecutionSubTab />
        </TabsContent>
        <TabsContent value="compte" className="mt-2 outline-none">
          <CompteFinancementSubTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
