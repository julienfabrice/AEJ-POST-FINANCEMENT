import { useMemo, useState } from 'react'
import { remboursementServices } from '@/services/remboursements.services'
import { planRemboursementServices } from '@/services/planRemboursements.services'
import { tableauAmortissementServices } from '@/services/tableauAmortissements.services'
import { recouvrementServices } from '@/services/recouvrements.services'
import { budgetServices } from '@/services/budgets.services'
import { personnelsServices } from '@/services/personnels.services'
import { refLabel } from '@/types/referentials.types'
import { MOCK_RECOUVREMENT_GARANTIES } from '@/mock/recouvrement.mock'
import { RECOUV_TYPE_LABEL, type ProjetRecouvrement, type ActionRecouvrement, type RecouvrementTab } from '../types'
import type { RecouvrementFormValues } from '@/schema/recouvrements/recouvrementSchema'

export function useRecouvrement() {
  const [activeTab, setActiveTab] = useState<RecouvrementTab>('portefeuille')

  // --- Formulaire "Action amiable" / "Sortir du portefeuille" (modale partagée) ---
  const [formOpen, setFormOpen] = useState(false)
  const [formPrefill, setFormPrefill] = useState<Partial<RecouvrementFormValues>>({})

  const { data: remboursements = [] } = remboursementServices.useGetAll()
  const { data: plansRemboursement = [] } = planRemboursementServices.useGetAll()
  const { data: tableauAmortissements = [] } = tableauAmortissementServices.useGetAll()
  const { data: recouvrements = [] } = recouvrementServices.useGetAll()
  const { data: budgets = [] } = budgetServices.useGetAll()
  const { data: personnels = [] } = personnelsServices.useGetAll()

  const { aJour, leger, lourd, contentieux, actions } = useMemo(() => {
    const budgetById = new Map(budgets.map((b) => [b.id, b]))
    const personnelById = new Map(personnels.map((p) => [p.id, p]))

    const planById = new Map(plansRemboursement.map(pl => [pl.id, pl]))

    // --- Reste dû par micro-projet, à partir des échéances du tableau ---
    const resteDuByProjet = new Map<number, number>()
    tableauAmortissements.forEach((tab) => {
      const plan = planById.get(tab.plan_remboursement_id)
      if (plan && tab.statut === 'NON_PAYE') {
        const prev = resteDuByProjet.get(plan.micro_projet_id) ?? 0
        resteDuByProjet.set(plan.micro_projet_id, prev + Number(tab.capital_restant ?? 0))
      }
    })

    // --- Impayés par dossier, à partir de /remboursements (regroupés via budget_id, cf. useRemboursements) ---
    interface Agg {
      microProjetId?: number
      titre: string
      code: string
      agence: string
      nbImpayes: number
    }
    const byBudget: Record<number, Agg> = {}
    remboursements.forEach((r) => {
      const key = r.budget_id ?? -r.promoteur_id
      const budget = r.budget_id ? budgetById.get(r.budget_id) : undefined
      const projet = budget?.micro_projet
      if (!byBudget[key]) {
        byBudget[key] = {
          microProjetId: projet?.id,
          titre: projet?.intitule ?? `Promoteur #${r.promoteur_id}`,
          code: projet?.code ?? '—',
          agence: projet?.agence ? refLabel(projet.agence) : '—',
          nbImpayes: 0,
        }
      }
      if (r.statut === 'NON_PAYE') byBudget[key].nbImpayes++
    })

    // --- Nombre d'actions + statut contentieux par micro-projet, à partir de /recouvrements ---
    const actionsByProjet = new Map<number, number>()
    const contentieuxProjets = new Set<number>()
    recouvrements.forEach((r) => {
      actionsByProjet.set(r.micro_projet_id, (actionsByProjet.get(r.micro_projet_id) ?? 0) + 1)
      if (r.type_action === 'CONTENTIEUX') contentieuxProjets.add(r.micro_projet_id)
    })

    const aJourList: ProjetRecouvrement[] = []
    const legerList: ProjetRecouvrement[] = []
    const lourdList: ProjetRecouvrement[] = []
    const contentieuxList: ProjetRecouvrement[] = []

    Object.values(byBudget).forEach((agg) => {
      const mpId = agg.microProjetId
      const item: ProjetRecouvrement = {
        id: String(mpId ?? agg.titre),
        code: agg.code,
        titre: agg.titre,
        agence: agg.agence,
        contentieux: mpId ? contentieuxProjets.has(mpId) : false,
        nbImpayes: agg.nbImpayes,
        // Jours de retard : non présent dans le payload confirmé de /remboursements ou /plan-remboursements.
        retardJours: 0,
        resteDu: mpId ? (resteDuByProjet.get(mpId) ?? 0) : 0,
        nbActions: mpId ? (actionsByProjet.get(mpId) ?? 0) : 0,
      }

      if (item.contentieux) {
        contentieuxList.push(item)
      } else if (item.nbImpayes === 0) {
        aJourList.push(item)
      } else if (item.nbImpayes <= 3) {
        legerList.push(item)
      } else {
        lourdList.push(item)
      }
    })

    const actionsList: ActionRecouvrement[] = recouvrements.map((r) => {
      const agentId = r.agent_id ?? undefined
      const agent = r.agent ?? (agentId ? personnelById.get(agentId) : undefined)
      const projetLabel = r.micro_projet ? `${r.micro_projet.code} — ${r.micro_projet.intitule}` : `Projet #${r.micro_projet_id}`
      return {
        id: String(r.id),
        projetId: projetLabel,
        type: r.type_action,
        date: r.date_recouvrement ?? '',
        resultat: r.observations ?? RECOUV_TYPE_LABEL[r.type_action],
        piece: r.justificatif_path ?? undefined,
        agent: agent ? `${agent.prenom} ${agent.nom}` : agentId ? `Agent #${agentId}` : '—',
      }
    })

    return { aJour: aJourList, leger: legerList, lourd: lourdList, contentieux: contentieuxList, actions: actionsList }
  }, [remboursements, plansRemboursement, tableauAmortissements, recouvrements, budgets, personnels])

  const handleActionAmiable = (id: string) => {
    setFormPrefill({ micro_projet_id: Number(id) || undefined, type_action: 'APPEL' })
    setFormOpen(true)
  }

  const handleSortirPortefeuille = (id: string) => {
    const microProjetId = Number(id)
    if (!microProjetId) return
    // "Sortir du portefeuille" = journaliser une action de type CONTENTIEUX : le dossier
    // bascule alors automatiquement dans l'onglet Contentieux (cf. calcul ci-dessus).
    setFormPrefill({ micro_projet_id: microProjetId, type_action: 'CONTENTIEUX' })
    setFormOpen(true)
  }

  return {
    activeTab,
    setActiveTab,
    aJour,
    leger,
    lourd,
    contentieux,
    actions,
    garanties: MOCK_RECOUVREMENT_GARANTIES,
    handleActionAmiable,
    handleSortirPortefeuille,
    formOpen,
    setFormOpen,
    formPrefill,
  }
}
