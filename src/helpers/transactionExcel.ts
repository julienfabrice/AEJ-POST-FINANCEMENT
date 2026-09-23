import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import dayjs from 'dayjs'
import type { TRANSACTION_TYPE_T, TRANSACTION_STATUT_T } from '@/types'

export interface ParsedTransactionRow {
  index: number
  micro_projet_id: number
  categorie_id?: number
  libelle: string
  montant: number
  type: TRANSACTION_TYPE_T
  date?: string
  mode_paiement?: string
  reference?: string
  statut: TRANSACTION_STATUT_T
  observations?: string
  isValid: boolean
  error?: string
}

/** Modèle complet d'exemples reprenant l'intégralité des champs d'une dépense */
export const SAMPLE_TRANSACTIONS = [
  {
    micro_projet_id: 1,
    categorie_id: 1,
    libelle: 'Achat de matières premières pour atelier',
    montant: 450000,
    type: 'DEPENSE',
    date: '2026-03-10',
    mode_paiement: 'VIREMENT',
    reference: 'FAC-2026-0042',
    statut: 'VALIDE',
    observations: 'Paiement fournisseur effectué par virement bancaire.',
  },
  {
    micro_projet_id: 2,
    categorie_id: 2,
    libelle: 'Frais de transport des équipements',
    montant: 85000,
    type: 'DEPENSE',
    date: '2026-03-18',
    mode_paiement: 'ESPECES',
    reference: 'REC-2026-012',
    statut: 'SOUMIS',
    observations: 'Reçu de transport en attente de validation.',
  },
]

export const normalizeKey = (key: string): string => {
  return key
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_]/g, '_')
}

export function validateAndMapTransactionRow(
  raw: Record<string, unknown>,
  index: number,
): ParsedTransactionRow {
  const normalized: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(raw)) {
    normalized[normalizeKey(k)] = v
  }

  // 1. micro_projet_id (requis)
  const micro_projet_id = Number(
    normalized['micro_projet_id'] ??
      normalized['projet_id'] ??
      normalized['id_projet'] ??
      normalized['id_micro_projet'] ??
      normalized['projet'] ??
      0,
  )

  // 2. categorie_id (optionnel)
  const rawCat =
    normalized['categorie_id'] ??
    normalized['id_categorie'] ??
    normalized['categorie']
  const parsedCat = rawCat !== undefined && rawCat !== null && rawCat !== '' ? Number(rawCat) : undefined
  const categorie_id = parsedCat && !isNaN(parsedCat) && parsedCat > 0 ? parsedCat : undefined

  // 3. libelle / intitule (requis)
  const libelle = String(
    normalized['libelle'] ??
      normalized['intitule'] ??
      normalized['titre'] ??
      normalized['nom'] ??
      normalized['description'] ??
      '',
  ).trim()

  // 4. montant (requis, > 0)
  const rawMontant =
    normalized['montant'] ??
    normalized['montant_total'] ??
    normalized['valeur'] ??
    0
  const montant = Number(String(rawMontant).replace(/\s/g, '').replace(/,/g, '.'))

  // 5. type ('DEPENSE' | 'RECETTE')
  let type: TRANSACTION_TYPE_T = 'DEPENSE'
  const rawType = String(normalized['type'] ?? 'DEPENSE').toUpperCase().trim()
  if (rawType === 'RECETTE') {
    type = 'RECETTE'
  }

  // 6. date (AAAA-MM-JJ)
  const rawDate = normalized['date'] ?? normalized['date_depense'] ?? normalized['date_transaction']
  const date =
    rawDate && dayjs(rawDate as string | Date).isValid()
      ? dayjs(rawDate as string | Date).format('YYYY-MM-DD')
      : undefined

  // 7. mode_paiement
  const mode_paiement = normalized['mode_paiement']
    ? String(normalized['mode_paiement']).trim()
    : normalized['paiement']
    ? String(normalized['paiement']).trim()
    : undefined

  // 8. reference
  const reference = normalized['reference']
    ? String(normalized['reference']).trim()
    : normalized['ref']
    ? String(normalized['ref']).trim()
    : undefined

  // 9. statut ('BROUILLON' | 'SOUMIS' | 'VALIDE' | 'REJETE' | 'ANNULE')
  let statut: TRANSACTION_STATUT_T
  const rawStatut = String(normalized['statut'] ?? 'VALIDE').toUpperCase().trim()
  if (rawStatut === 'BROUILLON') {
    statut = 'BROUILLON'
  } else if (rawStatut === 'SOUMIS' || rawStatut === 'EN_ATTENTE') {
    statut = 'SOUMIS'
  } else if (rawStatut === 'REJETE' || rawStatut === 'REJETÉ') {
    statut = 'REJETE'
  } else if (rawStatut === 'ANNULE' || rawStatut === 'ANNULÉ') {
    statut = 'ANNULE'
  } else {
    statut = 'VALIDE'
  }

  // 10. observations
  const observations = normalized['observations']
    ? String(normalized['observations']).trim()
    : normalized['observation']
    ? String(normalized['observation']).trim()
    : normalized['remarques']
    ? String(normalized['remarques']).trim()
    : undefined

  let isValid = true
  const errors: string[] = []

  if (!libelle) {
    isValid = false
    errors.push('Intitulé manquant')
  }

  if (isNaN(montant) || montant <= 0) {
    isValid = false
    errors.push('Montant invalide (doit être > 0)')
  }

  if (isNaN(micro_projet_id) || micro_projet_id <= 0) {
    isValid = false
    errors.push('ID micro-projet requis')
  }

  return {
    index: index + 1,
    micro_projet_id,
    categorie_id,
    libelle,
    montant: isNaN(montant) ? 0 : montant,
    type,
    date,
    mode_paiement,
    reference,
    statut,
    observations,
    isValid,
    error: errors.join(', ') || undefined,
  }
}

/**
 * Analyse et extrait les données d'un fichier de dépenses/transactions (Excel ou JSON)
 */
export async function parseTransactionFile(file: File): Promise<ParsedTransactionRow[]> {
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (ext === 'json') {
    const text = await file.text()
    const parsed = JSON.parse(text)
    const arrayData = Array.isArray(parsed) ? parsed : (parsed.transactions ?? parsed.depenses ?? parsed.data ?? [])

    if (!Array.isArray(arrayData) || arrayData.length === 0) {
      throw new Error('Le fichier JSON doit contenir un tableau de dépenses.')
    }

    return arrayData.map((item, idx) => validateAndMapTransactionRow(item, idx))
  }

  if (ext === 'xlsx' || ext === 'xls') {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const rawJson = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet)

    if (rawJson.length === 0) {
      throw new Error('La feuille Excel est vide.')
    }

    return rawJson.map((item, idx) => validateAndMapTransactionRow(item, idx))
  }

  throw new Error('Format de fichier non supporté. Veuillez utiliser un fichier .xlsx ou .json')
}

/**
 * Télécharge le modèle de fichier d'import de dépenses (Excel avec selects ou JSON)
 */
export async function downloadTransactionTemplate(type: 'xlsx' | 'json'): Promise<void> {
  if (type === 'json') {
    const blob = new Blob([JSON.stringify(SAMPLE_TRANSACTIONS, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'modele_import_depenses.json'
    a.click()
    URL.revokeObjectURL(url)
    return
  }

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Depenses')

  worksheet.columns = [
    { header: 'micro_projet_id', key: 'micro_projet_id', width: 18 },
    { header: 'categorie_id', key: 'categorie_id', width: 16 },
    { header: 'libelle', key: 'libelle', width: 35 },
    { header: 'montant', key: 'montant', width: 18 },
    { header: 'type', key: 'type', width: 14 },
    { header: 'date', key: 'date', width: 14 },
    { header: 'mode_paiement', key: 'mode_paiement', width: 20 },
    { header: 'reference', key: 'reference', width: 20 },
    { header: 'statut', key: 'statut', width: 18 },
    { header: 'observations', key: 'observations', width: 45 },
  ]

  SAMPLE_TRANSACTIONS.forEach((item) => {
    worksheet.addRow(item)
  })

  // Header styling
  const headerRow = worksheet.getRow(1)
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE7722B' },
  }
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
  headerRow.height = 24

  // Listes déroulantes (select) sur les colonnes enum pour les lignes 2 à 500
  for (let r = 2; r <= 500; r++) {
    // Col E : type (DEPENSE, RECETTE)
    worksheet.getCell(`E${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"DEPENSE,RECETTE"'],
    }

    // Col G : mode_paiement
    worksheet.getCell(`G${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"VIREMENT,CHEQUE,ESPECES,BANQUE,MOBILE_MONEY"'],
    }

    // Col I : statut
    worksheet.getCell(`I${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"VALIDE,SOUMIS,BROUILLON,REJETE,ANNULE"'],
    }
  }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'modele_import_depenses.xlsx'
  a.click()
  URL.revokeObjectURL(url)
}
