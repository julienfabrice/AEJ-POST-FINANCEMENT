import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'

export interface GenericTemplateColumnDef {
  key: string
  header: string
  width?: number
  dropdownOptions?: string[]
}

export interface GenericTemplateConfig {
  filename: string
  sheetName?: string
  sampleData: Record<string, unknown>[]
  columns: GenericTemplateColumnDef[]
}

/**
 * Normalise une clé de colonne (minuscules, sans accents, sans caractères spéciaux)
 */
export const normalizeExcelKey = (key: string): string => {
  return key
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_]/g, '_')
}

/**
 * Lit un fichier brut (Excel ou JSON) et retourne un tableau d'objets bruts
 */
export async function parseRawFile(file: File): Promise<Record<string, unknown>[]> {
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (ext === 'json') {
    const text = await file.text()
    const parsed = JSON.parse(text)
    const arrayData = Array.isArray(parsed)
      ? parsed
      : (parsed.data ?? parsed.items ?? parsed.rows ?? Object.values(parsed).find(Array.isArray) ?? [])

    if (!Array.isArray(arrayData) || arrayData.length === 0) {
      throw new Error('Le fichier JSON doit contenir un tableau de données.')
    }

    return arrayData as Record<string, unknown>[]
  }

  if (ext === 'xlsx' || ext === 'xls') {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const rawJson = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet)

    if (rawJson.length === 0) {
      throw new Error('Le fichier Excel est vide.')
    }

    return rawJson
  }

  throw new Error('Format non supporté. Veuillez importer un fichier .xlsx ou .json')
}

/**
 * Génère et télécharge un modèle Excel ou JSON complet avec validations in-cell
 */
export async function generateAndDownloadTemplate(
  config: GenericTemplateConfig,
  type: 'xlsx' | 'json',
): Promise<void> {
  const { filename, sheetName = 'Feuille1', sampleData, columns } = config

  if (type === 'json') {
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.json`
    a.click()
    URL.revokeObjectURL(url)
    return
  }

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)

  // Configuration des colonnes
  worksheet.columns = columns.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width || 20,
  }))

  // Ajout des lignes d'exemples
  sampleData.forEach((row) => {
    worksheet.addRow(row)
  })

  // Style de l'en-tête (charte AEJ : #E7722B)
  const headerRow = worksheet.getRow(1)
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE7722B' },
  }
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
  headerRow.height = 24

  // Configuration des listes déroulantes (select) sur les colonnes configurées
  const colLetter = (colIndex: number): string => {
    let letter = ''
    let temp = colIndex
    while (temp > 0) {
      const mod = (temp - 1) % 26
      letter = String.fromCharCode(65 + mod) + letter
      temp = Math.floor((temp - mod) / 26)
    }
    return letter
  }

  columns.forEach((col, idx) => {
    if (col.dropdownOptions && col.dropdownOptions.length > 0) {
      const letter = colLetter(idx + 1)
      const optionsString = `"${col.dropdownOptions.join(',')}"`
      for (let r = 2; r <= 500; r++) {
        worksheet.getCell(`${letter}${r}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [optionsString],
        }
      }
    }
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}
