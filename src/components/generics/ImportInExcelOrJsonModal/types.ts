import type { ReactNode } from 'react'
import type { GenericTemplateConfig } from '@/helpers/genericExcel'

export interface ImportRowBase {
  index: number
  isValid: boolean
  error?: string
}

export interface ImportColumnDef<TRow extends ImportRowBase> {
  header: string
  accessorKey?: keyof TRow
  cell?: (row: TRow, index: number) => ReactNode
  align?: 'left' | 'center' | 'right'
  className?: string
  width?: string
}

export interface FieldGuideItem {
  name: string
  description?: string
  required?: boolean
}

export interface FieldGuideSection {
  title: string
  items: FieldGuideItem[]
}

export interface ImportInExcelOrJsonModalProps<TRow extends ImportRowBase> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  entityName?: string

  // Fonction d'analyse d'un fichier brut (.xlsx, .xls ou .json)
  onParseFile: (file: File) => Promise<TRow[]>

  // Exécution de l'importation pour les lignes valides
  onImportRows: (validRows: TRow[]) => Promise<void>

  // Téléchargement du modèle (custom ou basé sur templateConfig)
  onDownloadTemplate?: (type: 'xlsx' | 'json') => Promise<void> | void
  templateConfig?: GenericTemplateConfig

  // Documentation / guide des colonnes
  guideSections?: FieldGuideSection[]

  // Colonnes du tableau de prévisualisation
  columns: ImportColumnDef<TRow>[]

  // Extensions acceptées (par défaut: ".xlsx,.xls,.json")
  accept?: string
}
