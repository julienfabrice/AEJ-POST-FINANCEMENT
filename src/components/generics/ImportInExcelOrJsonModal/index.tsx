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
import { cn } from '@/lib/utils'
import type { ImportRowBase, ImportInExcelOrJsonModalProps } from './types'
import { useImportInExcelOrJsonModal } from './useImportInExcelOrJsonModal'

export function ImportInExcelOrJsonModal<TRow extends ImportRowBase>({
  open,
  onOpenChange,
  title = 'Importer des données',
  description = 'Importez des données par lot via un fichier Excel (.xlsx, .xls) ou JSON (.json).',
  entityName = 'élément',
  onParseFile,
  onImportRows,
  onDownloadTemplate,
  templateConfig,
  guideSections,
  columns,
  accept = '.xlsx,.xls,.json',
}: ImportInExcelOrJsonModalProps<TRow>) {
  const {
    fileInputRef,
    file,
    rows,
    isParsing,
    isImporting,
    isDragging,
    validRows,
    invalidRows,
    resetState,
    handleClose,
    openFilePicker,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDownloadTemplate,
    handleExecuteImport,
  } = useImportInExcelOrJsonModal<TRow>({
    onOpenChange,
    onParseFile,
    onImportRows,
    onDownloadTemplate,
    templateConfig,
  })

  const hasTemplates = Boolean(onDownloadTemplate || templateConfig)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#E7722B]" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />

          {!file ? (
            <div className="space-y-4">
              {/* Drop area */}
              <div
                onClick={openFilePicker}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  'border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors',
                  isDragging
                    ? 'border-[#E7722B] bg-[#FFF8F3]'
                    : 'border-slate-200 hover:border-[#E7722B] bg-slate-50/50 hover:bg-[#FFF8F3]/50',
                )}
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
              {hasTemplates && (
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
                      Modèle Excel (.xlsx)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadTemplate('json')}
                      className="h-8 text-xs cursor-pointer bg-white"
                    >
                      <FileJson className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                      Modèle JSON (.json)
                    </Button>
                  </div>
                </div>
              )}

              {/* Guide des colonnes attendues */}
              {guideSections && guideSections.length > 0 && (
                <div className="rounded-lg border border-slate-200 p-4 bg-white text-xs space-y-3">
                  <p className="font-semibold text-slate-800">
                    Structure et colonnes attendues :
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                    {guideSections.map((sec) => (
                      <div key={sec.title} className="space-y-1">
                        <p className="font-medium text-slate-700 underline">{sec.title} :</p>
                        <ul className="list-disc list-inside space-y-0.5">
                          {sec.items.map((it) => (
                            <li key={it.name}>
                              <b>{it.name}</b>
                              {it.description ? ` : ${it.description}` : ''}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                          <th className="text-left px-3 py-2 font-semibold text-slate-600 w-16">Ligne</th>
                          {columns.map((col, idx) => (
                            <th
                              key={idx}
                              style={{ width: col.width }}
                              className={cn(
                                'px-3 py-2 font-semibold text-slate-600',
                                col.align === 'right'
                                  ? 'text-right'
                                  : col.align === 'center'
                                  ? 'text-center'
                                  : 'text-left',
                                col.className,
                              )}
                            >
                              {col.header}
                            </th>
                          ))}
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
                                <span
                                  className="inline-flex items-center gap-1 text-red-600 font-semibold"
                                  title={row.error}
                                >
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  #{row.index}
                                </span>
                              )}
                            </td>
                            {columns.map((col, cIdx) => {
                              const rendered = col.cell
                                ? col.cell(row, row.index)
                                : col.accessorKey
                                ? String(row[col.accessorKey] ?? '—')
                                : '—'

                              return (
                                <td
                                  key={cIdx}
                                  className={cn(
                                    'px-3 py-2',
                                    col.align === 'right'
                                      ? 'text-right'
                                      : col.align === 'center'
                                      ? 'text-center'
                                      : 'text-left',
                                    col.className,
                                  )}
                                >
                                  {rendered}
                                </td>
                              )
                            })}
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
                Importer {validRows.length > 0 ? `(${validRows.length} ${entityName}s)` : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export type * from './types'
