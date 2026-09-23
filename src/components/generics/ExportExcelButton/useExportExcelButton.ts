import { useState, useCallback } from 'react'
import ExcelJS from 'exceljs'
import dayjs from 'dayjs'
import type { ExportColumn } from '../ExportPdfButton'

interface UseExportExcelProps<T> {
  data: T[]
  columns: ExportColumn<T>[]
  fileName?: string
  sheetName?: string
  title?: string
}

export function useExportExcelButton<T>({
  data,
  columns,
  fileName = 'export.xlsx',
  sheetName = 'Données',
  title,
}: UseExportExcelProps<T>) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = useCallback(async () => {
    if (!data || !data.length) return
    setIsExporting(true)

    try {
      const workbook = new ExcelJS.Workbook()
      workbook.creator = 'Plateforme AEJ'
      workbook.created = new Date()

      const worksheet = workbook.addWorksheet(sheetName)

      let startRow = 1

      // Titre optionnel au dessus du tableau
      if (title) {
        worksheet.mergeCells(`A1:${String.fromCharCode(65 + Math.min(columns.length - 1, 25))}1`)
        const titleCell = worksheet.getCell('A1')
        titleCell.value = title
        titleCell.font = { size: 14, bold: true, color: { argb: 'FF131C29' } }
        titleCell.alignment = { vertical: 'middle', horizontal: 'left' }
        worksheet.getRow(1).height = 30

        const subCell = worksheet.getCell('A2')
        subCell.value = `Généré le ${dayjs().format('DD/MM/YYYY à HH:mm')} — ${data.length} enregistrement(s)`
        subCell.font = { size: 9, italic: true, color: { argb: 'FF5A6B80' } }
        worksheet.getRow(2).height = 18

        startRow = 4
      }

      // Définition des colonnes
      worksheet.getRow(startRow).values = columns.map((c) => c.header)
      const headerRow = worksheet.getRow(startRow)
      headerRow.height = 24
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE7722B' }, // Orange AEJ
      }
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' }

      // Remplissage des données
      data.forEach((item, rIdx) => {
        const rowValues = columns.map((col) => {
          const val = col.accessor(item)
          return val !== null && val !== undefined ? val : ''
        })
        const row = worksheet.addRow(rowValues)
        row.height = 20

        // Zébrure alternée discrète
        if (rIdx % 2 === 1) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF9FAFB' },
          }
        }

        // Bordures fines
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE5EAF1' } },
            bottom: { style: 'thin', color: { argb: 'FFE5EAF1' } },
            left: { style: 'thin', color: { argb: 'FFE5EAF1' } },
            right: { style: 'thin', color: { argb: 'FFE5EAF1' } },
          }
        })
      })

      // Bordure sur l'en-tête
      headerRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD6621A' } },
          bottom: { style: 'medium', color: { argb: 'FFD6621A' } },
          left: { style: 'thin', color: { argb: 'FFD6621A' } },
          right: { style: 'thin', color: { argb: 'FFD6621A' } },
        }
      })

      // Calcul automatique de la largeur des colonnes
      columns.forEach((col, idx) => {
        const headerLen = col.header.length
        let maxLen = headerLen

        data.forEach((item) => {
          const val = String(col.accessor(item) ?? '')
          if (val.length > maxLen) {
            maxLen = Math.min(val.length, 60)
          }
        })

        worksheet.getColumn(idx + 1).width = Math.max(maxLen + 4, 14)
      })

      // Téléchargement
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Erreur lors de l'export Excel:", err)
    } finally {
      setIsExporting(false)
    }
  }, [data, columns, fileName, sheetName, title])

  return { isExporting, handleExport }
}
