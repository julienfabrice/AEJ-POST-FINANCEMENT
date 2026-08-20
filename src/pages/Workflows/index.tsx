import { useMemo, useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { WorkflowVersionsKanban } from './UI/WorkflowVersionsKanban'
import { workflowServices } from '@/services/workflow.services'
import type { WORKFLOW_VERSION_T } from '@/types'

export function WorkflowsPage() {
  const { data: versions, isLoading, isError } = workflowServices.useGetVersions()

  // Group versions by workflow.code
  const workflowsMap = useMemo(() => {
    if (!versions) return new Map<string, WORKFLOW_VERSION_T[]>()
    const map = new Map<string, WORKFLOW_VERSION_T[]>()
    versions.forEach(v => {
      if (!map.has(v.workflow.code)) {
        map.set(v.workflow.code, [])
      }
      map.get(v.workflow.code)?.push(v)
    })
    return map
  }, [versions])

  // Get unique workflows for tabs
  const uniqueWorkflows = useMemo(() => {
    if (!versions) return []
    const map = new Map<string, any>()
    versions.forEach(v => {
      if (!map.has(v.workflow.code)) {
        map.set(v.workflow.code, v.workflow)
      }
    })
    return Array.from(map.values())
  }, [versions])

  const [activeTab, setActiveTab] = useState<string>('')

  // Set initial tab
  useEffect(() => {
    if (uniqueWorkflows.length > 0 && !activeTab) {
      setActiveTab(uniqueWorkflows[0].code)
    }
  }, [uniqueWorkflows, activeTab])

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Chargement des workflows...</div>
  }

  if (isError) {
    return <div className="p-8 text-center text-red-500">Erreur lors du chargement des workflows.</div>
  }

  const currentVersions = activeTab ? (workflowsMap.get(activeTab) || []) : []

  return (
    <div className="space-y-6">

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <div className="overflow-x-auto w-full no-scrollbar">
          <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
            {uniqueWorkflows.map(w => (
              <TabsTrigger 
                key={w.code} 
                value={w.code}
                className="!bg-transparent !shadow-none after:hidden px-4 py-2.5 text-[13.5px] font-semibold text-slate-500 border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B] hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none"
              >
                {w.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-6 outline-none">
          <WorkflowVersionsKanban 
            versions={currentVersions} 
            activeWorkflowCode={activeTab} 
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
