import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileUp, FolderOpen, Loader2, X, Download } from 'lucide-react'
import { useGetDocuments, useUploadDocumentMutation, type DOCUMENT_T } from '@/services/documents.services'
import { DocumentPickerModal, FileTypeIcon } from './DocumentPickerModal'
import { cn } from '@/lib/utils'

export interface DocumentUploadOrPickerProps {
  /** Chemin ou URL du document sélectionné/téléversé */
  value?: string | null
  /** Callback appelée avec le path/url du document (et le document complet si sélectionné depuis l'existant) */
  onChange: (path: string, document?: DOCUMENT_T | null) => void
  /** ID du micro-projet pour filtrer les documents existants et lier l'upload */
  microProjetId?: number | null
  /** Dossier de destination lors de l'upload (ex: 'Remboursements', 'Workflow', etc.) */
  folder?: string
  /** Types de fichiers acceptés dans l'input file */
  accept?: string
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function DocumentUploadOrPicker({
  value,
  onChange,
  microProjetId,
  folder = 'Documents',
  accept = '.pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx',
  disabled = false,
  className,
}: DocumentUploadOrPickerProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'existing'>('upload')
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState<string>('')

  const { data: existingDocs = [], isLoading: isLoadingDocs } = useGetDocuments(
    microProjetId ? Number(microProjetId) : undefined
  )
  const uploadMutation = useUploadDocumentMutation()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFileName(file.name)
    setIsUploading(true)
    try {
      const res = await uploadMutation.mutateAsync({
        file,
        folder,
        micro_projet_id: microProjetId ? String(microProjetId) : '0',
      })
      const path = res?.path ?? res?.data?.path ?? res?.url ?? res?.data?.url ?? res?.file_path ?? file.name
      onChange(path, null)
    } catch (error) {
      console.error("Erreur lors de l'upload du document :", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDocumentSelect = (doc: DOCUMENT_T) => {
    setSelectedFileName(doc.name)
    onChange(doc.path || doc.url, doc)
    setIsPickerOpen(false)
  }

  const handleClear = () => {
    onChange('', null)
    setSelectedFileName('')
  }

  const displayFileName = selectedFileName || (value ? value.split('/').pop() : '')

  return (
    <div className={cn('space-y-2', className)}>
      {/* Si un document est déjà sélectionné / renseigné */}
      {value ? (
        <div className="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <FileTypeIcon type={value.endsWith('.pdf') ? 'application/pdf' : undefined} className="h-4 w-4 shrink-0" />
            <span className="truncate font-medium text-slate-700" title={value}>
              {displayFileName}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {value.startsWith('http') && (
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-[#E7722B] transition-colors p-1"
                title="Télécharger / Voir"
              >
                <Download className="h-3.5 w-3.5" />
              </a>
            )}
            {!disabled && (
              <button
                type="button"
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                title="Supprimer la sélection"
                onClick={handleClear}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Sélecteur par onglets : Upload direct ou Sélection existant */
        <div className="space-y-2">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'existing')}>
            <TabsList className="h-8 text-xs w-full grid grid-cols-2">
              <TabsTrigger value="upload" className="h-6 px-2 text-xs gap-1.5" disabled={disabled || isUploading}>
                <FileUp className="h-3 w-3" /> Nouveau fichier
              </TabsTrigger>
              <TabsTrigger value="existing" className="h-6 px-2 text-xs gap-1.5" disabled={disabled || isUploading}>
                <FolderOpen className="h-3 w-3" /> Document existant
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-2 space-y-1.5">
              <Input
                type="file"
                accept={accept}
                disabled={disabled || isUploading}
                onChange={handleFileUpload}
                className="cursor-pointer text-xs h-9"
              />
              {isUploading && (
                <div className="flex items-center gap-1.5 text-xs text-[#E7722B]">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Téléversement en cours…</span>
                </div>
              )}
            </TabsContent>

            <TabsContent value="existing" className="mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-xs text-slate-600 h-9"
                disabled={disabled || isUploading}
                onClick={() => setIsPickerOpen(true)}
              >
                <FolderOpen className="h-3.5 w-3.5 text-slate-400" />
                <span>Parcourir les documents déjà téléversés…</span>
              </Button>

              <DocumentPickerModal
                open={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                documents={existingDocs}
                isLoading={isLoadingDocs}
                onSelect={handleDocumentSelect}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
