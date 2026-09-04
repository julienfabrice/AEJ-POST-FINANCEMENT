import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { versionServices } from '@/services/workflow/versions.services'
import { projetsServices } from '@/services/projets.services'
import { MOCK_WORKFLOW } from '@/mock/guichet-workflow.mock'
import { Route } from '@/routes/_authenticated/_agent/dispositif-workflow/$workflowId'
import type { WORKFLOW_ETAPE_T } from '@/types'

export function useDispositifWorkflow() {
  const { workflowId } = useParams({ strict: false })
  const search = Route.useSearch()
  const dispositifId = search.dispositifId
  
  const [page, setPage] = useState(1)
  const perPage = 10

  // Fetch from the real API using the workflow version ID
  const { data: _realWorkflowVersion, isLoading: isLoadingWf } = versionServices.useGetOneVersion(workflowId as string)

  // Fetch projects using the dispositif ID from search params
  const { data: projectsData, isLoading: isLoadingProj } = projetsServices.useGetAll(page, perPage, { 
    dispositif_id: dispositifId ? String(dispositifId) : undefined 
  })

  const rawProjects = projectsData?.data || []
  const pagination = projectsData?.pagination
  const totalProjects = pagination?.total || 0
  
  // Map API projects to UI expected format
  const projects = rawProjects.map(p => ({
    id: p.id,
    code: p.code,
    titre: p.intitule,
    jeune: p.promoteur ? `${p.promoteur.prenom} ${p.promoteur.nom}` : 'N/A',
    montant: Number(p.montant_total) || 0,
    statut: 'bl',
  }))

  // Toutes les étapes brutes (parents + sous-étapes) — utilisées par WorkflowCycle
  const allEtapes: WORKFLOW_ETAPE_T[] = _realWorkflowVersion?.etapes || []

  // Étapes principales (sans parent), triées par ordre — pour la timeline
  const rootEtapes = allEtapes
    .filter(e => !e.parent_etape_code)
    .sort((a, b) => a.order - b.order)

  // Format legacy pour les cycles (identifiant par `n`) — utilisé pour la recherche et la progression
  const wf = _realWorkflowVersion ? {
    id: _realWorkflowVersion.id,
    title: _realWorkflowVersion.workflow.name,
    code: _realWorkflowVersion.workflow.code,
    version: _realWorkflowVersion.version,
    cycles: rootEtapes.map(e => ({
      n: e.order,
      code: e.code,
      t: e.name,
      // Les sous-étapes sont maintenant gérées via allEtapes dans WorkflowCycle
      // On garde subs pour la recherche (filtrée sur les données brutes disponibles)
      subs: allEtapes
        .filter(sub => sub.parent_etape_code === e.code)
        .sort((a, b) => a.order - b.order)
        .map(sub => ({
          t: sub.name,
          // La recherche porte sur le nom et la description — les données acteurs/liv/delai
          // sont chargées dynamiquement par SubEtapeRow via les hooks API
          note: sub.description,
        }))
    }))
  } : MOCK_WORKFLOW

  // startN : premier order des étapes racines du workflow réel, ou 6 par défaut (AGR)
  const startN = rootEtapes.length > 0
    ? (rootEtapes[0].order)
    : 6

  const totalMontant = projects.reduce((acc, p) => acc + p.montant, 0)
  
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCycles = wf.cycles.map(cycle => {
    if (!searchQuery) return cycle

    const searchLower = searchQuery.toLowerCase()

    const matchesCycle = cycle.t.toLowerCase().includes(searchLower)
    const matchingSubs = cycle.subs.filter((sub: any) =>
      sub.t.toLowerCase().includes(searchLower) ||
      (sub.note && sub.note.toLowerCase().includes(searchLower))
    )

    if (matchesCycle || matchingSubs.length > 0) {
      return {
        ...cycle,
        subs: matchesCycle ? cycle.subs : matchingSubs
      }
    }
    return null
  }).filter(Boolean)

  return {
    wf,
    allEtapes,
    startN,
    totalMontant,
    searchQuery,
    setSearchQuery,
    filteredCycles,
    isLoading: isLoadingWf || isLoadingProj,
    projects,
    totalProjects,
    page,
    setPage,
    totalPages: pagination?.last_page || 1
  }
}
