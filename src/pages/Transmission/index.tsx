import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MOCK_TRANSMISSION_LOTS } from '@/mock/transmission.mock'
import { useTransmission } from './hooks/useTransmission'
import { TransmissionHeader } from './UI/TransmissionHeader'
import { ComposerLotTab } from './UI/ComposerLotTab'
import { LotsTransmisTab } from './UI/LotsTransmisTab'

export function TransmissionPage() {
  const {
    activeTab,
    setActiveTab,
    selectedGuichet,
    setSelectedGuichet,
    selectedDossiers,
    handleSelectAll,
    toggleDossier,
  } = useTransmission()

  return (
    <div className="space-y-6">
      <TransmissionHeader />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'composer' | 'lots')} className="w-full">
        <div className="overflow-x-auto w-full no-scrollbar">
          <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
            <TabsTrigger
              value="composer"
              className="
                  !bg-transparent !shadow-none after:hidden
                  px-4 py-2.5 text-[13.5px] font-semibold text-slate-500
                  border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent
                  data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B]
                  hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none
                "
            >
              Composer un lot
            </TabsTrigger>
            <TabsTrigger
              value="lots"
              className="
                  !bg-transparent !shadow-none after:hidden
                  px-4 py-2.5 text-[13.5px] font-semibold text-slate-500
                  border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent
                  data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B]
                  hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none flex items-center gap-1.5
                "
            >
              Lots transmis
              <span className="bg-[#EEF2F7] text-[#5A6B80] px-2 py-0.5 rounded-full text-[11px]">
                {MOCK_TRANSMISSION_LOTS.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="composer" className="mt-5 outline-none">
          <ComposerLotTab
            selectedGuichet={selectedGuichet}
            setSelectedGuichet={setSelectedGuichet}
            selectedDossiers={selectedDossiers}
            toggleDossier={toggleDossier}
            handleSelectAll={handleSelectAll}
          />
        </TabsContent>

        <TabsContent value="lots" className="mt-5 outline-none">
          <LotsTransmisTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
