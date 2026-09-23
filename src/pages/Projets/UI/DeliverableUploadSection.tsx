import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileUp, FolderOpen, Loader2, X } from 'lucide-react'
import { useGetDocuments } from '@/services/documents.services'
import type { DOCUMENT_T } from '@/services/documents.services'
import type { WORKFLOW_ETAPE_DELIVERABLE_T } from '@/types/workflow.types'
import type { DeliverableSource } from '../hooks/useDeliverableUploads'
import { DocumentPickerModal } from './DocumentPickerModal'

interface DeliverableUploadSectionProps {
  etapeDeliverables: WORKFLOW_ETAPE_DELIVERABLE_T[]
  isLoadingConfig: boolean
  sources: Record<string, DeliverableSource | null>
  setFile: (code: string, file: File | null) => void
  setExistingDocument: (code: string, doc: DOCUMENT_T | null) => void
  /** ID du micro projet pour filtrer les documents existants */
  microProjetId?: number
}

/**
 * Section générique d'upload / sélection de livrables de workflow.
 * Pour chaque livrable configuré, l'utilisateur choisit entre :
 *   - Onglet "Nouveau fichier" : input file classique
 *   - Onglet "Document existant" : ouvre un gestionnaire de fichiers en modal
 */
export function DeliverableUploadSection({
  etapeDeliverables,
  isLoadingConfig,
  sources,
  setFile,
  setExistingDocument,
  microProjetId,
}: DeliverableUploadSectionProps) {
  const { data: existingDocs = [], isLoading: isLoadingDocs } = useGetDocuments(microProjetId)

  // Onglet actif par deliverable_code
  const [tabs, setTabs] = useState<Record<string, 'upload' | 'existing'>>({})
  // Quel picker est ouvert
  const [openPicker, setOpenPicker] = useState<string | null>(null)

  const getTab = (code: string) => tabs[code] ?? 'upload'

  if (isLoadingConfig) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Chargement des documents requis…
      </div>
    )
  }

  if (etapeDeliverables.length === 0) return null

  return (
    <div className="space-y-4 rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
        <FileUp className="h-3.5 w-3.5" />
        Documents à joindre
      </p>

      {etapeDeliverables.map((d) => {
        const source = sources[d.deliverable_code]
        const activeTab = getTab(d.deliverable_code)

        return (
          <div key={d.deliverable_code} className="space-y-2">
            {/* Label + badge requis */}
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">
                {d.deliverable_code.replace(/_/g, ' ')}
              </Label>
              {d.is_required && (
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">
                  Requis
                </Badge>
              )}
            </div>

            {/* Onglets upload / existant */}
            <Tabs
              value={activeTab}
              onValueChange={(v) => {
                setTabs((prev) => ({ ...prev, [d.deliverable_code]: v as 'upload' | 'existing' }))
                // Reset la source quand on change d'onglet
                setFile(d.deliverable_code, null)
                setExistingDocument(d.deliverable_code, null)
              }}
            >
              <TabsList className="h-8 text-xs">
                <TabsTrigger value="upload" className="h-6 px-3 text-xs gap-1.5">
                  <FileUp className="h-3 w-3" /> Nouveau fichier
                </TabsTrigger>
                <TabsTrigger value="existing" className="h-6 px-3 text-xs gap-1.5">
                  <FolderOpen className="h-3 w-3" /> Document existant
                </TabsTrigger>
              </TabsList>

              {/* Onglet : upload */}
              <TabsContent value="upload" className="mt-2">
                <Input
                  type="file"
                  className="cursor-pointer"
                  accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => setFile(d.deliverable_code, e.target.files?.[0] ?? null)}
                />
              </TabsContent>

              {/* Onglet : document existant */}
              <TabsContent value="existing" className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 text-sm text-slate-600"
                  onClick={() => setOpenPicker(d.deliverable_code)}
                >
                  <FolderOpen className="h-4 w-4 text-slate-400" />
                  {source?.mode === 'existing'
                    ? source.document.name
                    : 'Parcourir les documents du projet…'}
                </Button>

                {/* Modal gestionnaire de fichiers */}
                <DocumentPickerModal
                  open={openPicker === d.deliverable_code}
                  onClose={() => setOpenPicker(null)}
                  documents={existingDocs}
                  isLoading={isLoadingDocs}
                  selectedDocument={source?.mode === 'existing' ? source.document : null}
                  onSelect={(doc) => {
                    setExistingDocument(d.deliverable_code, doc)
                    setOpenPicker(null)
                  }}
                />
              </TabsContent>
            </Tabs>

            {/* Récapitulatif de la sélection */}
            {source && (
              <div className="flex items-center justify-between rounded border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs text-green-700">
                <span className="truncate font-medium">
                  {source.mode === 'upload' ? source.file.name : source.document.name}
                </span>
                <button
                  type="button"
                  className="ml-2 shrink-0 text-slate-400 hover:text-red-500 transition-colors"
                  onClick={() => {
                    setFile(d.deliverable_code, null)
                    setExistingDocument(d.deliverable_code, null)
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
