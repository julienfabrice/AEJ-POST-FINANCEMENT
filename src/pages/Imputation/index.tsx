import { useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from './components/Badge'
import { LgnAttente } from './UI/LgnAttente'
import { LgnFait } from './UI/LgnFait'
import { useImputation } from './hooks/useImputation'

export function ImputationPage() {
  const { 
    attente, 
    faits, 
    agences, 
    isLoading,
    selectedIds,
    selectedProjets,
    toggleSelection,
    toggleAllSelection,
    handleBulkImputation,
    isBulkImputing
  } = useImputation()

  const [selectedAgence, setSelectedAgence] = useState<string>('')

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#5A6B80]">
        <Loader2 size={34} className="animate-spin text-[#E7722B] mb-2" />
        <span className="text-[13.5px]">Chargement des dossiers et agences...</span>
      </div>
    )
  }

  const allSelected = attente.length > 0 && selectedIds.length === attente.length
  const indeterminate = selectedIds.length > 0 && selectedIds.length < attente.length

  const onImputerAgence = () => {
    if (!selectedAgence) return
    handleBulkImputation(Number(selectedAgence))
  }

  const onConserverDirection = () => {
    handleBulkImputation(null)
  }

  return (
    <div className="space-y-5">
      {/* Panneau de configuration d'imputation en masse */}
      {selectedIds.length > 0 && (
        <Card className="p-4 border-[#E7722B] bg-[#FFF8F3] shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between sticky top-4 z-10">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-auto p-1 px-2 hover:bg-[#F2E8E1] rounded flex items-center gap-2 group"
                >
                  <Badge text={selectedIds.length} cls="am" />
                  <span className="text-[14px] font-medium text-[#131C29] underline-offset-4 group-hover:underline">
                    dossier(s) sélectionné(s) — Voir la liste
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-[#F4F7F9]">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-[#131C29]">Dossiers sélectionnés ({selectedIds.length})</SheetTitle>
                  <SheetDescription>
                    Passez en revue les dossiers avant de valider l'imputation.
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-140px)] pr-4">
                  <div className="space-y-3">
                    {selectedProjets.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 border border-[#E5EAF1] rounded-lg bg-white shadow-sm hover:border-[#E7722B] transition-colors">
                        <div className="flex flex-col overflow-hidden mr-4">
                          <span className="font-semibold text-[13.5px] text-[#131C29] truncate">{p.code}</span>
                          <span className="text-[12.5px] text-[#5A6B80] truncate" title={p.intitule}>{p.intitule}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#5A6B80] hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                          onClick={() => toggleSelection(p.id)}
                          title="Retirer de la sélection"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select value={selectedAgence} onValueChange={setSelectedAgence}>
              <SelectTrigger className="w-[210px] h-[36px] bg-white border-[#cdd6e2]">
                <SelectValue placeholder="Choisir une agence..." />
              </SelectTrigger>
              <SelectContent>
                {agences.map(ag => (
                  <SelectItem key={ag.id} value={ag.id.toString()}>
                    {ag.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              className="h-[36px] bg-[#E7722B] hover:bg-[#c9601e]"
              disabled={!selectedAgence || isBulkImputing}
              onClick={onImputerAgence}
            >
              {isBulkImputing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Imputer à l'agence
            </Button>

            <Button
              variant="outline"
              className="h-[36px] border-[#5A6B80] text-[#5A6B80] hover:bg-[#f1f4f8]"
              disabled={isBulkImputing}
              onClick={onConserverDirection}
            >
              {isBulkImputing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Conserver à la Direction
            </Button>
          </div>
        </Card>
      )}

      {/* Card 1 : Dossiers approuvés à imputer */}
      <Card className="p-0 border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)] overflow-hidden">
        <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
          {attente.length > 0 && (
            <Checkbox 
              checked={allSelected ? true : indeterminate ? 'indeterminate' : false}
              onCheckedChange={(checked) => toggleAllSelection(checked === true)}
              className="data-[state=checked]:bg-[#E7722B] data-[state=checked]:border-[#E7722B] mr-2"
            />
          )}
          <h3 className="text-[14.5px] font-bold text-[#131C29]">Dossiers approuvés à imputer</h3>
          <div className="flex-1" />
          <Badge text={attente.length} cls="am" />
        </div>

        <div className="p-[18px]">
          {attente.length === 0 ? (
            <div className="text-center py-[40px] px-5 text-[#5A6B80] text-[13px]">
              Aucun dossier approuvé en attente d&apos;imputation
            </div>
          ) : (
            attente.map((d) => (
              <LgnAttente
                key={d.id}
                d={d}
                agences={agences}
                isChecked={selectedIds.includes(d.id)}
                onToggle={toggleSelection}
              />
            ))
          )}
        </div>
      </Card>

      {/* Card 2 : Dossiers déjà imputés */}
      <Card className="p-0 border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)] overflow-hidden">
        <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
          <h3 className="text-[14.5px] font-bold text-[#131C29]">Dossiers déjà imputés</h3>
          <div className="flex-1" />
          <Badge text={faits.length} cls="gr" />
        </div>

        <div className="p-[18px]">
          {faits.length === 0 ? (
            <div className="text-center py-[40px] px-5 text-[#5A6B80] text-[13px]">
              Aucun dossier imputé
            </div>
          ) : (
            faits.map((d) => <LgnFait key={d.id} d={d} />)
          )}
        </div>
      </Card>
    </div>
  )
}

