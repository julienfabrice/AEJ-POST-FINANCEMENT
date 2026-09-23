import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import dayjs from 'dayjs'
import type { BUDGET_STATUT_T } from '@/types'

export interface ParsedBudgetRow {
  index: number
  micro_projet_id: number
  intitule: string
  montant_accorde: number
  devise: string
  source?: string
  date_accord?: string
  statut: BUDGET_STATUT_T
  signature_convention: 'SIGNEE' | 'NON_SIGNEE'
  date_signature?: string
  deblocage: boolean
  date_deblocage?: string
  reception_acte_credit: 'OUI' | 'NON' | 'PARTIEL'
  date_reception?: string
  observations?: string
  isValid: boolean
  error?: string
}

/** Modèle complet reprenant l'intégralité des champs du formulaire de budget */
export const SAMPLE_BUDGETS = [
  {
    micro_projet_id: 1,
    intitule: 'Acquisition de matériel informatique',
    montant_accorde: 2500000,
    devise: 'FCFA',
    source: 'AFD',
    date_accord: '2026-03-15',
    statut: 'APPROUVE',
    signature_convention: 'SIGNEE',
    date_signature: '2026-03-20',
    deblocage: 'OUI',
    date_deblocage: '2026-03-25',
    reception_acte_credit: 'OUI',
    date_reception: '2026-03-22',
    observations: 'Dossier complet, premier décaissement programmé.',
  },
  {
    micro_projet_id: 2,
    intitule: 'Aménagement atelier de couture',
    montant_accorde: 1800000,
    devise: 'FCFA',
    source: 'AEJ',
    date_accord: '2026-03-20',
    statut: 'EN_ATTENTE',
    signature_convention: 'NON_SIGNEE',
    date_signature: '',
    deblocage: 'NON',
    date_deblocage: '',
    reception_acte_credit: 'NON',
    date_reception: '',
    observations: 'En attente de signature par le promoteur.',
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



export function validateAndMapRow(raw: Record<string, unknown>, index: number): ParsedBudgetRow {
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

  // 2. intitule (requis)
  const intitule = String(
    normalized['intitule'] ??
      normalized['intitule_du_budget'] ??
      normalized['titre'] ??
      normalized['libelle'] ??
      normalized['nom'] ??
      '',
  ).trim()

  // 3. montant_accorde (requis)
  const rawMontant =
    normalized['montant_accorde'] ??
    normalized['montant'] ??
    normalized['montant_total'] ??
    0
  const montant_accorde = Number(String(rawMontant).replace(/\s/g, '').replace(/,/g, '.'))

  // 4. devise
  const devise = String(normalized['devise'] ?? normalized['monnaie'] ?? 'FCFA').trim() || 'FCFA'

  // 5. source
  const source = normalized['source']
    ? String(normalized['source']).trim()
    : normalized['source_de_financement']
    ? String(normalized['source_de_financement']).trim()
    : undefined

  // 6. date_accord
  const rawDateAccord = normalized['date_accord'] ?? normalized['date']
  const date_accord =
    rawDateAccord && dayjs(rawDateAccord as string | Date).isValid()
      ? dayjs(rawDateAccord as string | Date).format('YYYY-MM-DD')
      : undefined

  // 7. statut (approbation)
  let statut: BUDGET_STATUT_T = 'EN_ATTENTE'
  const rawStatut = String(
    normalized['statut'] ??
      normalized['statut_approbation'] ??
      normalized['approbation'] ??
      '',
  ).toUpperCase().trim()

  if (rawStatut === 'APPROUVE' || rawStatut === 'APPROUVÉ' || rawStatut === 'VALIDE') {
    statut = 'APPROUVE'
  } else if (
    rawStatut === 'NON_APPROUVE' ||
    rawStatut === 'NON_APPROUVÉ' ||
    rawStatut === 'REJETE' ||
    rawStatut === 'REJETÉ'
  ) {
    statut = 'NON_APPROUVE'
  }

  // 8. signature_convention
  let signature_convention: 'SIGNEE' | 'NON_SIGNEE' = 'NON_SIGNEE'
  const rawConvention = String(
    normalized['signature_convention'] ??
      normalized['convention'] ??
      normalized['statut_convention'] ??
      '',
  ).toUpperCase().trim()

  if (
    rawConvention === 'SIGNEE' ||
    rawConvention === 'SIGNÉE' ||
    rawConvention === 'OUI' ||
    rawConvention === 'TRUE' ||
    rawConvention === '1'
  ) {
    signature_convention = 'SIGNEE'
  }

  // 9. date_signature
  const rawDateSig = normalized['date_signature'] ?? normalized['date_signature_convention']
  const date_signature =
    rawDateSig && dayjs(rawDateSig as string | Date).isValid()
      ? dayjs(rawDateSig as string | Date).format('YYYY-MM-DD')
      : undefined

  // 10. deblocage
  let deblocage = false
  const rawDeblocage = String(
    normalized['deblocage'] ??
      normalized['debloque'] ??
      normalized['statut_deblocage'] ??
      '',
  ).toUpperCase().trim()

  if (
    rawDeblocage === 'OUI' ||
    rawDeblocage === 'TRUE' ||
    rawDeblocage === '1' ||
    rawDeblocage === 'DEBLOQUE' ||
    rawDeblocage === 'DÉBLOQUÉ'
  ) {
    deblocage = true
  }

  // 11. date_deblocage
  const rawDateDeb = normalized['date_deblocage']
  const date_deblocage =
    rawDateDeb && dayjs(rawDateDeb as string | Date).isValid()
      ? dayjs(rawDateDeb as string | Date).format('YYYY-MM-DD')
      : undefined

  // 12. reception_acte_credit
  let reception_acte_credit: 'OUI' | 'NON' | 'PARTIEL' = 'NON'
  const rawActe = String(
    normalized['reception_acte_credit'] ??
      normalized['acte_credit'] ??
      normalized['acte'] ??
      '',
  ).toUpperCase().trim()

  if (rawActe === 'OUI' || rawActe === 'RECU' || rawActe === 'REÇU' || rawActe === 'TRUE') {
    reception_acte_credit = 'OUI'
  } else if (rawActe === 'PARTIEL') {
    reception_acte_credit = 'PARTIEL'
  }

  // 13. date_reception
  const rawDateRec = normalized['date_reception'] ?? normalized['date_reception_acte']
  const date_reception =
    rawDateRec && dayjs(rawDateRec as string | Date).isValid()
      ? dayjs(rawDateRec as string | Date).format('YYYY-MM-DD')
      : undefined

  // 14. observations
  const observations = normalized['observations']
    ? String(normalized['observations']).trim()
    : normalized['observation']
    ? String(normalized['observation']).trim()
    : normalized['remarques']
    ? String(normalized['remarques']).trim()
    : undefined

  let isValid = true
  const errors: string[] = []

  if (!intitule) {
    isValid = false
    errors.push('Intitulé manquant')
  }

  if (isNaN(montant_accorde) || montant_accorde <= 0) {
    isValid = false
    errors.push('Montant invalide')
  }

  if (isNaN(micro_projet_id) || micro_projet_id <= 0) {
    isValid = false
    errors.push('ID micro-projet requis')
  }

  return {
    index: index + 1,
    micro_projet_id,
    intitule,
    montant_accorde: isNaN(montant_accorde) ? 0 : montant_accorde,
    devise,
    source,
    date_accord,
    statut,
    signature_convention,
    date_signature,
    deblocage,
    date_deblocage,
    reception_acte_credit,
    date_reception,
    observations,
    isValid,
    error: errors.join(', ') || undefined,
  }
}

/**
 * Analyse et extrait les données d'un fichier budget (Excel ou JSON)
 */
export async function parseBudgetFile(file: File): Promise<ParsedBudgetRow[]> {
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (ext === 'json') {
    const text = await file.text()
    const parsed = JSON.parse(text)
    const arrayData = Array.isArray(parsed) ? parsed : (parsed.budgets ?? parsed.data ?? [])

    if (!Array.isArray(arrayData) || arrayData.length === 0) {
      throw new Error('Le fichier JSON doit contenir un tableau de budgets.')
    }

    return arrayData.map((item, idx) => validateAndMapRow(item, idx))
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

    return rawJson.map((item, idx) => validateAndMapRow(item, idx))
  }

  throw new Error('Format de fichier non supporté. Veuillez utiliser un fichier .xlsx ou .json')
}

/**
 * Télécharge le modèle de fichier d'import de budgets (Excel avec selects ou JSON)
 */
export async function downloadBudgetTemplate(type: 'xlsx' | 'json'): Promise<void> {
  if (type === 'json') {
    const blob = new Blob([JSON.stringify(SAMPLE_BUDGETS, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'modele_import_budgets.json'
    a.click()
    URL.revokeObjectURL(url)
    return
  }

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Budgets')

  worksheet.columns = [
    { header: 'micro_projet_id', key: 'micro_projet_id', width: 18 },
    { header: 'intitule', key: 'intitule', width: 35 },
    { header: 'montant_accorde', key: 'montant_accorde', width: 18 },
    { header: 'devise', key: 'devise', width: 12 },
    { header: 'source', key: 'source', width: 16 },
    { header: 'date_accord', key: 'date_accord', width: 14 },
    { header: 'statut', key: 'statut', width: 18 },
    { header: 'signature_convention', key: 'signature_convention', width: 24 },
    { header: 'date_signature', key: 'date_signature', width: 16 },
    { header: 'deblocage', key: 'deblocage', width: 14 },
    { header: 'date_deblocage', key: 'date_deblocage', width: 16 },
    { header: 'reception_acte_credit', key: 'reception_acte_credit', width: 24 },
    { header: 'date_reception', key: 'date_reception', width: 16 },
    { header: 'observations', key: 'observations', width: 45 },
  ]

  SAMPLE_BUDGETS.forEach((item) => {
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
    // Col D : devise
    worksheet.getCell(`D${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"FCFA,EUR,USD"'],
    }

    // Col G : statut
    worksheet.getCell(`G${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"APPROUVE,EN_ATTENTE,NON_APPROUVE"'],
    }

    // Col H : signature_convention
    worksheet.getCell(`H${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"SIGNEE,NON_SIGNEE"'],
    }

    // Col J : deblocage
    worksheet.getCell(`J${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"OUI,NON"'],
    }

    // Col L : reception_acte_credit
    worksheet.getCell(`L${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"OUI,NON,PARTIEL"'],
    }
  }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'modele_import_budgets.xlsx'
  a.click()
  URL.revokeObjectURL(url)
}
