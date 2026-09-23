import { Check, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChaineValidationProps {
  chaine: { role: string; statut: 'done' | 'current' | 'pending'; originalIndex: number }[]
  totalSteps: number
  visibleStartIndex: number
}

export function ChaineValidation({ chaine, totalSteps, visibleStartIndex }: ChaineValidationProps) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1">
      {visibleStartIndex > 0 && (
        <div className="flex items-center shrink-0 text-slate-300 mr-2 mb-4">
          ...
          <ChevronRight className="w-4 h-4 mx-2" />
        </div>
      )}
      {chaine.map((step, i) => (
        <div key={i} className="flex items-center shrink-0">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-none',
                step.statut === 'done'    && 'bg-green-500 text-white',
                step.statut === 'current' && 'bg-[#E7722B] text-white ring-2 ring-[#E7722B]/30 ring-offset-1',
                step.statut === 'pending' && 'bg-slate-200 text-slate-400',
              )}
            >
              {step.statut === 'done' ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <span>{step.originalIndex + 1}</span>
              )}
            </div>
            <span
              className={cn(
                'text-[11px] font-semibold text-center leading-tight w-24',
                step.statut === 'current' ? 'text-[#E7722B]' : 'text-slate-500'
              )}
            >
              {step.role}
            </span>
          </div>
          {i < chaine.length - 1 && (
            <ChevronRight className={cn("w-4 h-4 mx-2 mb-4 shrink-0", step.statut === 'done' ? 'text-green-300' : 'text-slate-200')} />
          )}
        </div>
      ))}
      {(visibleStartIndex + chaine.length) < totalSteps && (
        <div className="flex items-center shrink-0 text-slate-300 ml-2 mb-4">
          <ChevronRight className="w-4 h-4 mx-2" />
          ...
        </div>
      )}
    </div>
  )
}
