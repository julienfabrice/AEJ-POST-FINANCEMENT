import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRecouvrement } from './hooks/useRecouvrement'
import { PortefeuilleTab } from './UI/PortefeuilleTab'
import { ContentieuxTab } from './UI/ContentieuxTab'
import { ActionsTab } from './UI/ActionsTab'
import { GarantiesTab } from './UI/GarantiesTab'

export function RecouvrementPage() {
  const {
    activeTab,
    setActiveTab,
    aJour,
    leger,
    lourd,
    contentieux,
    actions,
    garanties,
    handleActionAmiable,
    handleSortirPortefeuille
  } = useRecouvrement()

  const tabsConfig = [
    { id: 'portefeuille', label: 'Portefeuille' },
    { id: 'actions', label: 'Actions de recouvrement', count: actions.length },
    { id: 'contentieux', label: 'Contentieux', count: contentieux.length },
    { id: 'garanties', label: 'Rappels de garantie', count: garanties.length },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-[24px] font-extrabold text-[#131C29] leading-tight mb-1">
            Recouvrement & garanties
          </h1>
          <p className="text-[14.5px] text-[#5A6B80]">
            Stratégie amiable jusqu&apos;au 3ᵉ impayé, puis sortie du portefeuille et saisine de l&apos;avocat de l&apos;AEJ.
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as any)}
        className="w-full"
      >
        <div className="overflow-x-auto w-full no-scrollbar mb-4">
          <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
            {tabsConfig.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="
                  !bg-transparent !shadow-none after:hidden
                  px-4 py-2.5 text-[13.5px] font-semibold text-slate-500
                  border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent
                  data-[state=active]:text-[#C85E18] data-[state=active]:!border-[#E7722B]
                  hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none
                  flex items-center gap-2 group
                "
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="text-[#5A6B80] group-data-[state=active]:bg-[#FBEADE] group-data-[state=active]:text-[#C85E18] text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-[#E5EAF1] min-w-[20px] text-center ml-[5px]">
                    {tab.count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="portefeuille" className="outline-none">
          <PortefeuilleTab
            aJour={aJour}
            leger={leger}
            lourd={lourd}
            onActionAmiable={handleActionAmiable}
            onSortir={handleSortirPortefeuille}
          />
        </TabsContent>

        <TabsContent value="contentieux" className="outline-none">
          <ContentieuxTab contentieux={contentieux} />
        </TabsContent>

        <TabsContent value="actions" className="outline-none">
          <ActionsTab actions={actions} />
        </TabsContent>

        <TabsContent value="garanties" className="outline-none">
          <GarantiesTab garanties={garanties} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
