/**
 * Générateur d'échéancier de remboursement.
 *
 * Méthode : amortissement à capital constant (la plus courante en
 * microfinance) — chaque échéance rembourse la même part de capital ;
 * les intérêts, eux, décroissent avec le capital restant dû.
 *
 * - `dureeMois` : durée totale de remboursement, en mois (hors différé).
 * - `differeMois` : période de grâce en mois avant la première échéance
 *   (aucun capital remboursé pendant cette période, mais peut porter
 *   intérêt selon convention — ici on démarre simplement l'échéancier
 *   après le différé, sans intérêts intercalaires).
 * - `tauxAnnuel` : taux d'intérêt annuel, en pourcentage (ex. 8 pour 8%).
 */

export interface GenerateEcheancierParams {
  capital: number
  tauxAnnuel: number
  dureeMois: number
  differeMois: number
  dateDebut: string // ISO yyyy-mm-dd, date de la première échéance après différé
}

export interface EcheanceRow {
  periode: number
  echeance_mensuelle: string
  amortissement_capital: number
  interets: number
  montant_echeance: number
  capital_rembourse: number
  capital_restant: number
}

export function generateEcheancier(params: GenerateEcheancierParams): EcheanceRow[] {
  const { capital, tauxAnnuel, dureeMois, differeMois, dateDebut } = params

  if (capital <= 0 || dureeMois <= 0) return []

  const tauxMensuel = tauxAnnuel / 100 / 12
  const amortissementConstant = capital / dureeMois

  const rows: EcheanceRow[] = []
  let capitalRestant = capital
  let capitalRembourseCumule = 0

  const [y, m, d] = dateDebut.split('-').map(Number)
  const baseDate = new Date(y, (m || 1) - 1, d || 1)

  for (let i = 1; i <= dureeMois; i++) {
    const interets = capitalRestant * tauxMensuel
    const montantEcheance = amortissementConstant + interets
    capitalRestant = Math.max(0, capitalRestant - amortissementConstant)
    capitalRembourseCumule += amortissementConstant

    const echeanceDate = new Date(baseDate)
    echeanceDate.setMonth(baseDate.getMonth() + differeMois + (i - 1))

    rows.push({
      periode: i,
      echeance_mensuelle: echeanceDate.toISOString().slice(0, 10),
      amortissement_capital: Math.round(amortissementConstant * 100) / 100,
      interets: Math.round(interets * 100) / 100,
      montant_echeance: Math.round(montantEcheance * 100) / 100,
      capital_rembourse: Math.round(capitalRembourseCumule * 100) / 100,
      capital_restant: Math.round(capitalRestant * 100) / 100,
    })
  }

  return rows
}
