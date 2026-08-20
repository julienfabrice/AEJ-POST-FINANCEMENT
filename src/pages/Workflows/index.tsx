import { useMemo, useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

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
    return (
      <div className="space-y-6">
        {/* Skeleton Tabs */}
        <div className="flex items-center gap-4 border-b border-slate-200 pb-[1px]">
          <Skeleton className="h-10 w-32 rounded-none border-b-2 border-slate-300" />
          <Skeleton className="h-10 w-24 rounded-none" />
          <Skeleton className="h-10 w-40 rounded-none" />
        </div>
        
        {/* Skeleton Kanban Columns */}
        <div className="flex gap-6 overflow-hidden mt-6">
          {[1, 2].map((i) => (
            <div key={i} className="min-w-[550px] w-[550px] h-[calc(100vh-280px)] bg-slate-50 border border-slate-200 rounded-xl flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-white h-[68px] flex items-center justify-between">
                <div className="flex items-center gap-2 w-full">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
              <div className="p-4 space-y-4 flex-1">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="bg-white rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Skeleton className="h-6 w-8 rounded-md bg-slate-900" />
                      <Skeleton className="h-5 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20 rounded-md" />
                      <Skeleton className="h-6 w-24 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Skeleton "Ajouter une version" */}
          <div className="min-w-[400px] w-[400px] h-[calc(100vh-280px)] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50/50">
             <Skeleton className="h-14 w-14 rounded-full mb-4" />
             <Skeleton className="h-6 w-40 mb-2" />
             <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </div>
    )
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
