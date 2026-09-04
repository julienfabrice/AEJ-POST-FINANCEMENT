import { useState } from 'react'
import { Users, FileText, Clock, ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { workflowServices } from '@/services/workflow'
import type {
  WORKFLOW_ETAPE_T,
  WORKFLOW_ETAPE_ROLE_T,
  WORKFLOW_ETAPE_DELIVERABLE_T,
  WORKFLOW_ETAPE_SLA_T,
} from '@/types'

interface WorkflowCycleProps {
  etape: WORKFLOW_ETAPE_T
  allEtapes: WORKFLOW_ETAPE_T[]
  projectsInCycle: number
  startN: number
  isDone: boolean
  forceExpand: boolean
}

// ─── Contenu (SLA / Livrables / Rôles) en lecture seule ──────────────────────
function EtapeContent({ etapeCode }: { etapeCode: string }) {
  const { data: slas,         isLoading: slasLoading  } = workflowServices.useGetEtapeSlas(etapeCode)
  const { data: deliverables, isLoading: delivLoading } = workflowServices.useGetEtapeDeliverables(etapeCode)
  const { data: roles,        isLoading: rolesLoading } = workflowServices.useGetEtapeRoles(etapeCode)

  return (
    <CardContent className="px-4 pb-4 block pt-4">

      {/* ── Durée & SLA ── */}
      <div className="mb-5">
        <h5 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Durée & SLA
        </h5>
        {slasLoading ? (
          <div className="border-l-2 border-[#EEF2F7] pl-4 pt-2 pb-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ) : !slas || slas.length === 0 ? (
          <p className="text-slate-400 text-xs italic">Aucun SLA configuré</p>
        ) : (
          slas.map((sla: WORKFLOW_ETAPE_SLA_T) => (
            <div key={sla.id} className="border-l-2 border-[#EEF2F7] pt-3 pb-2 pl-4 mt-2">
              {sla.description && (
                <p className="text-[13px] text-slate-800 font-bold mb-1">{sla.description}</p>
              )}
              {sla.delay_type && (
                <p className="text-[12px] text-slate-500 mb-1.5">
                  Type : <span className="font-semibold text-slate-900">{sla.delay_type}</span>
                </p>
              )}
              <span className="text-[11.5px] bg-[#f4f6fa] border border-[#EEF2F7] rounded-[7px] px-2.5 py-1 inline-flex gap-1.5 items-center text-[#5A6B80]">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <b className="text-[#131C29] font-semibold">{sla.duration_value} {sla.duration_unit}</b>
              </span>
            </div>
          ))
        )}
      </div>

      {/* ── Documents / Livrables ── */}
      <div className="mb-5 pt-3 border-t border-[#EEF2F7]">
        <h5 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Documents / Livrables
        </h5>
        {delivLoading ? (
          <div className="flex gap-2">
            <Skeleton className="h-7 w-[120px] rounded-[7px]" />
            <Skeleton className="h-7 w-[90px] rounded-[7px]" />
          </div>
        ) : !deliverables || deliverables.length === 0 ? (
          <p className="text-slate-400 text-xs italic">Aucun document requis</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {deliverables.map((d: WORKFLOW_ETAPE_DELIVERABLE_T) => (
              <span
                key={d.id}
                className="shrink-0 text-[11.5px] bg-[#f4f6fa] border border-[#EEF2F7] rounded-[7px] px-2.5 py-1 text-[#5A6B80] inline-flex gap-1.5 items-center"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span title={d.deliverable_code}>{d.deliverable_code}</span>
                {d.is_required && (
                  <span className="text-red-500 font-bold shrink-0" title="Obligatoire">*</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Acteurs / Rôles ── */}
      <div className="pt-3 border-t border-[#EEF2F7]">
        <h5 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Acteurs / Rôles
        </h5>
        {rolesLoading ? (
          <Skeleton className="w-[170px] h-12 rounded-md" />
        ) : !roles || roles.length === 0 ? (
          <p className="text-slate-400 text-xs italic">Aucun rôle défini</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {roles.map((r: WORKFLOW_ETAPE_ROLE_T) => (
              <div
                key={r.id}
                className="shrink-0 bg-white border border-[#EEF2F7] rounded-md px-2.5 py-2 flex items-center gap-2.5 shadow-sm"
              >
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11.5px] font-semibold text-slate-800 truncate leading-tight" title={r.role?.name || r.role_code}>
                    {r.role?.name || r.role_code}
                  </p>
                  {r.action && (
                    <p className="text-[10.5px] text-slate-500 truncate leading-tight mt-0.5">{r.action}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CardContent>
  )
}

// ─── Sous-étape : s'inscrit directement dans la timeline principale ───────────
//  Visuellement : indentée à droite, connectée par une branche horizontale depuis la
//  ligne verticale de la timeline principale (left-[13px] du conteneur parent).
function SubEtapeItem({
  sub,
  allEtapes,
  numero,
}: {
  sub: WORKFLOW_ETAPE_T
  allEtapes: WORKFLOW_ETAPE_T[]
  numero: string
}) {
  // Sous-sous-étapes éventuelles
  const children = allEtapes
    .filter(e => e.parent_etape_code === sub.code)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    /*
      Conteneur de la sous-étape.
      pl-[70px]  : card commence à 70px (main card est à 40px → +30px d'indentation)
      La ligne verticale de la timeline principale (left-[13px]) traverse ce div.
      Un trait horizontal va de 13px → 40px (badge de la sous-étape).
    */
    <div className="relative pl-[70px] mt-3">

      {/* Trait horizontal : de la timeline principale jusqu'au badge */}
      <div className="absolute left-[13px] top-[14px] w-[27px] h-[2px] bg-[#E5EAF1]" />

      {/* Badge numéroté de la sous-étape */}
      <div className="absolute left-[40px] top-[5px] w-[22px] h-[22px] rounded-[7px] bg-[#E7722B] text-white flex items-center justify-center font-bold text-[10px] z-10">
        {numero}
      </div>

      {/* Card de la sous-étape */}
      <Card className="bg-white border-[#E5EAF1] rounded-[7px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden p-0 gap-0 border-l-4 border-l-[#E7722B]">

        {/* En-tête */}
        <div className="px-4 py-[11px] bg-slate-50 border-b border-[#EEF2F7]">
          <h4 className="text-[13.5px] font-bold text-[#131C29]">{sub.name}</h4>
          <div className="text-[11px] text-[#5A6B80] font-mono mt-0.5">{sub.code}</div>
        </div>

        {/* Contenu : SLA, livrables, rôles */}
        <EtapeContent etapeCode={sub.code} />

        {/* Sous-sous-étapes récursives */}
        {children.length > 0 && (
          <div className="px-4 pb-4 pt-1 border-t border-dashed border-[#E5EAF1]">
            {children.map((child, cidx) => (
              <SubEtapeItem
                key={child.id}
                sub={child}
                allEtapes={allEtapes}
                numero={`${numero}.${child.order || cidx + 1}`}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

// ─── Étape principale (cycle de la timeline) ─────────────────────────────────
export function WorkflowCycle({
  etape,
  allEtapes,
  projectsInCycle,
  startN,
  isDone,
  forceExpand,
}: WorkflowCycleProps) {
  const [isExpanded, setIsExpanded] = useState(etape.order >= startN)
  const isInfo = etape.order < startN
  const isCur  = projectsInCycle > 0
  const expanded = forceExpand || isExpanded

  const subEtapes = allEtapes
    .filter(e => e.parent_etape_code === etape.code)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    /*
      pl-[40px] : espace pour le numéro rond (left-0) et la timeline (left-[13px]).
      La ligne verticale (bottom-[-6px]) descend jusqu'au prochain item,
      et traverse également les sous-étapes qui sont rendues dans ce même conteneur.
    */
    <div className="relative pl-[40px] pb-1.5 mb-1.5">

      {/* Ligne verticale de la timeline */}
      <div className="absolute left-[13px] top-[34px] bottom-[-6px] w-[2px] bg-[#E5EAF1]" />

      {/* Numéro de l'étape principale */}
      <div className={`absolute left-0 top-[2px] w-[28px] h-[28px] rounded-[9px] flex items-center justify-center text-[13px] font-bold z-10 ${
        isInfo ? 'bg-[#8595A8] text-white opacity-60' :
        isCur  ? 'bg-[#E7722B] text-white ring-4 ring-[#FBEADE]' :
        isDone ? 'bg-[#20A83A] text-white' : 'bg-[#131C29] text-white'
      }`}>
        {etape.order}
      </div>

      {/* ── Card de l'étape principale ── */}
      <div className={`bg-white border border-[#E5EAF1] rounded-[11px] shadow-[0_1px_2px_rgba(18,28,41,.05),0_6px_20px_rgba(18,28,41,.06)] overflow-hidden ${
        isInfo ? 'opacity-60 bg-[#f4f6fa] !shadow-none' : ''
      }`}>
        {/* En-tête cliquable */}
        <div
          className={`flex items-center gap-[10px] p-[13px_16px] ${!isInfo ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={() => !isInfo && setIsExpanded(!isExpanded)}
        >
          <div className="min-w-0">
            <h4 className={`font-bold text-[14px] ${isInfo ? 'text-[#5A6B80]' : 'text-[#131C29]'}`}>
              {etape.name}
            </h4>
            <div className="font-mono text-[11px] text-[#8595A8] mt-0.5">{etape.code}</div>
          </div>
          <div className="flex-1" />
          {isInfo ? (
            <span className="px-2 py-0.5 rounded-full bg-[#f3f5f8] text-[#5a6b80] text-[10px] font-bold">
              Information
            </span>
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

        {/* Corps expandable (uniquement si l'étape n'a pas de sous-étapes) */}
        {expanded && !isInfo && subEtapes.length === 0 && (
          <div className="border-t border-[#EEF2F7]">
            {isCur && (
              <div className="px-4 pt-4">
                <button className="flex items-center gap-[7px] bg-[#E7722B] text-white px-[10px] py-[6px] rounded-[8px] text-[12px] font-semibold hover:bg-[#C85E18] transition-colors shadow-[0_4px_12px_rgba(238,123,26,.28)]">
                  <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
                  Faire évoluer les dossiers ({projectsInCycle})
                </button>
              </div>
            )}
            <EtapeContent etapeCode={etape.code} />
          </div>
        )}

        {/* Corps expandable quand il y a des sous-étapes : juste le bouton d'action */}
        {expanded && !isInfo && subEtapes.length > 0 && isCur && (
          <div className="border-t border-[#EEF2F7] px-4 py-3">
            <button className="flex items-center gap-[7px] bg-[#E7722B] text-white px-[10px] py-[6px] rounded-[8px] text-[12px] font-semibold hover:bg-[#C85E18] transition-colors shadow-[0_4px_12px_rgba(238,123,26,.28)]">
              <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
              Faire évoluer les dossiers ({projectsInCycle})
            </button>
          </div>
        )}
      </div>

      {/* ── Sous-étapes : directement dans la timeline, hors de la card principale ── */}
      {expanded && !isInfo && subEtapes.length > 0 && (
        <div className="pb-3">
          {subEtapes.map((sub, idx) => (
            <SubEtapeItem
              key={sub.id}
              sub={sub}
              allEtapes={allEtapes}
              numero={`${etape.order}.${sub.order || idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
