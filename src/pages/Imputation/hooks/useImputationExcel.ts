import { useRef, useState, useCallback } from 'react'
import { toast } from 'sonner'
import {
  generateImputationCanvas,
  parseImputationExcel,
  type ImportedRow,
} from '@/helpers/imputationExcel'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import type { AGENCE_REGIONALE_T } from '@/types'

interface UseImputationExcelParams {
  attente: MICRO_PROJET_T[]
  agences: AGENCE_REGIONALE_T[]
  allProjets: MICRO_PROJET_T[]
}

export function useImputationExcel({ attente, agences, allProjets }: UseImputationExcelParams) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<ImportedRow[] | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  /** Génère et télécharge le canevas Excel */
  const downloadCanvas = useCallback(async () => {
    if (attente.length === 0) {
      toast.info('Aucun dossier à imputer pour générer le canevas.')
      return
    }
    try {
      await generateImputationCanvas(attente, agences)
      toast.success('Canevas téléchargé avec succès.')
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la génération du canevas.')
    }
  }, [attente, agences])

  /** Ouvre le sélecteur de fichier */
  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  /** Traite le fichier sélectionné */
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input pour permettre re-import du même fichier
    e.target.value = ''

    setIsProcessing(true)
    try {
      const rows = await parseImputationExcel(file, attente, agences, allProjets)
      if (rows.length === 0) {
        toast.warning('Le fichier est vide ou ne contient aucune ligne reconnue.')
        return
      }
      setPreview(rows)
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la lecture du fichier. Vérifiez le format.')
    } finally {
      setIsProcessing(false)
    }
  }, [attente, agences, allProjets])

  const clearPreview = useCallback(() => setPreview(null), [])

  return {
    fileInputRef,
    downloadCanvas,
    openFilePicker,
    handleFileChange,
    preview,
    clearPreview,
    isProcessing,
  }
}
