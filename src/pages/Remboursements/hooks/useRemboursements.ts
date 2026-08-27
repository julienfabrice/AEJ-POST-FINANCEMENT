import { useMemo } from 'react'
import { MOCK_OP_REMBOURSEMENTS, type MockOpRemboursement } from '@/mock/remboursements.mock'

export function useRemboursements() {
  return useMemo(() => {
    let duTotal = 0
    let payeTotal = 0
    let impayesCount = 0

    const byProjet: Record<string, MockOpRemboursement[]> = {}

    MOCK_OP_REMBOURSEMENTS.forEach((r) => {
      duTotal += r.du
      payeTotal += r.paye
      if (r.statut === 'IMPAYE') impayesCount++

      if (!byProjet[r.projet_id]) byProjet[r.projet_id] = []
      byProjet[r.projet_id].push(r)
    })

    const cats: {
      AJOUR: any[]
      LEGER: any[]
      LOURD: any[]
    } = { AJOUR: [], LEGER: [], LOURD: [] }

    Object.entries(byProjet).forEach(([pid, rows]) => {
      const firstRow = rows[0]
      const nbImp = rows.filter((r) => r.statut === 'IMPAYE').length
      const retardMax = Math.max(0, ...rows.map((r) => r.jours_retard || 0))

      const item = {
        pid,
        titre: firstRow.projet_titre,
        code: firstRow.projet_code,
        agence: firstRow.agence,
        nbImp,
        retard: retardMax,
      }

      if (nbImp === 0) cats.AJOUR.push(item)
      else if (nbImp <= 3) cats.LEGER.push(item)
      else cats.LOURD.push(item)
    })

    return {
      kpis: {
        du: duTotal,
        paye: payeTotal,
        taux: duTotal > 0 ? Math.round((payeTotal / duTotal) * 100) : 0,
        impayes: impayesCount,
      },
      dossiersGroups: cats,
    }
  }, [])
}
