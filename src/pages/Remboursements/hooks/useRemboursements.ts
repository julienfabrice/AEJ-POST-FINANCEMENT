import { useMemo } from 'react'
import { remboursementServices } from '@/services/remboursements.services'
import { budgetServices } from '@/services/budgets.services'
import { useProjetsLookup } from '../../Financements/hooks/useProjetsLookup'
import { refLabel } from '@/types/referentials.types'

interface GroupItem {
  titre: string
  code: string
  agence: string
  nbImp: number
  retard: number
}

export function useRemboursements() {
  const { data: remboursements = [], isLoading } = remboursementServices.useGetAll()
  const { data: budgets = [] } = budgetServices.useGetAll()
  const { projetById } = useProjetsLookup()

  return useMemo(() => {
    const budgetById = new Map(budgets.map((b) => [b.id, b]))

    let duTotal = 0
    let payeTotal = 0
    let impayesCount = 0

    // Regroupement par dossier : budget_id sert de proxy pour "le dossier"
    // (chaque budget est lié à un seul micro-projet — cf. budgets.micro_projet_id UNIQUE).
    const byBudget: Record<number, typeof remboursements> = {}

    remboursements.forEach((r) => {
      duTotal += r.montant_echu
      payeTotal += r.montant_paye
      if (r.statut === 'NON_PAYE') impayesCount++

      const key = r.budget_id ?? -r.promoteur_id // repli sur promoteur_id si pas de budget lié
      if (!byBudget[key]) byBudget[key] = []
      byBudget[key].push(r)
    })

    const cats: { AJOUR: GroupItem[]; LEGER: GroupItem[]; LOURD: GroupItem[] } = {
      AJOUR: [],
      LEGER: [],
      LOURD: [],
    }

    Object.entries(byBudget).forEach(([key, rows]) => {
      const budgetId = Number(key)
      const budget = budgetId > 0 ? budgetById.get(budgetId) : undefined
      const projet = budget ? projetById.get(budget.micro_projet_id) : undefined
      const nbImp = rows.filter((r) => r.statut === 'NON_PAYE').length

      const item: GroupItem = {
        titre: projet?.intitule ?? `Promoteur #${rows[0].promoteur_id}`,
        code: projet?.code ?? '—',
        agence: projet?.agence ? refLabel(projet.agence) : '—',
        nbImp,
        // Jours de retard : non présent dans le payload confirmé de /remboursements.
        retard: 0,
      }

      if (nbImp === 0) cats.AJOUR.push(item)
      else if (nbImp <= 3) cats.LEGER.push(item)
      else cats.LOURD.push(item)
    })

    return {
      isLoading,
      kpis: {
        du: duTotal,
        paye: payeTotal,
        taux: duTotal > 0 ? Math.round((payeTotal / duTotal) * 100) : 0,
        impayes: impayesCount,
      },
      dossiersGroups: cats,
    }
  }, [remboursements, budgets, projetById, isLoading])
}
