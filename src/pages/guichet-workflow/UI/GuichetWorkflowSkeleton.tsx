import { Skeleton } from '@/components/ui/skeleton'

export function GuichetWorkflowSkeleton() {
  return (
    <div className="flex flex-col lg:h-[calc(100vh-195px)]">
      {/* Header Skeleton */}
      <div className="flex-none flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="flex items-start justify-between gap-4 min-w-0 flex-1">
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-7 w-[250px] md:w-[350px] rounded-md" />
            <Skeleton className="h-4 w-[200px] md:w-[280px] rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto flex-none">
          <Skeleton className="h-[38px] w-full md:w-[240px] rounded-[9px]" />
          <Skeleton className="hidden md:block h-[38px] w-[140px] rounded-lg" />
        </div>
      </div>

      <div className="flex-1 min-w-0 lg:min-h-0">
        <div className="lg:h-full grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-[22px] items-start">
          
          {/* Main Workflow Timeline Skeleton */}
          <div className="lg:h-full lg:overflow-y-hidden lg:pr-[10px] lg:pb-[40px] lg:-mr-[10px]">
            <Skeleton className="h-5 w-[200px] mb-6 rounded-md" />
            
            <div className="relative space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="relative pl-[40px] pb-1.5 mb-1.5">
                  <div className="absolute left-[13px] top-[34px] bottom-[-6px] w-[2px] bg-[#E5EAF1]" />
                  <Skeleton className="absolute left-0 top-[2px] w-[28px] h-[28px] rounded-[9px]" />
                  
                  <div className="bg-white border border-[#E5EAF1] rounded-[11px] p-[13px_16px] shadow-sm flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-[180px] md:w-[250px] rounded-md" />
                      <Skeleton className="h-3 w-[100px] rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-[60px] rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="lg:h-full flex flex-col pb-[60px] lg:pb-0">
            <div className="bg-white border border-[#E5EAF1] rounded-[11px] flex flex-col lg:max-h-full">
              <div className="flex-none p-[15px_18px] border-b border-[#EEF2F7] flex items-center justify-between">
                <Skeleton className="h-5 w-[150px] rounded-md" />
                <Skeleton className="h-5 w-[25px] rounded-full" />
              </div>
              
              <div className="flex-none p-[12px_18px] border-b border-[#E5EAF1] flex justify-between items-center">
                <Skeleton className="h-4 w-[120px] rounded-md" />
                <Skeleton className="h-4 w-[80px] rounded-md" />
              </div>

              <div className="flex-1 p-[10px] space-y-[4px]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-[11px] p-[6px_8px] rounded-[8px]">
                    <Skeleton className="w-[8px] h-[8px] rounded-full flex-none" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <Skeleton className="h-4 w-full max-w-[150px] rounded-md" />
                      <Skeleton className="h-3 w-full max-w-[120px] rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-[35px] rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
