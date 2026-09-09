import { useState, useCallback } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import dayjs from 'dayjs'
import logoImg from '@/assets/logo.png'
import { configurationServices } from '@/services/configurations.services'
import type { ExportColumn } from './index'

interface UseExportPdfProps<T> {
  data: T[]
  columns: ExportColumn<T>[]
  fileName: string
  title: string
  subtitle: string
}

export function useExportPdfButton<T>({
  data,
  columns,
  fileName,
  title,
  subtitle,
}: UseExportPdfProps<T>) {
  const [isExporting, setIsExporting] = useState(false)
  const { data: config } = configurationServices.useGet()

  const handleExport = useCallback(async () => {
    if (!data || !data.length) return
    setIsExporting(true)

    try {
      const doc = new jsPDF('landscape')
      
      const img = new Image()
      img.src = logoImg
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })

      const pageWidth = doc.internal.pageSize.getWidth()
      const imgRatio = img.height / img.width
      const logoWidth = 40
      const logoHeight = logoWidth * imgRatio

      doc.addImage(img, 'PNG', 14, 12, logoWidth, logoHeight)

      doc.setFontSize(22)
      doc.setTextColor(19, 28, 41)
      doc.text(title, 14 + logoWidth + 10, 22)

      doc.setFontSize(10)
      doc.setTextColor(90, 107, 128)
      doc.text(subtitle, 14 + logoWidth + 10, 28)

      // Infos de contact (à droite)
      if (config) {
        doc.setFontSize(9)
        doc.setTextColor(90, 107, 128)
        let contactY = 16
        
        if (config.telephone_structure) {
          doc.text(`Tél : ${config.telephone_structure}`, pageWidth - 14, contactY, { align: 'right' })
          contactY += 5
        }
        if (config.email_structure) {
          doc.text(`Email : ${config.email_structure}`, pageWidth - 14, contactY, { align: 'right' })
          contactY += 5
        }
        if (config.adresse_sociale_structure) {
          const splitAddress = doc.splitTextToSize(config.adresse_sociale_structure, 80)
          splitAddress.forEach((line: string) => {
            doc.text(line, pageWidth - 14, contactY, { align: 'right' })
            contactY += 5
          })
        }
      }

      doc.setDrawColor(231, 114, 43)
      doc.setLineWidth(0.5)
      doc.line(14, Math.max(34, 12 + logoHeight + 4), pageWidth - 14, Math.max(34, 12 + logoHeight + 4))

      const startY = Math.max(34, 12 + logoHeight + 4) + 6

      const tableColumn = columns.map(c => c.header)
      const tableRows = data.map(item => columns.map(c => c.accessor(item)))

      const dateText = `Généré le ${dayjs().format('DD/MM/YYYY à HH:mm')}`

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY,
        theme: 'striped',
        headStyles: { fillColor: [231, 114, 43] },
        styles: { fontSize: 9 },
        didDrawPage: () => {
          const w = doc.internal.pageSize.getWidth()
          const h = doc.internal.pageSize.getHeight()
          doc.setFontSize(9)
          doc.setTextColor(100)
          doc.text(dateText, w - 14, h - 10, { align: 'right' })
        }
      })

      doc.save(fileName)
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error)
    } finally {
      setIsExporting(false)
    }
  }, [data, columns, fileName, title, subtitle, config])

  return { isExporting, handleExport }
}
