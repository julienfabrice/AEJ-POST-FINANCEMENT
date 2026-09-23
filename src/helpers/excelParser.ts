import * as XLSX from 'xlsx'
import type { AMORTISSEMENT_LIGNE_T } from '@/types'

/**
 * Lit un fichier Excel et extrait les lignes du tableau d'amortissement.
 * Se base sur l'ordre des colonnes du modèle fourni :
 * 0: N°
 * 1: Periode
 * 2: Date
 * 3: Capital début
 * 4: Intérêt
 * 5: Amortissement
 * 6: Mensualité
 * 7: Capital restant dû
 * 8: Statut paiment
 */
export async function parseAmortissementExcel(file: File): Promise<AMORTISSEMENT_LIGNE_T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) throw new Error('Impossible de lire le fichier')

        const workbook = XLSX.read(data, { type: 'binary' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // header: 1 pour avoir un array of arrays
        const rows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 })

        const amortissementRows: AMORTISSEMENT_LIGNE_T[] = []

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i]
          
          // Vérifier si c'est une ligne de données (la colonne N° (index 0) doit être un nombre valide)
          const num = Number(row[0])
          if (!isNaN(num) && num > 0) {
            
            // Formatage de la date Excel (nombre) vers string YYYY-MM-DD
            let dateStr = ''
            if (typeof row[2] === 'number') {
              // Convertir date Excel (jours depuis le 1er janvier 1900)
              // Correction bug d'Excel sur l'année bissextile 1900 (+2)
              const excelDate = row[2]
              const dateObj = new Date((excelDate - 25569) * 86400 * 1000)
              dateStr = dateObj.toISOString().slice(0, 10)
            } else if (typeof row[2] === 'string') {
              dateStr = row[2] // Format brut si déjà string
            } else if (row[2] instanceof Date) {
              dateStr = row[2].toISOString().slice(0, 10)
            }

            amortissementRows.push({
              numero: num,
              periode: Number(row[1]) || num,
              date: dateStr,
              capital_debut: Number(row[3]) || 0,
              interet: Number(row[4]) || 0,
              amortissement: Number(row[5]) || 0,
              mensualite: Number(row[6]) || 0,
              capital_restant: Number(row[7]) || 0,
              statut_paiement: row[8] === 'PAYE' ? 'PAYE' : 'NON_PAYE'
            })
          }
        }

        resolve(amortissementRows)
      } catch (err) {
        reject(err)
      }
    }

    reader.onerror = (err) => reject(err)
    reader.readAsBinaryString(file)
  })
}
