import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { versionServices } from '@/services/workflow/versions.services'
import { projetsServices } from '@/services/projets.services'
import { MOCK_WORKFLOW } from '@/mock/guichet-workflow.mock'
import { Route } from '@/routes/_authenticated/_agent/dispositif-workflow/$workflowId'

export function useDispositifWorkflow() {
  const { workflowId } = useParams({ strict: false })
  const search = Route.useSearch()
  const dispositifId = search.dispositifId
  
  // Fetch from the real API using the workflow version ID
  const { data: _realWorkflowVersion, isLoading: isLoadingWf } = versionServices.useGetOneVersion(workflowId as string)

  // Fetch projects using the dispositif ID from search params
  const { data: projectsData, isLoading: isLoadingProj } = projetsServices.useGetAll(1, 100, { 
    dispositif_id: dispositifId ? String(dispositifId) : undefined 
  })

  const rawProjects = projectsData?.data || []
  
  // Map API projects to UI expected format
  const projects = rawProjects.map(p => ({
    id: p.id,
    code: p.code,
    titre: p.intitule,
    jeune: p.promoteur ? `${p.promoteur.prenom} ${p.promoteur.nom}` : 'N/A',
    montant: Number(p.montant_total) || 0,
    statut: 'bl', // default mapped color, could map p.statut dynamically
  }))

  const wf = _realWorkflowVersion ? {
    id: _realWorkflowVersion.id,
    title: _realWorkflowVersion.workflow.name,
    code: _realWorkflowVersion.workflow.code,
    version: _realWorkflowVersion.version,
    cycles: _realWorkflowVersion.etapes
      .filter((e) => !e.parent_etape_code)
      .sort((a, b) => a.order - b.order)
      .map((e) => ({
        n: e.order,
        code: e.code,
        t: e.name,
        subs: _realWorkflowVersion.etapes
          .filter((sub) => sub.parent_etape_code === e.code)
          .sort((a, b) => a.order - b.order)
          .map((sub) => ({
            t: sub.name,
            acteurs: sub.roles?.map((r) => r.role?.name || r.role_code).join(' · ') || undefined,
            liv: sub.deliverables?.map((d) => d.deliverable_code).join(' · ') || undefined,
            delai: sub.slas?.[0] ? `${sub.slas[0].duration_value} ${sub.slas[0].duration_unit.toLowerCase()}` : undefined,
            dec: undefined,
            note: sub.description
          }))
      }))
  } : MOCK_WORKFLOW

  const startN = 6 // Hardcoded start for AGR

  const totalMontant = projects.reduce((acc, p) => acc + p.montant, 0)
  
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCycles = wf.cycles.map(cycle => {
    if (!searchQuery) return cycle;
    
    const searchLower = searchQuery.toLowerCase();
    
    const matchesCycle = cycle.t.toLowerCase().includes(searchLower)
    
    const matchingSubs = cycle.subs.filter((sub: any) => 
      sub.t.toLowerCase().includes(searchLower) ||
      (sub.acteurs && sub.acteurs.toLowerCase().includes(searchLower)) ||
      (sub.liv && sub.liv.toLowerCase().includes(searchLower)) ||
      (sub.dec && sub.dec.toLowerCase().includes(searchLower))
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
    startN,
    totalMontant,
    searchQuery,
    setSearchQuery,
    filteredCycles,
    isLoading: isLoadingWf || isLoadingProj,
    projects
  }
}
