import type { WORKFLOW_ETAPE_T, WORKFLOW_ETAPE_ROLE_T } from '@/types'

interface WorkflowTabItemProps {
  step: WORKFLOW_ETAPE_T
  index: number
  currentIndex: number
  isAcheve: boolean
  allEtapeRoles: WORKFLOW_ETAPE_ROLE_T[] | undefined
  isLast: boolean
}

export function WorkflowTabItem({ step, index, currentIndex, isAcheve, allEtapeRoles, isLast }: WorkflowTabItemProps) {
  let statut: 'done' | 'current' | 'pending' = 'pending'
  if (currentIndex === -1) {
    if (isAcheve) statut = 'done'
  } else if (index < currentIndex) {
    statut = 'done'
  } else if (index === currentIndex) {
    statut = 'current'
  }

  const etapeRoles = allEtapeRoles?.filter(r => r.etape_code === step.code) || []
  const rolesDesc = etapeRoles.map(r => r.role_code).join(' · ')
  const desc = statut === 'done' 
    ? `Cycle traité${rolesDesc ? ` — ${rolesDesc}` : ''}`
    : statut === 'current'
    ? `En cours${rolesDesc ? ` — ${rolesDesc}` : ''}`
    : 'À venir'

  return (
    <div className="relative pl-[24px] mb-6 last:mb-0">
      {/* Ligne verticale (sauf pour le dernier élément) */}
      {!isLast && (
        <div className="absolute left-[5px] top-[14px] bottom-[-16px] w-[2px] bg-aej-line z-0" />
      )}
      
      {/* Pastille */}
      {statut === 'done' && (
        <div className="absolute left-[0.5px] top-[5px] w-[11px] h-[11px] rounded-full bg-aej-green z-10" />
      )}
      {statut === 'current' && (
        <div className="absolute left-[-0.5px] top-[4px] w-[13px] h-[13px] rounded-full border-[3px] border-aej-orange bg-aej-bg z-10" />
      )}
      {statut === 'pending' && (
        <div className="absolute left-[0.5px] top-[5px] w-[11px] h-[11px] rounded-full border-[2.5px] border-aej-line bg-aej-bg z-10" />
      )}
      
      {/* Contenu */}
      <div>
        <h5 className={`font-bold text-[14px] leading-tight ${statut === 'current' ? 'text-aej-orange' : 'text-aej-ink'}`}>
          {step.code} · {step.name}
        </h5>
        <div className="text-[13px] text-aej-slate mt-1">
          {desc}
        </div>
      </div>
    </div>
  )
}
