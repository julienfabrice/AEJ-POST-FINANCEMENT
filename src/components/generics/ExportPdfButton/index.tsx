import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useExportPdfButton } from './useExportPdfButton'

export interface ExportColumn<T> {
  header: string
  accessor: (item: T) => string | number
}

interface ExportPdfButtonProps<T> {
  data: T[]
  columns: ExportColumn<T>[]
  fileName?: string
  title?: string
  subtitle?: string
  disabled?: boolean
  className?: string
}

export function ExportPdfButton<T>({
  data,
  columns,
  fileName = 'export.pdf',
  title = 'Liste des données',
  subtitle = 'Plateforme des Guichets Opérationnels - AEJ',
  disabled = false,
  className,
}: ExportPdfButtonProps<T>) {
  const { isExporting, handleExport } = useExportPdfButton({
    data,
    columns,
    fileName,
    title,
    subtitle,
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
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      Exporter
    </Button>
  )
}
