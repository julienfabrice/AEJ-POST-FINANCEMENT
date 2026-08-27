import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFinancements } from './hooks/useFinancements'
import { TabBudgetsAccordes } from './UI/TabBudgetsAccordes'
import { TabDepenses } from './UI/TabDepenses'

export function FinancementsPage() {
  const { activeTab, setActiveTab } = useFinancements()

  return (
    <div className="space-y-5">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'budgets' | 'depenses')}
        className="w-full"
      >
        <div className="overflow-x-auto w-full no-scrollbar">
          <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
            <TabsTrigger
              value="budgets"
              className="
                  !bg-transparent !shadow-none after:hidden
                  px-4 py-2.5 text-[13.5px] font-semibold text-slate-500
                  border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent
                  data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B]
                  hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none
                "
            >
              Budgets accordés
            </TabsTrigger>
            <TabsTrigger
              value="depenses"
              className="
                  !bg-transparent !shadow-none after:hidden
                  px-4 py-2.5 text-[13.5px] font-semibold text-slate-500
                  border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent
                  data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B]
                  hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none
                "
            >
              Dépenses
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="budgets" className="mt-5 outline-none">
          <TabBudgetsAccordes />
        </TabsContent>

        <TabsContent value="depenses" className="mt-5 outline-none">
          <TabDepenses />
        </TabsContent>
      </Tabs>
    </div>
  )
}
