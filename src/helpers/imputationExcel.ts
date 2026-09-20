import * as XLSX from 'xlsx'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import type { AGENCE_REGIONALE_T } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ImportRowStatus = 'valid' | 'direction' | 'invalid_code' | 'invalid_agence' | 'already_imputed'

export interface ImportedRow {
  /** Ligne du fichier (1-indexé, hors en-tête) */
  line: number
  code: string
  intitule: string
  agence_id: number | null
  agence_nom: string
  /** Projet résolu depuis la liste attente */
  projet: MICRO_PROJET_T | null
  /** Agence résolue depuis la liste agences */
  agence: AGENCE_REGIONALE_T | null
  status: ImportRowStatus
  /** Message d'erreur si invalide */
  errorMsg?: string
}

// ─── Colonnes du canevas ──────────────────────────────────────────────────────

const CANVAS_HEADERS = ['Code', 'Intitulé', 'Promoteur', 'Montant total', 'Agence cible (nom)', 'agence_id']
const AGENCES_HEADERS = ['ID', 'Nom', 'Région']

// ─── Génération du canevas ────────────────────────────────────────────────────

/**
 * Génère et télécharge un fichier Excel canevas pré-rempli
 * avec les dossiers en attente d'imputation et la liste des agences.
 */
export function generateImputationCanvas(
  attente: MICRO_PROJET_T[],
  agences: AGENCE_REGIONALE_T[]
): void {
  const wb = XLSX.utils.book_new()

  // ── Onglet 1 : Imputation ─────────────────────────────────────────────────
  const imputationData = attente.map((p) => {
    const promoteur = p.promoteur
      ? `${p.promoteur.nom ?? ''} ${p.promoteur.prenom ?? ''}`.trim()
      : ''
    const montant = p.montant_total ? Number(p.montant_total) : ''
    return [p.code, p.intitule, promoteur, montant, '', '']
  })

  const imputationSheet = XLSX.utils.aoa_to_sheet([CANVAS_HEADERS, ...imputationData])

  // Largeur des colonnes
  imputationSheet['!cols'] = [
    { wch: 20 }, // Code
    { wch: 40 }, // Intitulé
    { wch: 30 }, // Promoteur
    { wch: 18 }, // Montant
    { wch: 35 }, // Agence nom
    { wch: 12 }, // agence_id
  ]

  // Verrouiller les colonnes A-D (header + données) en les marquant en gris
  // Note : xlsx open-source ne supporte pas la protection native des cellules,
  // mais on peut styler l'en-tête pour indiquer visuellement ce qui est éditable.
  XLSX.utils.book_append_sheet(wb, imputationSheet, 'Imputation')

  // ── Onglet 2 : Agences (référence) ───────────────────────────────────────
  const agencesData = agences.map((a) => [a.id, a.nom, (a as any).region?.nom ?? ''])
  const agencesSheet = XLSX.utils.aoa_to_sheet([AGENCES_HEADERS, ...agencesData])
  agencesSheet['!cols'] = [{ wch: 10 }, { wch: 40 }, { wch: 25 }]
  XLSX.utils.book_append_sheet(wb, agencesSheet, 'Agences')

  // ── Téléchargement ────────────────────────────────────────────────────────
  const date = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `Canevas_Imputation_${date}.xlsx`)
}

// ─── Parsing du fichier importé ───────────────────────────────────────────────

/**
 * Lit un fichier Excel importé et retourne les lignes parsées avec leur statut.
 *
 * Format attendu (identique au canevas) :
 *   Col A : code         (obligatoire)
 *   Col B : intitule     (informatif)
 *   Col C : promoteur    (informatif)
 *   Col D : montant      (informatif)
 *   Col E : agence_nom   (optionnel)
 *   Col F : agence_id    (clé principale — vide ou 0 = Direction)
 */
export async function parseImputationExcel(
  file: File,
  attente: MICRO_PROJET_T[],
  agences: AGENCE_REGIONALE_T[],
  allProjets: MICRO_PROJET_T[]
): Promise<ImportedRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) throw new Error('Impossible de lire le fichier')

        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // header:1 → tableau de tableaux, on skip la ligne d'en-tête
        const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        const result: ImportedRow[] = []

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i]
          if (!row || row.length === 0) continue

          const code = String(row[0] ?? '').trim()
          const intitule = String(row[1] ?? '').trim()
          const rawAgenceId = row[5]
          const agenceNom = String(row[4] ?? '').trim()

          if (!code) continue // ligne vide

          const agenceId = rawAgenceId !== '' && rawAgenceId !== undefined && rawAgenceId !== null
            ? Number(rawAgenceId)
            : null

          // Résolution du projet
          const projet = allProjets.find(p => p.code === code) ?? null
          const projetEnAttente = attente.find(p => p.code === code) ?? null
          const agence = agenceId !== null
            ? agences.find(a => a.id === agenceId) ?? null
            : null

          // Détermination du statut
          let status: ImportRowStatus
          let errorMsg: string | undefined

          if (!projet) {
            status = 'invalid_code'
            errorMsg = `Le code « ${code} » ne correspond à aucun dossier.`
          } else if (!projetEnAttente) {
            status = 'already_imputed'
            errorMsg = `Ce dossier a déjà été imputé.`
          } else if (agenceId === null || agenceId === 0) {
            status = 'direction'
          } else if (!agence) {
            status = 'invalid_agence'
            errorMsg = `L'agence avec l'ID ${agenceId} est introuvable.`
          } else {
            status = 'valid'
          }

          result.push({
            line: i,
            code,
            intitule: intitule || projet?.intitule || '',
            agence_id: agenceId,
            agence_nom: agenceNom || agence?.nom || 'Direction',
            projet: projetEnAttente,
            agence,
            status,
            errorMsg,
          })
        }

        resolve(result)
      } catch (err) {
        reject(err)
      }
    }

    reader.onerror = (err) => reject(err)
    reader.readAsBinaryString(file)
  })
}
