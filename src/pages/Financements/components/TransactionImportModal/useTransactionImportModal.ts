import { useState, useRef, useMemo, useCallback } from 'react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import {
  type ParsedTransactionRow,
  parseTransactionFile,
  downloadTransactionTemplate,
} from '@/helpers/transactionExcel'

export function useTransactionImportModal(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [rows, setRows] = useState<ParsedTransactionRow[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const validRows = useMemo(() => rows.filter((r) => r.isValid), [rows])
  const invalidRows = useMemo(() => rows.filter((r) => !r.isValid), [rows])

  const resetState = useCallback(() => {
    setFile(null)
    setRows([])
    setIsParsing(false)
    setIsImporting(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const handleClose = useCallback(() => {
    if (isImporting) return
    resetState()
    onOpenChange(false)
  }, [isImporting, resetState, onOpenChange])

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const parseFile = useCallback(async (selectedFile: File) => {
    setFile(selectedFile)
    setIsParsing(true)
    try {
      const parsedRows = await parseTransactionFile(selectedFile)
      setRows(parsedRows)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la lecture du fichier'
      toast.error(msg)
      setFile(null)
      setRows([])
    } finally {
      setIsParsing(false)
    }
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (selected) parseFile(selected)
    },
    [parseFile],
  )

  const handleDownloadTemplate = useCallback(async (type: 'xlsx' | 'json') => {
    try {
      await downloadTransactionTemplate(type)
    } catch (err) {
      console.error('Erreur lors du téléchargement du modèle', err)
      toast.error('Erreur lors du téléchargement du modèle.')
    }
  }, [])

  const handleExecuteImport = useCallback(async () => {
    if (validRows.length === 0) return
    setIsImporting(true)

    let successCount = 0
    let failureCount = 0

    for (const row of validRows) {
      try {
        await axiosInstance.post('/transactions', {
          micro_projet_id: row.micro_projet_id,
          categorie_id: row.categorie_id,
          libelle: row.libelle,
          montant: row.montant,
          type: row.type,
          date: row.date || '',
          mode_paiement: row.mode_paiement || '',
          reference: row.reference || '',
          statut: row.statut,
          observations: row.observations || '',
        })
        successCount++
      } catch (err) {
        console.error('Erreur importation dépense ligne ' + row.index, err)
        failureCount++
      }
    }

    queryClient.invalidateQueries({ queryKey: ['transactions'] })

    if (successCount > 0) {
      toast.success(`${successCount} dépense(s) importée(s) avec succès !`)
    }
    if (failureCount > 0) {
      toast.error(`${failureCount} dépense(s) n'ont pas pu être importées.`)
    }

    setIsImporting(false)
    handleClose()
  }, [validRows, queryClient, handleClose])

  return {
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
  }
}
