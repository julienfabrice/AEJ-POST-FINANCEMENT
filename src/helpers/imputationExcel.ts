import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import dayjs from 'dayjs'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import type { AGENCE_REGIONALE_T } from '@/types'
import { refLabel } from '@/types/referentials.types'

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

const CANVAS_HEADERS = [
  // ── 1. Informations Projet ──
  'Code',
  'Intitulé',
  'Matricule projet',
  'Description',
  'Montant total',
  'Statut',
  'Stade projet',
  'Type de projet',
  'Étape workflow',

  // ── 2. Référentiels & Localisation Projet ──
  'Dispositif',
  'Organisme',
  'Guichet',
  "Secteur d'activité",
  'Commune',
  'Localisation',
  'Géolocalisation',

  // ── 3. Dates Projet ──
  'Date de certification',
  'Date de transmission',
  'Date de création',

  // ── 4. Informations Promoteur (Bénéficiaire) ──
  'Matricule AEJ',
  'Nom promoteur',
  'Prénom promoteur',
  'Nom complet promoteur',
  'Sexe',
  'Téléphone',
  'Email',
  "Tranche d'âge",
  'Date de naissance',
  'Lieu de naissance',
  'Numéro CNI',
  'Numéro CMU',
  'Numéro CNPS',
  'Situation matrimoniale',
  "Niveau d'étude",
  'Nationalité',
  "Lieu d'habitation",
  'Raison sociale',

  // ── 5. Agence actuelle / Origine ──
  'Agence actuelle',

  // ── 6. Imputation (champs à renseigner) ──
  'Agence cible (nom)',
  'agence_id',
]

const CANVAS_COL_WIDTHS = [
  18, // Code
  35, // Intitulé
  18, // Matricule projet
  30, // Description
  16, // Montant total
  18, // Statut
  18, // Stade projet
  16, // Type de projet
  16, // Étape workflow
  20, // Dispositif
  25, // Organisme
  18, // Guichet
  25, // Secteur d'activité
  20, // Commune
  22, // Localisation
  20, // Géolocalisation
  18, // Date certification
  18, // Date transmission
  16, // Date création
  18, // Matricule AEJ
  20, // Nom promoteur
  20, // Prénom promoteur
  28, // Nom complet promoteur
  12, // Sexe
  16, // Téléphone
  28, // Email
  16, // Tranche d'âge
  16, // Date naissance
  20, // Lieu naissance
  18, // Numéro CNI
  18, // Numéro CMU
  18, // Numéro CNPS
  22, // Situation matrimoniale
  20, // Niveau d'étude
  18, // Nationalité
  20, // Lieu d'habitation
  22, // Raison sociale
  25, // Agence actuelle
  30, // Agence cible (nom)
  15, // agence_id
]

// ─── Génération du canevas ────────────────────────────────────────────────────

/**
 * Génère et télécharge un fichier Excel canevas pré-rempli
 * avec l'ensemble des champs des dossiers en attente d'imputation et la liste des agences.
 * Toutes les colonnes enum disposent de menus déroulants (select) in-cell.
 */
export async function generateImputationCanvas(
  attente: MICRO_PROJET_T[],
  agences: AGENCE_REGIONALE_T[]
): Promise<void> {
  const workbook = new ExcelJS.Workbook()

  // ── Onglet 1 : Imputation ─────────────────────────────────────────────────
  const ws = workbook.addWorksheet('Imputation')
  ws.columns = CANVAS_HEADERS.map((header, idx) => ({
    header,
    key: `col_${idx}`,
    width: CANVAS_COL_WIDTHS[idx] || 20,
  }))

  // Style Header Imputation
  const headerRow = ws.getRow(1)
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE7722B' },
  }
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
  headerRow.height = 24

  attente.forEach((p) => {
    const promoteur = p.promoteur
    const promoteurFullName = promoteur
      ? `${promoteur.nom ?? ''} ${promoteur.prenom ?? ''}`.trim()
      : ''
    const montant = p.montant_total ? Number(p.montant_total) : ''

    const secteurNom = p.secteur
      ? refLabel(p.secteur)
      : (promoteur?.secteur_activite ? refLabel(promoteur.secteur_activite) : '')

    const agenceActuelle = p.agence
      ? (p.agence.nom ?? refLabel(p.agence))
      : (promoteur?.agence_regionale ? refLabel(promoteur.agence_regionale) : '')

    ws.addRow([
      // 1. Informations Projet
      p.code ?? '',
      p.intitule ?? '',
      p.matricule ?? '',
      p.description ?? '',
      montant,
      p.statut ?? '',
      p.stade_projet ?? '',
      p.type_projet ?? '',
      p.workflow_instance?.current_etape_code ?? '',

      // 2. Référentiels & Localisation Projet
      p.dispositif ? refLabel(p.dispositif) : '',
      p.organisme ? refLabel(p.organisme) : '',
      p.guichet ? refLabel(p.guichet) : '',
      secteurNom,
      p.commune ? refLabel(p.commune) : '',
      p.localisation ?? '',
      p.geolocalisation ?? '',

      // 3. Dates Projet
      p.date_certification ? dayjs(p.date_certification).format('DD/MM/YYYY') : '',
      p.date_transmission_partenaire ? dayjs(p.date_transmission_partenaire).format('DD/MM/YYYY') : '',
      p.created_at ? dayjs(p.created_at).format('DD/MM/YYYY') : '',

      // 4. Informations Promoteur
      promoteur?.matriculeaej ?? '',
      promoteur?.nom ?? '',
      promoteur?.prenom ?? '',
      promoteurFullName,
      promoteur?.sexe ? refLabel(promoteur.sexe) : '',
      promoteur?.telephone ?? '',
      promoteur?.email ?? '',
      promoteur?.tranche_age ?? '',
      promoteur?.datenaissance ? dayjs(promoteur.datenaissance).format('DD/MM/YYYY') : '',
      promoteur?.lieunaissance ?? '',
      promoteur?.numerocni ?? '',
      promoteur?.numerocmu ?? '',
      promoteur?.numerocnps ?? '',
      promoteur?.situation_matrimoniale ? refLabel(promoteur.situation_matrimoniale) : '',
      promoteur?.niveau_etude ? refLabel(promoteur.niveau_etude) : '',
      promoteur?.pays_nationalite ? refLabel(promoteur.pays_nationalite) : '',
      promoteur?.lieu_habitation ? refLabel(promoteur.lieu_habitation) : '',
      promoteur?.raison_sociale ?? '',

      // 5. Agence actuelle
      agenceActuelle,

      // 6. Colonnes à remplir pour l'imputation (vides par défaut)
      '',
      '',
    ])
  })

  // ── Onglet 2 : Agences (référence) ───────────────────────────────────────
  const agencesSheet = workbook.addWorksheet('Agences')
  agencesSheet.columns = [
    { header: 'ID', key: 'id', width: 8 },
    { header: 'Code', key: 'code', width: 12 },
    { header: 'Nom', key: 'nom', width: 35 },
    { header: 'Contact', key: 'contact', width: 25 },
    { header: 'Téléphone', key: 'telephone', width: 18 },
    { header: 'Email', key: 'email', width: 25 },
  ]
  const agencesHeaderRow = agencesSheet.getRow(1)
  agencesHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  agencesHeaderRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E293B' },
  }
  agencesHeaderRow.alignment = { vertical: 'middle', horizontal: 'center' }
  agencesHeaderRow.height = 24

  agences.forEach((a) => {
    agencesSheet.addRow([
      a.id,
      a.code ?? '',
      a.nom ?? '',
      a.contact ?? '',
      a.telephone ?? '',
      a.email ?? '',
    ])
  })

  // ── Configuration des listes déroulantes (select) sur les colonnes enum ──
  const maxRow = Math.max(attente.length + 10, 500)
  for (let r = 2; r <= maxRow; r++) {
    // Col 6 : Statut
    ws.getCell(r, 6).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"BROUILLON,EN_SOUMISSION,EN_COURS,EN_ANALYSE,EN_ATTENTE,ANNULE,NON_APPROUVE,APPROUVE,EN_FORMATION,EN_FINANCEMENT,EN_DECAISSEMENT,EN_SUIVI,EN_REMBOURSEMENT,TERMINE"'],
    }

    // Col 7 : Stade projet
    ws.getCell(r, 7).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"CREATION,DEVELOPPEMENT"'],
    }

    // Col 8 : Type de projet
    ws.getCell(r, 8).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"INDIVIDUEL,COLLECTIF"'],
    }

    // Col 24 : Sexe
    ws.getCell(r, 24).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"MASCULIN,FEMININ"'],
    }

    // Col 27 : Tranche d'âge
    ws.getCell(r, 27).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"18_40,PLUS_40"'],
    }

    // Col 39 : Agence cible (nom) -> Menu déroulant lié à la liste d'agences
    if (agences.length > 0) {
      ws.getCell(r, 39).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`'Agences'!$C$2:$C$${agences.length + 1}`],
      }
    }
  }

  // ── Téléchargement ────────────────────────────────────────────────────────
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const date = new Date().toISOString().slice(0, 10)
  a.download = `Canevas_Imputation_${date}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Parsing du fichier importé ───────────────────────────────────────────────

/**
 * Lit un fichier Excel importé et retourne les lignes parsées avec leur statut.
 *
 * La détection des colonnes est dynamique et inspecte la première ligne d'en-tête,
 * assurant la rétrocompatibilité complète avec les canevas simplifiés ou complets.
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
        const rows: unknown[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        if (rows.length < 2) {
          resolve([])
          return
        }

        const headerRow = (rows[0] as unknown[]).map((cell) =>
          String(cell ?? '')
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9_]/g, '_')
        )

        const findColIdx = (keywords: string[], fallbackIdx: number) => {
          const idx = headerRow.findIndex((h) =>
            keywords.some((kw) => h === kw || h.includes(kw))
          )
          return idx !== -1 ? idx : fallbackIdx
        }

        const codeIdx = findColIdx(['code_projet', 'code'], 0)
        const intituleIdx = findColIdx(['intitule', 'titre'], 1)
        const agenceIdIdx = findColIdx(['agence_id', 'id_agence', 'agenceid'], headerRow.length - 1)
        const agenceNomIdx = findColIdx(['agence_cible', 'agence_nom', 'cible'], headerRow.length - 2)

        const result: ImportedRow[] = []

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i]
          if (!row || row.length === 0) continue

          const code = String(row[codeIdx] ?? '').trim()
          const intitule = String(row[intituleIdx] ?? '').trim()
          const rawAgenceId = row[agenceIdIdx]
          const agenceNom = String(row[agenceNomIdx] ?? '').trim()

          if (!code) continue // ligne vide

          const agenceId =
            rawAgenceId !== '' && rawAgenceId !== undefined && rawAgenceId !== null
              ? Number(rawAgenceId)
              : null

          const validAgenceId = agenceId !== null && !isNaN(agenceId) ? agenceId : null

          // Résolution du projet
          const projet = allProjets.find((p) => p.code === code) ?? null
          const projetEnAttente = attente.find((p) => p.code === code) ?? null
          const agence =
            validAgenceId !== null
              ? agences.find((a) => a.id === validAgenceId) ?? null
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
          } else if (validAgenceId === null || validAgenceId === 0) {
            status = 'direction'
          } else if (!agence) {
            status = 'invalid_agence'
            errorMsg = `L'agence avec l'ID ${validAgenceId} est introuvable.`
          } else {
            status = 'valid'
          }

          result.push({
            line: i,
            code,
            intitule: intitule || projet?.intitule || '',
            agence_id: validAgenceId,
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
