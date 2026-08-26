import { useState } from 'react'
import { Users, FileText, Clock, Flag, ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react'

export function WorkflowCycle({ cycle, projectsInCycle, startN, isDone, forceExpand }: { cycle: any, projectsInCycle: number, startN: number, isDone: boolean, forceExpand: boolean }) {
  const [isExpanded, setIsExpanded] = useState(cycle.n >= startN)
  const isInfo = cycle.n < startN
  const isCur = projectsInCycle > 0

  const expanded = forceExpand || isExpanded

  return (
    <div className={`relative pl-[40px] pb-1.5 mb-1.5`}>
      {/* Timeline line */}
      <div className="absolute left-[13px] top-[34px] bottom-[-6px] w-[2px] bg-[#E5EAF1]" />
      
      {/* Number circle */}
      <div className={`absolute left-0 top-[2px] w-[28px] h-[28px] rounded-[9px] flex items-center justify-center text-[13px] font-bold z-10 ${
        isInfo ? 'bg-[#8595A8] text-white opacity-60' : 
        isCur ? 'bg-[#E7722B] text-white ring-4 ring-[#FBEADE]' :
        isDone ? 'bg-[#20A83A] text-white' : 'bg-[#131C29] text-white'
      }`}>
        {cycle.n}
      </div>

      <div className={`bg-white border border-[#E5EAF1] rounded-[11px] shadow-[0_1px_2px_rgba(18,28,41,.05),0_6px_20px_rgba(18,28,41,.06)] overflow-hidden ${isInfo ? 'opacity-60 bg-[#f4f6fa] !shadow-none' : ''}`}>
        {/* Header */}
        <div 
          className={`flex items-center gap-[10px] p-[13px_16px] ${!isInfo ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={() => !isInfo && setIsExpanded(!isExpanded)}
        >
          <div className="min-w-0">
            <h4 className={`font-bold text-[14px] ${isInfo ? 'text-[#5A6B80]' : 'text-[#131C29]'}`}>{cycle.t}</h4>
            <div className="font-mono text-[11px] text-[#8595A8] mt-0.5">{cycle.code}</div>
          </div>
          <div className="flex-1" />
          {isInfo ? (
            <span className="px-2 py-0.5 rounded-full bg-[#f3f5f8] text-[#5a6b80] text-[10px] font-bold">Information</span>
          ) : isCur ? (
            <span className="px-2 py-0.5 rounded-full bg-[#FBEADE] text-[#C85E18] text-[10px] font-bold">
              {projectsInCycle} dossier(s) ici
            </span>
          ) : null}
          {!isInfo && (
            <div className="text-[#8595A8]">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          )}
        </div>

        {/* Body */}
        {expanded && !isInfo && (
          <div className="p-[0_16px_16px] border-t border-[#EEF2F7]">
            {isCur && (
              <div className="my-[14px] mb-[4px]">
                <button className="flex items-center gap-[7px] bg-[#E7722B] text-white px-[10px] py-[6px] rounded-[8px] text-[12px] font-semibold hover:bg-[#C85E18] transition-colors shadow-[0_4px_12px_rgba(238,123,26,.28)]">
                  <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
                  Faire évoluer les dossiers ({projectsInCycle})
                </button>
              </div>
            )}
            
            <div className="mt-[14px]">
              {cycle.subs.map((sub: any, idx: number) => (
                <div key={idx} className="pl-[16px] py-[4px] mt-[14px] border-l-2 border-[#EEF2F7] mb-2">
                  <h5 className="font-bold text-[#131C29] text-[13px] mb-[6px]">{sub.t}</h5>
                  <div className="flex flex-wrap gap-[6px] text-[12px] text-[#5A6B80]">
                    {sub.acteurs && (
                      <span className="flex items-center gap-[4px]">
                        <Users className="w-[13px] h-[13px] opacity-80" />
                        <b className="text-[#131C29]">{sub.acteurs}</b>
                      </span>
                    )}
                    {sub.liv && (
                      <span className="flex items-center gap-[4px]">
                        <FileText className="w-[13px] h-[13px] opacity-80" />
                        <span>{sub.liv}</span>
                      </span>
                    )}
                    {sub.delai && (
                      <span className="flex items-center gap-[4px]">
                        <Clock className="w-[13px] h-[13px] opacity-80" />
                        <span>{sub.delai}</span>
                      </span>
                    )}
                    {sub.dec && (
                      <span className="flex items-center gap-[4px] text-[#C85E18]">
                        <Flag className="w-[13px] h-[13px]" />
                        Décision : {sub.dec}
                      </span>
                    )}
                    {sub.note && (
                      <span className="bg-[#FBEADE] text-[#C85E18] px-[6px] py-[2px] rounded border border-transparent">
                        {sub.note}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
