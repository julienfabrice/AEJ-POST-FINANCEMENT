import * as XLSX from 'xlsx'

export interface LigneExcelImportee {
  code: string
  nom_promoteur: string
  prenom_promoteur: string
  montant_sollicite: number
}

/**
 * Normalise les en-têtes de colonnes possibles du fichier Excel (variations
 * de casse/accents côté agences) vers les clés attendues par POST /lots-importation.
 */
const CHAMPS_ALIAS: Record<string, keyof LigneExcelImportee> = {
  code: 'code',
  'code projet': 'code',
  'code micro-projet': 'code',
  nom: 'nom_promoteur',
  nom_promoteur: 'nom_promoteur',
  'nom promoteur': 'nom_promoteur',
  prenom: 'prenom_promoteur',
  prenom_promoteur: 'prenom_promoteur',
  'prénom promoteur': 'prenom_promoteur',
  montant: 'montant_sollicite',
  montant_sollicite: 'montant_sollicite',
  'montant sollicité': 'montant_sollicite',
}

function normaliserEntete(entete: string): string {
  return entete.trim().toLowerCase()
}

/** Lit le fichier Excel de répartition et renvoie les lignes au format attendu par l'API. */
export async function parseExcelRepartition(file: File): Promise<LigneExcelImportee[]> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const firstSheetName = workbook.SheetNames[0]
  if (!firstSheetName) return []

  const sheet = workbook.Sheets[firstSheetName]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })

  return rows
    .map((row) => {
      const ligne: Partial<LigneExcelImportee> = {}
      for (const [key, value] of Object.entries(row)) {
        const champ = CHAMPS_ALIAS[normaliserEntete(key)]
        if (!champ) continue
        ligne[champ] = (champ === 'montant_sollicite' ? Number(value) || 0 : String(value).trim()) as never
      }
      return ligne
    })
    .filter((l): l is LigneExcelImportee => !!l.code)
}