
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useImportRepartitionDialog } from '../hooks/useImportRepartitionDialog'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { DocumentUploadOrPicker } from '@/components/generics/DocumentUploadOrPicker'
import { money } from '@/helpers/money'

interface ImportRepartitionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projetsEligibles: MICRO_PROJET_T[]
  onImported: (projetIds: string[], source: string | File) => void
}

export function ImportRepartitionDialog({
  open,
  onOpenChange,
  projetsEligibles,
  onImported,
}: ImportRepartitionDialogProps) {
  const {
    step,
    reconnus,
    inconnus,
    selectedIds,
    error,
    uploadedFile,
    resetState,
    toggleSelection,
    handleFileChange,
  } = useImportRepartitionDialog(projetsEligibles)

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) resetState()
    onOpenChange(newOpen)
  }

  const handleValidate = () => {
    onImported(Array.from(selectedIds), uploadedFile as string | File)
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0">
        <div className="p-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-lg">Importer le fichier de répartition</DialogTitle>
            <DialogDescription className="text-sm mt-1.5">
              Le système rapproche chaque ligne du fichier avec le dossier correspondant grâce à l'ID Projet.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 overflow-y-auto flex-1 min-h-[300px]">
          {step === 'idle' || step === 'parsing' ? (
            <div className="flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex gap-2 items-start">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="bg-white rounded-md border p-4">
                <DocumentUploadOrPicker
                  value={typeof uploadedFile === 'string' ? uploadedFile : uploadedFile?.name}
                  onChange={handleFileChange}
                  folder="Répartition"
                  accept=".xlsx,.xls"
                  localOnly={true}
                />
              </div>

              <div className="bg-slate-50 rounded-md p-4 text-sm text-slate-600 border">
                <span className="font-semibold text-slate-700 block mb-2">Colonnes attendues :</span>
                <div className="flex flex-wrap gap-2">
                  {['ID Projet', 'Nom', 'Prénoms', 'Montant sollicité', 'Partenaire financier'].map((col) => (
                    <span key={col} className="bg-white border px-2 py-1 rounded text-xs font-mono">
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {inconnus.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-amber-600 mb-3">
                    <AlertTriangle className="w-5 h-5" />
                    <h4 className="font-semibold text-sm">Lignes non reconnues ({inconnus.length})</h4>
                  </div>
                  <div className="border border-amber-100 rounded-md bg-amber-50/50 overflow-hidden max-h-[150px] overflow-y-auto">
                    {inconnus.map((inc, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 text-sm border-b border-amber-100 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-amber-700">{inc.code || 'VIDE'}</span>
                          <span className="text-slate-500">
                            — {inc.row.Nom} {inc.row.Prénoms}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-emerald-600 mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <h4 className="font-semibold text-sm">Lignes reconnues ({reconnus.length})</h4>
                </div>
                {reconnus.length === 0 ? (
                  <div className="text-sm text-slate-500 italic p-4 text-center border rounded-md">
                    Aucune ligne reconnue
                  </div>
                ) : (
                  <div className="border rounded-md divide-y overflow-hidden max-h-[300px] overflow-y-auto">
                    {reconnus.map((rec) => {
                      const p = rec.projet
                      const isSelected = selectedIds.has(p.id.toString())
                      return (
                        <label
                          key={p.id}
                          className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelection(p.id.toString())}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <b className="text-[13px] font-mono">{p.code}</b>
                              <span className="text-[13px] truncate text-slate-700">— {p.intitule}</span>
                            </div>
                            <div className="text-[12px] text-slate-500 mt-0.5">
                              {p.promoteur?.nom} {p.promoteur?.prenom} · {p.agence?.nom}
                            </div>
                          </div>
                          <span className="text-[13px] font-mono font-semibold text-slate-700 shrink-0">
                            {money(Number(p.montant_total) || 0)}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-slate-50/50">
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => handleOpenChange(false)}>
              Annuler
            </Button>
            <Button
              disabled={step !== 'done' || selectedIds.size === 0}
              onClick={handleValidate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Rattacher au lot ({selectedIds.size})
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
