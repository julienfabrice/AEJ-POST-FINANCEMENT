import { Skeleton } from '@/components/ui/skeleton'

export function KanbanSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-hidden pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 h-[calc(100vh-420px)] min-h-[400px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex-shrink-0 w-80 flex flex-col bg-slate-50/50 rounded-xl border border-slate-200 h-full">
          <div className="p-3 border-b border-slate-200 bg-white rounded-t-xl shrink-0 flex items-center justify-between">
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-5 w-8 rounded-md" />
          </div>
          <div className="p-3 space-y-3">
            {[1, 2, 3].map(j => (
              <div key={j} className="bg-white p-3.5 rounded-lg border border-slate-100 shadow-sm space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-5 w-3/4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-50">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
