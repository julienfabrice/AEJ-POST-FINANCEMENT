import { useCallback, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useUploadDocumentMutation, type DOCUMENT_T } from '@/services/documents.services'
import { workflowInstancesServices } from '@/services/workflowInstances.services'
import { etapeDeliverablesServices } from '@/services/workflow/etapeDeliverables.services'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import type { WORKFLOW_ETAPE_DELIVERABLE_T } from '@/types/workflow.types'
import { toast } from 'sonner'

/**
 * Source d'un livrable : soit un nouveau fichier à uploader, soit un document existant.
 */
export type DeliverableSource =
  | { mode: 'upload'; file: File }
  | { mode: 'existing'; document: DOCUMENT_T }

/**
 * Hook générique pour gérer l'upload/sélection des livrables d'une étape de workflow.
 *
 * Pour chaque livrable configuré sur l'étape courante, l'utilisateur peut :
 *   - Uploader un nouveau fichier → POST /documents/upload → path, name, size, type
 *   - Sélectionner un document existant → utilise path, name, size, type directement
 *
 * Puis enregistre le livrable via POST /workflow-instances/deliverables.
 * Bloque si un livrable `is_required` n'a pas de source définie.
 */
export function useDeliverableUploads(etapeCode: string | null | undefined) {
  const user = useAuthStore((s) => s.user)
  const uploadMutation = useUploadDocumentMutation()
  const createDeliverableMutation = workflowInstancesServices.useCreateDeliverable()

  const { data: etapeDeliverables = [], isLoading: isLoadingConfig } =
    etapeDeliverablesServices.useGetEtapeDeliverables(etapeCode ?? undefined)

  // Map deliverable_code → source (nouveau fichier ou document existant)
  const [sources, setSources] = useState<Record<string, DeliverableSource | null>>({})

  const setSource = useCallback((code: string, source: DeliverableSource | null) => {
    setSources((prev) => ({ ...prev, [code]: source }))
  }, [])

  /** Raccourci : fichier brut */
  const setFile = useCallback(
    (code: string, file: File | null) => {
      setSource(code, file ? { mode: 'upload', file } : null)
    },
    [setSource]
  )

  /** Raccourci : document existant */
  const setExistingDocument = useCallback(
    (code: string, doc: DOCUMENT_T | null) => {
      setSource(code, doc ? { mode: 'existing', document: doc } : null)
    },
    [setSource]
  )

  /**
   * Vérifie que tous les livrables `is_required` ont une source définie.
   */
  const isReady = useCallback((): boolean => {
    return (etapeDeliverables as WORKFLOW_ETAPE_DELIVERABLE_T[])
      .filter((d) => d.is_required)
      .every((d) => !!sources[d.deliverable_code])
  }, [etapeDeliverables, sources])

  /**
   * Traite tous les livrables ayant une source et les enregistre.
   * À appeler avant `advance()`.
   */
  const submitDeliverables = useCallback(
    async (projet: MICRO_PROJET_T): Promise<void> => {
      const instance = projet.workflow_instance
      if (!instance) return

      const deliverables = etapeDeliverables as WORKFLOW_ETAPE_DELIVERABLE_T[]

      // Validation des livrables requis
      const missingRequired = deliverables
        .filter((d) => d.is_required && !sources[d.deliverable_code])
        .map((d) => d.deliverable_code)

      if (missingRequired.length > 0) {
        toast.error(`Documents requis manquants : ${missingRequired.join(', ')}`)
        throw new Error('Livrables requis manquants')
      }

      // Traiter uniquement les livrables avec une source définie
      const toProcess = deliverables.filter((d) => !!sources[d.deliverable_code])

      for (const deliverableConfig of toProcess) {
        const source = sources[deliverableConfig.deliverable_code]!

        let filePath: string
        let fileName: string
        let fileSize: number
        let fileType: string

        if (source.mode === 'upload') {
          // Upload du nouveau fichier
          const uploadRes = await uploadMutation.mutateAsync({
            file: source.file,
            folder: 'Workflow',
            micro_projet_id: projet.id.toString(),
          })
          filePath = uploadRes?.path ?? uploadRes?.data?.path ?? ''
          fileName = uploadRes?.name ?? source.file.name
          fileSize = uploadRes?.size ?? source.file.size
          fileType = uploadRes?.type ?? source.file.type
        } else {
          // Document existant : on récupère les infos directement
          filePath = source.document.path
          fileName = source.document.name
          fileSize = source.document.size
          fileType = source.document.type
        }

        // Enregistrer le livrable dans l'instance workflow
        await createDeliverableMutation.mutateAsync({
          workflow_instance_id: instance.id,
          deliverable_code: deliverableConfig.deliverable_code,
          file_path: filePath,
          file_name: fileName,
          file_size: fileSize,
          file_type: fileType,
          observations: null,
          produced_at: new Date().toISOString().slice(0, 10),
          produced_by_id: user?.id ?? null,
        })
      }
    },
    [etapeDeliverables, sources, uploadMutation, createDeliverableMutation, user]
  )

  const reset = useCallback(() => {
    setSources({})
  }, [])

  return {
    etapeDeliverables: etapeDeliverables as WORKFLOW_ETAPE_DELIVERABLE_T[],
    isLoadingConfig,
    sources,
    setFile,
    setExistingDocument,
    submitDeliverables,
    isSubmittingDeliverables: uploadMutation.isPending || createDeliverableMutation.isPending,
    isReady,
    reset,
  }
}
