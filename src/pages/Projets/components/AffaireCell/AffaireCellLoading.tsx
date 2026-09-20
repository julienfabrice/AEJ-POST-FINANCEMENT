import { Loader2 } from 'lucide-react'

export function AffaireCellLoading() {
  return (
    <div className="flex items-center h-full">
      <Loader2 className="w-3.5 h-3.5 text-slate-300 animate-spin" />
    </div>
  )
}
