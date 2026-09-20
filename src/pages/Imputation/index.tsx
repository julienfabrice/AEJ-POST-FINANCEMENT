import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

  const onImputer = () => {
    if (!selectedAgence) return
    const agenceId = selectedAgence === 'DIRECTION' ? null : Number(selectedAgence)
    handleBulkImputation(agenceId)
  }

  return (
    <div className="space-y-5">
      {/* Panneau de configuration d'imputation en masse */}
      {selectedIds.length > 0 && (
        <Card className="p-4 border-[#E7722B] bg-[#FFF8F3] shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between sticky top-4 z-10">
          <div className="flex items-center gap-2">
            <Badge text={selectedIds.length} cls="am" />
            <span className="text-[14px] font-medium text-[#131C29]">
              dossier(s) sélectionné(s) pour l'imputation
            </span>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select value={selectedAgence} onValueChange={setSelectedAgence}>
              <SelectTrigger className="w-[240px] h-[36px] bg-white border-[#cdd6e2]">
                <SelectValue placeholder="Sélectionner la destination..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DIRECTION">Conserver à la Direction</SelectItem>
                {agences.map(ag => (
                  <SelectItem key={ag.id} value={ag.id.toString()}>
                    Imputer à {ag.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              className="h-[36px] bg-[#131C29] hover:bg-[#1f2d40]"
              disabled={!selectedAgence || isBulkImputing}
              onClick={onImputer}
            >
              {isBulkImputing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Valider l'imputation
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

