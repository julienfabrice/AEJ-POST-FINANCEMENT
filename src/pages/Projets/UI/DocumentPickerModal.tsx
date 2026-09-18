import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  FileText,
  FileImage,
  FileSpreadsheet,
  File,
  Info,
  Download,
  Check,
  Search,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DOCUMENT_T } from '@/services/documents.services'

// ─── Icône selon le type MIME ─────────────────────────────────────────────────
function FileTypeIcon({ type, className }: { type: string; className?: string }) {
  if (type.startsWith('image/'))
    return <FileImage className={cn('text-blue-400', className)} />
  if (type === 'application/pdf')
    return <FileText className={cn('text-red-400', className)} />
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv'))
    return <FileSpreadsheet className={cn('text-green-500', className)} />
  return <File className={cn('text-slate-400', className)} />
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Panel d'info latéral ─────────────────────────────────────────────────────
interface InfoPanelProps {
  doc: DOCUMENT_T
}
function InfoPanel({ doc }: InfoPanelProps) {
  return (
    <div className="w-56 shrink-0 border-l border-slate-200 bg-slate-50 p-4 space-y-3 text-sm">
      <div className="flex flex-col items-center gap-2 pb-3 border-b border-slate-200">
        <FileTypeIcon type={doc.type} className="h-10 w-10" />
        <p className="font-medium text-slate-700 text-center break-all">{doc.name}</p>
      </div>
      <div className="space-y-1.5 text-xs text-slate-500">
        <p><span className="font-semibold">Type :</span> {doc.type}</p>
        <p><span className="font-semibold">Taille :</span> {formatBytes(doc.size)}</p>
        <p><span className="font-semibold">Ajouté le :</span> {formatDate(doc.created_at)}</p>
        {doc.created_by && (
          <p>
            <span className="font-semibold">Par :</span>{' '}
            {doc.created_by.prenom} {doc.created_by.nom}
          </p>
        )}
      </div>
      <a
        href={doc.url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 text-xs text-[#E7722B] hover:underline"
      >
        <Download className="h-3.5 w-3.5" />
        Visualiser / Télécharger
      </a>
    </div>
  )
}

// ─── Composant principal ──────────────────────────────────────────────────────
interface DocumentPickerModalProps {
  open: boolean
  onClose: () => void
  documents: DOCUMENT_T[]
  isLoading: boolean
  selectedDocument: DOCUMENT_T | null
  onSelect: (doc: DOCUMENT_T) => void
}

export function DocumentPickerModal({
  open,
  onClose,
  documents,
  isLoading,
  selectedDocument,
  onSelect,
}: DocumentPickerModalProps) {
  const [search, setSearch] = useState('')
  const [previewDoc, setPreviewDoc] = useState<DOCUMENT_T | null>(null)

  const filtered = documents.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (doc: DOCUMENT_T) => {
    onSelect(doc)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-4 pb-3 border-b border-slate-200">
          <DialogTitle className="text-base">Sélectionner un document</DialogTitle>
        </DialogHeader>

        <div className="flex h-[420px]">
          {/* Zone principale */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Barre de recherche */}
            <div className="px-4 py-2 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  placeholder="Rechercher un document…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
            </div>

            {/* Grille de fichiers */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full gap-2 text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">Chargement…</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  Aucun document trouvé.
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {filtered.map((doc) => {
                    const isSelected = selectedDocument?.id === doc.id
                    const isPreviewing = previewDoc?.id === doc.id

                    return (
                      <TooltipProvider key={doc.id} delayDuration={0}>
                        <div
                          className={cn(
                            'relative group flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 cursor-pointer transition-all',
                            isSelected
                              ? 'border-[#E7722B] bg-orange-50'
                              : isPreviewing
                              ? 'border-blue-300 bg-blue-50'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          )}
                          onClick={() => handleSelect(doc)}
                        >
                          {/* Badge sélectionné */}
                          {isSelected && (
                            <span className="absolute top-1.5 left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E7722B]">
                              <Check className="h-2.5 w-2.5 text-white" />
                            </span>
                          )}

                          {/* Bouton info */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full flex items-center justify-center bg-slate-100 hover:bg-blue-100 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPreviewDoc(isPreviewing ? null : doc)
                                }}
                              >
                                <Info className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">
                              Infos & téléchargement
                            </TooltipContent>
                          </Tooltip>

                          {/* Icône du fichier */}
                          <FileTypeIcon type={doc.type} className="h-10 w-10" />

                          {/* Nom du fichier */}
                          <p
                            className="text-[11px] text-center text-slate-600 leading-tight line-clamp-2 w-full"
                            title={doc.name}
                          >
                            {doc.name}
                          </p>

                          {/* Taille */}
                          <Badge
                            variant="secondary"
                            className="text-[9px] h-4 px-1.5 font-normal"
                          >
                            {formatBytes(doc.size)}
                          </Badge>
                        </div>
                      </TooltipProvider>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Panel d'info (affiché si un doc est survolé avec le bouton i) */}
          {previewDoc && <InfoPanel doc={previewDoc} />}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 text-xs text-slate-400">
          <span>{filtered.length} document(s)</span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
