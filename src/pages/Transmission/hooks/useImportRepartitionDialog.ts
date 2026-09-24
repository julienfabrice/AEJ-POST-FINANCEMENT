import { useState } from 'react'
import { useImportRepartition, type ExcelRow } from './useImportRepartition'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function useImportRepartitionDialog(projetsEligibles: MICRO_PROJET_T[]) {
  const { parseFile } = useImportRepartition(projetsEligibles)
  const [step, setStep] = useState<'idle' | 'parsing' | 'done'>('idle')
  const [reconnus, setReconnus] = useState<{ projet: MICRO_PROJET_T; row: ExcelRow }[]>([])
  const [inconnus, setInconnus] = useState<{ code: string; row: ExcelRow }[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<string | File>('')

  const resetState = () => {
    setStep('idle')
    setReconnus([])
    setInconnus([])
    setSelectedIds(new Set())
    setError(null)
    setUploadedFile('')
  }

  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const handleFileChange = async (path: string, _doc?: any, file?: File | null) => {
    if (!path && !file) {
      resetState()
      return
    }
    
    const source = file || path
    setUploadedFile(source)
    setStep('parsing')
    setError(null)
    
    try {
      const res = await parseFile(source)
      setReconnus(res.reconnus)
      setInconnus(res.inconnus)
      setSelectedIds(new Set(res.reconnus.map((r) => r.projet.id.toString())))
      setStep('done')
    } catch (err) {
      console.error(err)
      setError("Erreur lors de la lecture du fichier Excel. Assurez-vous qu'il s'agit d'un format valide.")
      setStep('idle')
    }
  }

  return {
    step,
    reconnus,
    inconnus,
    selectedIds,
    error,
    uploadedFile,
    resetState,
    toggleSelection,
    handleFileChange,
  }
}
