import { useState, useRef, useMemo, useCallback } from 'react'
import { toast } from 'sonner'
import { generateAndDownloadTemplate } from '@/helpers/genericExcel'
import type { ImportRowBase, ImportInExcelOrJsonModalProps } from './types'

export function useImportInExcelOrJsonModal<TRow extends ImportRowBase>({
  onOpenChange,
  onParseFile,
  onImportRows,
  onDownloadTemplate,
  templateConfig,
}: Pick<
  ImportInExcelOrJsonModalProps<TRow>,
  'onOpenChange' | 'onParseFile' | 'onImportRows' | 'onDownloadTemplate' | 'templateConfig'
>) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [rows, setRows] = useState<TRow[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const validRows = useMemo(() => rows.filter((r) => r.isValid), [rows])
  const invalidRows = useMemo(() => rows.filter((r) => !r.isValid), [rows])

  const resetState = useCallback(() => {
    setFile(null)
    setRows([])
    setIsParsing(false)
    setIsImporting(false)
    setIsDragging(false)
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

  const parseFile = useCallback(
    async (selectedFile: File) => {
      setFile(selectedFile)
      setIsParsing(true)
      try {
        const parsedRows = await onParseFile(selectedFile)
        setRows(parsedRows)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erreur lors de la lecture du fichier'
        toast.error(msg)
        setFile(null)
        setRows([])
      } finally {
        setIsParsing(false)
      }
    },
    [onParseFile],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (selected) parseFile(selected)
    },
    [parseFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files?.[0]
      if (droppedFile) {
        parseFile(droppedFile)
      }
    },
    [parseFile],
  )

  const handleDownloadTemplate = useCallback(
    async (type: 'xlsx' | 'json') => {
      try {
        if (onDownloadTemplate) {
          await onDownloadTemplate(type)
        } else if (templateConfig) {
          await generateAndDownloadTemplate(templateConfig, type)
        } else {
          toast.error('Aucune configuration de modèle définie.')
        }
      } catch (err) {
        console.error('Erreur lors du téléchargement du modèle', err)
        toast.error('Erreur lors du téléchargement du modèle.')
      }
    },
    [onDownloadTemplate, templateConfig],
  )

  const handleExecuteImport = useCallback(async () => {
    if (validRows.length === 0) return
    setIsImporting(true)
    try {
      await onImportRows(validRows)
      handleClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'importation"
      toast.error(msg)
    } finally {
      setIsImporting(false)
    }
  }, [validRows, onImportRows, handleClose])

  return {
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
  }
}
