import { FileSpreadsheet, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ExportColumn } from '../ExportPdfButton'
import { useExportExcelButton } from './useExportExcelButton'

interface ExportExcelButtonProps<T> {
  data: T[]
  columns: ExportColumn<T>[]
  fileName?: string
  sheetName?: string
  title?: string
  disabled?: boolean
  className?: string
  label?: string
}

export function ExportExcelButton<T>({
  data,
  columns,
  fileName = 'export.xlsx',
  sheetName = 'Données',
  title = 'Export des données',
  disabled = false,
  className,
  label = 'Excel',
}: ExportExcelButtonProps<T>) {
  const { isExporting, handleExport } = useExportExcelButton({
    data,
    columns,
    fileName,
    sheetName,
    title,
  })

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={disabled || isExporting || !data.length}
      className={className}
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin text-emerald-600" />
      ) : (
        <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />
      )}
      {label}
    </Button>
  )
}
