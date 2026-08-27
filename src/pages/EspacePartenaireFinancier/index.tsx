import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useEspacePartenaire, type TabKey } from './hooks/useEspacePartenaire'
import { KPIs } from './components/KPIs'

import { TabLotsRecus } from './UI/TabLotsRecus'
import { TabListeDecision } from './UI/TabListeDecision'
import { TabPlansDecaissement } from './UI/TabPlansDecaissement'
import { TabRemboursements } from './UI/TabRemboursements'
import { TabGaranties } from './UI/TabGaranties'
import { TabDecaissements } from './UI/TabDecaissements'

export function EspacePartenaireFinancierPage() {
  const { activeTab, setActiveTab, kpis, tabsConfig } = useEspacePartenaire()

  return (
    <div className="space-y-5">
      <KPIs kpis={kpis} />

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabKey)}
        className="w-full"
      >
        <div className="overflow-x-auto w-full no-scrollbar">
          <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
            {tabsConfig.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="
                  !bg-transparent !shadow-none after:hidden
                  px-4 py-2.5 text-[13.5px] font-semibold text-slate-500
                  border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent
                  data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B]
                  hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none
                  flex items-center gap-2
                "
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-[rgba(255,255,255,.1)] text-[#5A6B80] data-[state=active]:bg-[#FBEADE] data-[state=active]:text-[#C85E18] text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 min-w-[20px] text-center">
                    {tab.count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="lots" className="mt-5 outline-none">
          <TabLotsRecus />
        </TabsContent>

        <TabsContent value="approuves" className="mt-5 outline-none">
          <TabListeDecision type="APPROUVE" />
        </TabsContent>

        <TabsContent value="rejetes" className="mt-5 outline-none">
          <TabListeDecision type="REJETE" />
        </TabsContent>

        <TabsContent value="plans" className="mt-5 outline-none">
          <TabPlansDecaissement />
        </TabsContent>

        <TabsContent value="decaissements" className="mt-5 outline-none">
          <TabDecaissements />
        </TabsContent>

        <TabsContent value="remboursements" className="mt-5 outline-none">
          <TabRemboursements />
        </TabsContent>

        <TabsContent value="garanties" className="mt-5 outline-none">
          <TabGaranties />
        </TabsContent>
      </Tabs>
    </div>
  )
}
