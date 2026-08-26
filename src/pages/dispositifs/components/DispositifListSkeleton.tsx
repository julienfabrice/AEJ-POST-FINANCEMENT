import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DispositifListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="border border-[#E5EAF1] rounded-[11px] bg-white">
          <CardContent>
            <div className="flex items-center gap-[10px] mb-3">
              <Skeleton className="w-10 h-10 rounded-[10px] shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-5 w-[150px] rounded-md" />
                <Skeleton className="h-3 w-[100px] rounded-md" />
              </div>
              <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3.5">
              <Skeleton className="h-4 w-[220px] rounded-md" />
            </div>

            <div className="mt-3.5">
              <Skeleton className="h-8 w-[140px] rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
