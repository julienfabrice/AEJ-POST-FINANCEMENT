import { Download, FileSpreadsheet, FileText, ChevronDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ExportColumn } from '../ExportPdfButton'
export type { ExportColumn }
import { useExportPdfButton } from '../ExportPdfButton/useExportPdfButton'
import { useExportExcelButton } from '../ExportExcelButton/useExportExcelButton'

export interface ExportButtonProps<T> {
  data: T[]
  columns: ExportColumn<T>[]
  fileName?: string
  title?: string
  subtitle?: string
  sheetName?: string
  disabled?: boolean
  className?: string
  label?: string
}

export function ExportButton<T>({
  data,
  columns,
  fileName = 'export',
  title = 'Liste des données',
  subtitle = 'Plateforme des Guichets Opérationnels - AEJ',
  sheetName = 'Données',
  disabled = false,
  className,
  label = 'Exporter',
}: ExportButtonProps<T>) {
  const cleanBaseName = fileName.replace(/\.(pdf|xlsx|xls)$/i, '')

  const { isExporting: isExportingPdf, handleExport: handleExportPdf } = useExportPdfButton({
    data,
    columns,
    fileName: `${cleanBaseName}.pdf`,
    title,
    subtitle,
  })

  const { isExporting: isExportingExcel, handleExport: handleExportExcel } = useExportExcelButton({
    data,
    columns,
    fileName: `${cleanBaseName}.xlsx`,
    sheetName,
    title,
  })

  const isExporting = isExportingPdf || isExportingExcel

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || isExporting || !data.length}
          className={className}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#E7722B]" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {label}
          <ChevronDown className="w-3.5 h-3.5 ml-1.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg border border-slate-200">
        <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer flex items-center py-2">
          <FileSpreadsheet className="w-4 h-4 mr-2.5 text-emerald-600" />
          <span className="font-medium text-slate-700 text-xs">Format Excel (.xlsx)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPdf} className="cursor-pointer flex items-center py-2">
          <FileText className="w-4 h-4 mr-2.5 text-red-600" />
          <span className="font-medium text-slate-700 text-xs">Format PDF (.pdf)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
