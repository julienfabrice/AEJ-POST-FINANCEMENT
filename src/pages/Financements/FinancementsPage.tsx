import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UnderConstruction } from '@/components/ui/UnderConstruction'
import { BudgetsTable } from './components/BudgetsTable'

const SUBTAB_CLASS = "text-[13.5px] px-4 py-2.5 font-semibold text-slate-500 border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B] hover:text-[#131C29] rounded-none !bg-transparent !shadow-none"

export function FinancementsPage() {
  const [subTab, setSubTab] = useState<'budgets' | 'depenses'>('budgets')

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[#131C29]">Financements</h1>
      </div>

      <Tabs value={subTab} onValueChange={(v) => setSubTab(v as 'budgets' | 'depenses')} className="w-full">
        <TabsList className="flex items-center gap-1 border-b border-slate-200 bg-transparent p-0 h-auto rounded-none justify-start w-full">
          <TabsTrigger value="budgets" className={SUBTAB_CLASS}>Budgets accordés</TabsTrigger>
          <TabsTrigger value="depenses" className={SUBTAB_CLASS}>Dépenses</TabsTrigger>
        </TabsList>

        <TabsContent value="budgets" className="mt-4 outline-none">
          <BudgetsTable />
        </TabsContent>
        <TabsContent value="depenses" className="mt-4 outline-none">
          <UnderConstruction />
        </TabsContent>
      </Tabs>
    </div>
  )
}
