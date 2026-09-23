import {
  Upload,
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { money } from '@/helpers/money'
import { useBudgetImportModal } from './useBudgetImportModal'

interface BudgetImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BudgetImportModal({ open, onOpenChange }: BudgetImportModalProps) {
  const {
    fileInputRef,
    file,
    rows,
    isParsing,
    isImporting,
    validRows,
    invalidRows,
    resetState,
    handleClose,
    openFilePicker,
    handleFileChange,
    handleDownloadTemplate,
    handleExecuteImport,
  } = useBudgetImportModal(onOpenChange)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#E7722B]" />
            Importer des budgets
          </DialogTitle>
          <DialogDescription>
            Importez des budgets accordés par lot via un fichier Excel (.xlsx, .xls) ou JSON (.json) conforme au formulaire.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.json"
            className="hidden"
            onChange={handleFileChange}
          />

          {!file ? (
            <div className="space-y-4">
              {/* Drop area */}
              <div
                onClick={openFilePicker}
                className="border-2 border-dashed border-slate-200 hover:border-[#E7722B] transition-colors rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-slate-50/50 hover:bg-[#FFF8F3]/50"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#E7722B]">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-800">
                    Cliquez pour choisir un fichier ou glissez-le ici
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Formats acceptés : <b>Excel (.xlsx, .xls)</b> ou <b>JSON (.json)</b>
                  </p>
                </div>
              </div>

              {/* Template download buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200 gap-2">
                <span className="text-xs text-slate-700 font-medium">Modèles complets à télécharger :</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadTemplate('xlsx')}
                    className="h-8 text-xs cursor-pointer bg-white"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    Modèle Excel complet (.xlsx)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadTemplate('json')}
                    className="h-8 text-xs cursor-pointer bg-white"
                  >
                    <FileJson className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                    Modèle JSON complet (.json)
                  </Button>
                </div>
              </div>

              {/* Colonnes attendues du formulaire */}
              <div className="rounded-lg border border-slate-200 p-4 bg-white text-xs space-y-3">
                <p className="font-semibold text-slate-800">
                  Tous les champs du formulaire pris en compte :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                  <div className="space-y-1">
                    <p className="font-medium text-slate-700 underline">Obligatoires :</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li><b>micro_projet_id</b> : ID numérique du projet</li>
                      <li><b>intitule</b> : Intitulé du budget</li>
                      <li><b>montant_accorde</b> : Montant (FCFA)</li>
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-slate-700 underline">Financement & Accord :</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li><b>devise</b> : ex. FCFA (défaut: FCFA)</li>
                      <li><b>source</b> : AFD, AEJ, BAD...</li>
                      <li><b>date_accord</b> : AAAA-MM-JJ</li>
                      <li><b>statut</b> : APPROUVE, EN_ATTENTE, NON_APPROUVE</li>
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-slate-700 underline">Convention & Déblocage :</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li><b>signature_convention</b> : SIGNEE / NON_SIGNEE</li>
                      <li><b>date_signature</b> : AAAA-MM-JJ</li>
                      <li><b>deblocage</b> : OUI / NON</li>
                      <li><b>date_deblocage</b> : AAAA-MM-JJ</li>
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-slate-700 underline">Acte & Observations :</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li><b>reception_acte_credit</b> : OUI / NON / PARTIEL</li>
                      <li><b>date_reception</b> : AAAA-MM-JJ</li>
                      <li><b>observations</b> : Remarques ou notes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info Bar */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2.5 min-w-0">
                  {file.name.endsWith('.json') ? (
                    <FileJson className="w-5 h-5 text-blue-600 shrink-0" />
                  ) : (
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} Ko</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetState}
                  disabled={isImporting}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Changer
                </Button>
              </div>

              {isParsing ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin text-[#E7722B]" />
                  <span className="text-sm">Analyse du fichier en cours...</span>
                </div>
              ) : (
                <>
                  {/* Status counts */}
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      {validRows.length} valide(s)
                    </Badge>
                    {invalidRows.length > 0 && (
                      <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {invalidRows.length} erreur(s)
                      </Badge>
                    )}
                  </div>

                  {/* Preview Table */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-[#fafbfd] border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="text-left px-3 py-2 font-semibold text-slate-600">Ligne</th>
                          <th className="text-left px-3 py-2 font-semibold text-slate-600">Projet ID</th>
                          <th className="text-left px-3 py-2 font-semibold text-slate-600">Intitulé</th>
                          <th className="text-right px-3 py-2 font-semibold text-slate-600">Montant</th>
                          <th className="text-left px-3 py-2 font-semibold text-slate-600">Approbation</th>
                          <th className="text-left px-3 py-2 font-semibold text-slate-600">Convention</th>
                          <th className="text-left px-3 py-2 font-semibold text-slate-600">Déblocage</th>
                          <th className="text-left px-3 py-2 font-semibold text-slate-600">Acte</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {rows.map((row) => (
                          <tr
                            key={row.index}
                            className={row.isValid ? 'hover:bg-slate-50' : 'bg-red-50/50'}
                          >
                            <td className="px-3 py-2 font-mono text-slate-500 whitespace-nowrap">
                              {row.isValid ? (
                                <span className="inline-flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  #{row.index}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-600 font-semibold" title={row.error}>
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  #{row.index}
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 font-mono">{row.micro_projet_id || '—'}</td>
                            <td className="px-3 py-2">
                              <span className="font-medium text-slate-800 line-clamp-1">
                                {row.intitule || '—'}
                              </span>
                              {row.error && (
                                <span className="text-[11px] text-red-600 block">{row.error}</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-right font-mono font-medium whitespace-nowrap">
                              {row.montant_accorde ? money(row.montant_accorde) : '—'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {row.statut}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`text-[11px] px-2 py-0.5 rounded-full ${row.signature_convention === 'SIGNEE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                {row.signature_convention === 'SIGNEE' ? 'Signée' : 'Non signée'}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`text-[11px] px-2 py-0.5 rounded-full ${row.deblocage ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                {row.deblocage ? 'OUI' : 'NON'}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {row.reception_acte_credit}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="border-t px-6 py-4 flex-row justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isImporting}
            className="cursor-pointer"
          >
            Annuler
          </Button>

          <Button
            type="button"
            onClick={handleExecuteImport}
            disabled={!file || validRows.length === 0 || isImporting}
            className="cursor-pointer bg-[#E7722B] text-white hover:bg-[#C85E18]"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importation en cours...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Importer {validRows.length > 0 ? `(${validRows.length})` : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
