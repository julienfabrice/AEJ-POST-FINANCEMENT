import { Skeleton } from '@/components/ui/skeleton'

export function ListSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-450px)]">
      <div className="border-b border-slate-200 bg-slate-50/50 p-3 flex gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} className="h-6 flex-1" />
        ))}
      </div>
      <div className="p-3 flex-1 space-y-4 mt-2">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} className="flex gap-4">
            {[1, 2, 3, 4, 5, 6].map(j => (
              <Skeleton key={j} className="h-8 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
