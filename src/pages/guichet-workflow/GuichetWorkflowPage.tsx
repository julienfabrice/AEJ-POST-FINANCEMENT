import { useGuichetWorkflow } from './hooks/useGuichetWorkflow'
import { GuichetWorkflowHeader } from './UI/GuichetWorkflowHeader'
import { GuichetWorkflowSidebar } from './UI/GuichetWorkflowSidebar'
import { GuichetWorkflowSkeleton } from './UI/GuichetWorkflowSkeleton'
import { WorkflowTimeline } from './components/WorkflowTimeline'

export function GuichetWorkflowPage() {
  const {
    wf,
    startN,
    totalMontant,
    searchQuery,
    setSearchQuery,
    filteredCycles,
    isLoading,
    projects
  } = useGuichetWorkflow()

  if (isLoading) {
    return <GuichetWorkflowSkeleton />
  }

  return (
    <div className="flex flex-col lg:h-[calc(100vh-195px)]">
      {/* Header */}
      <GuichetWorkflowHeader 
        wf={wf} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <div className="flex-1 min-w-0 lg:min-h-0">
        <div className="lg:h-full grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-[22px] items-start">
          
          {/* Main Workflow Timeline */}
          <WorkflowTimeline 
            wf={wf}
            filteredCycles={filteredCycles}
            searchQuery={searchQuery}
            startN={startN}
            projects={projects}
          />

          {/* Right Sidebar - Micro-projects */}
          <GuichetWorkflowSidebar 
            projects={projects}
            totalMontant={totalMontant}
          />

        </div>
      </div>
    </div>
  )
}
