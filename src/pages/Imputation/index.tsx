import { useState } from 'react'
import { Download, Loader2, Upload, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
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
import { ImputationImportDialog } from './UI/ImputationImportDialog'
import { useImputation } from './hooks/useImputation'
import { useImputationExcel } from './hooks/useImputationExcel'
import { axiosInstance } from '@/constants/axiosInstance'
import { WORKFLOW_ADVANCE_DISABLED } from '@/constants/devFlags'
import { useAdvanceWorkflow } from '@/pages/Projets/hooks/useAdvanceWorkflow'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function ImputationPage() {
  const { 
    attente, 
    faits,
    projets,
    agences, 
    guichets,
    selectedGuichetId,
    setSelectedGuichetId,
    isLoading,
    selectedIds,
    selectedProjets,
    toggleSelection,
    toggleAllSelection,
    handleBulkImputation,
    isBulkImputing
  } = useImputation()

  const { advance } = useAdvanceWorkflow()
  const queryClient = useQueryClient()

  const {
    fileInputRef,
    downloadCanvas,
    openFilePicker,
    handleFileChange,
    preview,
    clearPreview,
    isProcessing,
  } = useImputationExcel({ attente, agences, allProjets: projets })

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

  const onImputerAgence = () => {
    if (!selectedAgence) return
    handleBulkImputation(Number(selectedAgence))
  }

  const onConserverDirection = () => {
    handleBulkImputation(null)
  }

  /**
   * Confirme l'imputation depuis l'import Excel.
   * Les projets sont groupés par agence_id pour minimiser les appels.
   */
  const onConfirmExcelImport = async (
    grouped: { agence_id: number | null; projetIds: number[] }[]
  ) => {
    const projetsCibles = grouped.flatMap(g =>
      g.projetIds.map(id => ({ id, agence_id: g.agence_id }))
    )

    await Promise.all(
      projetsCibles.map(async ({ id, agence_id }) => {
        const projet = projets.find(p => p.id === id)
        if (!projet) return

        if (agence_id !== null && !WORKFLOW_ADVANCE_DISABLED) {
          try {
            await axiosInstance.patch(`/projets/${id}`, { agence_id })
          } catch {
            await axiosInstance.put(`/projets/${id}`, { agence_id })
          }
        }

        if (projet.workflow_instance) {
          await advance({ projet, action: 'IMPUTER' })
        }
      })
    )

    queryClient.invalidateQueries({ queryKey: ['projets'] })
    toast.success(`${projetsCibles.length} dossier(s) imputé(s) via l'import Excel`)
  }

  return (
    <div className="space-y-5">
      {/* Input fichier caché pour l'import Excel */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Dialog de prévisualisation import Excel */}
      {preview && (
        <ImputationImportDialog
          open={true}
          rows={preview}
          onClose={clearPreview}
          onConfirm={onConfirmExcelImport}
        />
      )}

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

      {/* Filtres globaux */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-[#E5EAF1] shadow-sm">
        <span className="text-[13.5px] font-medium text-[#5A6B80]">Filtrer par guichet :</span>
        <Select value={selectedGuichetId} onValueChange={setSelectedGuichetId}>
          <SelectTrigger className="w-[280px] h-[36px] bg-white border-[#cdd6e2]">
            <SelectValue placeholder="Tous les guichets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les guichets</SelectItem>
            {guichets.map(g => (
              <SelectItem key={g.id} value={g.id.toString()}>
                {g.libelle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Card 1 : Dossiers approuvés à imputer */}
      <Card className="p-0 border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)] overflow-hidden">
        <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
          <h3 className="text-[14.5px] font-bold text-[#131C29]">Dossiers approuvés à imputer</h3>
          <div className="flex-1" />
          <Badge text={attente.length} cls="am" />

          {/* Boutons d'action */}
          <div className="flex items-center gap-2 ml-2">
            {attente.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-[32px] text-[12.5px] border-[#cdd6e2] text-[#5A6B80] hover:bg-[#f1f4f8]"
                onClick={() => toggleAllSelection(!allSelected)}
              >
                {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
              </Button>
            )}
            
            <div className="w-[1px] h-4 bg-[#cdd6e2] mx-1" /> {/* Séparateur */}

            <Button
              variant="outline"
              size="sm"
              className="h-[32px] text-[12.5px] border-[#cdd6e2] text-[#5A6B80] hover:bg-[#f1f4f8] gap-1.5"
              onClick={downloadCanvas}
              title="Télécharger le canevas Excel"
            >
              <Download size={13} />
              Canevas
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-[32px] text-[12.5px] border-[#E7722B] text-[#E7722B] hover:bg-[#FFF8F3] gap-1.5"
              onClick={openFilePicker}
              disabled={isProcessing}
              title="Importer un fichier Excel rempli"
            >
              {isProcessing ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
              Importer Excel
            </Button>
          </div>
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
