import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { versionServices } from '@/services/workflow/versions.services'
import { MOCK_WORKFLOW, MOCK_PROJECTS } from '@/mock/guichet-workflow.mock'

export function useDispositifWorkflow() {
  const { workflowId } = useParams({ strict: false })
  
  // Fetch from the real API using the workflow version ID
  const { data: _realWorkflowVersion, isLoading: _isLoading } = versionServices.useGetOneVersion(workflowId as string)

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

  const totalMontant = MOCK_PROJECTS.reduce((acc, p) => acc + p.montant, 0)
  
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
    isLoading: _isLoading,
    projects: MOCK_PROJECTS
  }
}
