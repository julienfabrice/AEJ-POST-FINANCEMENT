import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'
import { useProjetsStore } from '@/store/useProjetsStore'
import { ProjetSheetHeader, ProjetSheetFooter } from './components'
import { DossierTab, WorkflowTab, PiecesTab, ObservationsTab } from './Tabs'

export function ProjetDetailsSheet() {
  const { selectedProjet: projet, setSelectedProjet } = useProjetsStore()

  if (!projet) return null

  const handleClose = () => setSelectedProjet(null)

  return (
    <Sheet open={!!projet} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full sm:max-w-[600px] p-0 flex flex-col gap-0 overflow-hidden bg-white shadow-xl"
      >
        <ProjetSheetHeader projet={projet} onClose={handleClose} />

        {/* Tabs & Content - .mtabs */}
        <Tabs defaultValue="dossier" className="flex-1 flex flex-col min-h-0">
          <div className="shrink-0 px-4 border-b border-aej-line flex items-center justify-between bg-white relative">
            <TabsList variant="line" className="h-auto p-0 flex space-x-2">
              {[
                { id: 'dossier', label: 'Dossier' },
                { id: 'workflow', label: 'Parcours workflow' },
                { id: 'pieces', label: 'Pièces' },
                { id: 'observations', label: 'Observations' }
              ].map(t => (
                <TabsTrigger 
                  key={t.id}
                  value={t.id} 
                  className="rounded-none px-4 py-3.5 text-[13.5px] font-medium shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent outline-none after:bottom-[-1px] data-[state=active]:text-aej-orange data-[state=active]:after:bg-aej-orange focus-visible:outline-none focus-visible:ring-0 text-aej-slate hover:text-aej-ink-3 transition-colors"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button variant="ghost" size="sm" className="h-7 text-[12px] text-aej-slate hover:bg-aej-line/50">
              <Users className="w-3.5 h-3.5 mr-1.5 text-aej-slate-2" />
              Antécédents
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-aej-bg text-[13px]">
            <DossierTab projet={projet} />
            <WorkflowTab />
            <PiecesTab />
            <ObservationsTab />
          </div>

          <ProjetSheetFooter onClose={handleClose} />
        </Tabs>

      </SheetContent>
    </Sheet>
  )
}
