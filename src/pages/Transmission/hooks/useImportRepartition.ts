import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { organismeServices } from '@/services/organismes.services'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

import { axiosInstance } from '@/constants/axiosInstance'

export interface ExcelRow {
  'N° de dossier'?: string
  Nom?: string
  Prénoms?: string
  'Montant sollicité'?: number | string
  'Partenaire financier'?: string
  [key: string]: any
}

export function useImportRepartition(projetsEligibles: MICRO_PROJET_T[]) {
  const normalize = (s?: string | number) => s?.toString().trim().toLowerCase() || ''

  const parseFile = async (source: File | string) => {
    return new Promise<{
      reconnus: { projet: MICRO_PROJET_T; row: ExcelRow }[]
      inconnus: { code: string; row: ExcelRow }[]
    }>(async (resolve, reject) => {
      try {
        let arrayBuffer: ArrayBuffer

        if (typeof source === 'string') {
          const res = await axiosInstance.get(source, { responseType: 'arraybuffer' })
          arrayBuffer = res.data
        } else {
          arrayBuffer = await new Promise<ArrayBuffer>((res, rej) => {
            const reader = new FileReader()
            reader.onload = (e) => res(e.target?.result as ArrayBuffer)
            reader.onerror = (err) => rej(err)
            reader.readAsArrayBuffer(source)
          })
        }

        const data = new Uint8Array(arrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<ExcelRow>(firstSheet)

        const reconnus: { projet: MICRO_PROJET_T; row: ExcelRow }[] = []
        const inconnus: { code: string; row: ExcelRow }[] = []

        rows.forEach((row) => {
          const noDossier = row['ID Projet'] || row['N° de dossier'] // Support both for retro-compatibility
          if (!noDossier) return // Ignore les lignes vides ou sans code

          const match = projetsEligibles.find((p) => normalize(p.id) === normalize(noDossier))
          if (match) {
            reconnus.push({ projet: match, row })
          } else {
            inconnus.push({ code: noDossier.toString(), row })
          }
        })

        resolve({ reconnus, inconnus })
      } catch (err) {
        reject(err)
      }
    })
  }

  const { data: organismes = [] } = organismeServices.useGetAll()

  const downloadCanvas = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Répartition')

    worksheet.columns = [
      { header: 'ID Projet', key: 'code', width: 20 },
      { header: 'Nom', key: 'nom', width: 25 },
      { header: 'Prénoms', key: 'prenoms', width: 30 },
      { header: 'Montant sollicité', key: 'montant', width: 20 },
      { header: 'Partenaire financier', key: 'partenaire', width: 25 },
    ]

    // Style the header row
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF3F4F6' }
    }

    // Add data rows
    projetsEligibles.forEach((p) => {
      worksheet.addRow({
        code: p.id,
        nom: p.promoteur?.nom || '',
        prenoms: p.promoteur?.prenom || '',
        montant: Number(p.montant_total) || 0,
        partenaire: '',
      })
    })

    // Setup data validation for "Partenaire financier"
    if (organismes.length > 0) {
      // Build a comma-separated list of names (replacing commas to avoid breaking the list)
      const options = organismes.map(o => (o.nom || 'Inconnu').replace(/,/g, ' ')).join(',')
      
      const lastRow = Math.max(projetsEligibles.length + 1, 100)
      for (let i = 2; i <= lastRow; i++) {
        worksheet.getCell(`E${i}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`"${options}"`],
          showErrorMessage: true,
          errorTitle: 'Partenaire invalide',
          error: 'Veuillez sélectionner un partenaire dans la liste déroulante.'
        }
      }
    }

    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buffer]), 'repartition_modele.xlsx')
  }

  return { parseFile, downloadCanvas }
}
