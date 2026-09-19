import { useState } from 'react'
import { toast } from 'sonner'
import { parseAmortissementExcel } from '@/helpers/excelParser'
import type { AMORTISSEMENT_LIGNE_T } from '@/types'

export function useAmortissementExcelUpload() {
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [lignesAmortissement, setLignesAmortissement] = useState<AMORTISSEMENT_LIGNE_T[]>([])
  const [isParsingExcel, setIsParsingExcel] = useState(false)

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setExcelFile(file)
    setIsParsingExcel(true)

    try {
      const parsedRows = await parseAmortissementExcel(file)
      setLignesAmortissement(parsedRows)
      if (parsedRows.length > 0) {
        toast.success(`${parsedRows.length} lignes d'amortissement chargées avec succès.`)
      } else {
        toast.warning("Aucune ligne d'amortissement trouvée. Le fichier est peut-être vide ou mal formaté.")
      }
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de la lecture du fichier Excel.")
    } finally {
      setIsParsingExcel(false)
    }
  }

  const resetAmortissement = () => {
    setExcelFile(null)
    setLignesAmortissement([])
  }

  return {
    excelFile,
    lignesAmortissement,
    isParsingExcel,
    handleExcelUpload,
    resetAmortissement,
  }
}
