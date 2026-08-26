import { useDispositifWorkflow } from './hooks/useDispositifWorkflow'
import { DispositifWorkflowHeader } from './UI/DispositifWorkflowHeader'
import { DispositifWorkflowSidebar } from './UI/DispositifWorkflowSidebar'
import { DispositifWorkflowSkeleton } from './UI/DispositifWorkflowSkeleton'
import { WorkflowTimeline } from './components/WorkflowTimeline'

export function DispositifWorkflowPage() {
  const {
    wf,
    startN,
    totalMontant,
    searchQuery,
    setSearchQuery,
    filteredCycles,
    isLoading,
    projects
  } = useDispositifWorkflow()

  if (isLoading) {
    return <DispositifWorkflowSkeleton />
  }

  return (
    <div className="flex flex-col lg:h-[calc(100vh-195px)]">
      {/* Header */}
      <DispositifWorkflowHeader 
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
          <DispositifWorkflowSidebar 
            projects={projects}
            totalMontant={totalMontant}
          />

        </div>
      </div>
    </div>
  )
}
