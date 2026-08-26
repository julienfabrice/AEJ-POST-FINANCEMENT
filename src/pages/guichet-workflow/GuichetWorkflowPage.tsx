import { versionServices } from '@/services/workflow/versions.services';

import { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { 
  Users, 
  FileText, 
  Clock, 
  Flag, 
  Search,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft
} from 'lucide-react'
import { MOCK_WORKFLOW, MOCK_PROJECTS } from '@/mock/guichet-workflow.mock'

// Helper for formatting money
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount)
}

// Sub-component for a cycle
function WorkflowCycle({ cycle, projectsInCycle, startN, isDone, forceExpand }: { cycle: any, projectsInCycle: number, startN: number, isDone: boolean, forceExpand: boolean }) {
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


export function GuichetWorkflowPage() {
  const { workflowId } = useParams({ strict: false })
  
  // Fetch from the real API using the workflow version ID
  const { data: _realWorkflowVersion, isLoading: _isLoading } = versionServices.useGetOneVersion(workflowId as string)

  // TODO: We continue using MOCK_WORKFLOW for the UI until the real API data is fully mapped
  const wf = MOCK_WORKFLOW
  const startN = 6 // Hardcoded start for AGR

  const totalMontant = MOCK_PROJECTS.reduce((acc, p) => acc + p.montant, 0)
  
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCycles = wf.cycles.map(cycle => {
    if (!searchQuery) return cycle;
    
    const searchLower = searchQuery.toLowerCase();
    
    // search in cycle title
    const matchesCycle = cycle.t.toLowerCase().includes(searchLower)
    
    // search in sub steps
    const matchingSubs = cycle.subs.filter((sub: any) => 
      sub.t.toLowerCase().includes(searchLower) ||
      (sub.acteurs && sub.acteurs.toLowerCase().includes(searchLower)) ||
      (sub.liv && sub.liv.toLowerCase().includes(searchLower)) ||
      (sub.dec && sub.dec.toLowerCase().includes(searchLower))
    )

    if (matchesCycle || matchingSubs.length > 0) {
      return {
        ...cycle,
        subs: matchesCycle ? cycle.subs : matchingSubs
      }
    }
    return null
  }).filter(Boolean)

  return (
    <div className="flex flex-col lg:h-[calc(100vh-195px)]">
      {/* Header Standard du Layout de Page */}
      <div className="flex-none flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        
        <div className="flex items-start justify-between gap-4 min-w-0 flex-1">
          {/* Title Area */}
          <div className="min-w-0">
            <h1 className="text-[19px] font-bold text-[#131C29] flex flex-wrap items-center gap-2">
              <span className="truncate">{wf.title}</span>
              <span className="flex-none px-2 py-0.5 rounded text-[11px] font-bold bg-[#F3F5F8] text-[#5A6B80]">
                GUICH-002
              </span>
            </h1>
            <p className="text-[12.5px] text-[#5A6B80] mt-[1px] truncate">
              Procédure {wf.code} · {wf.cycles.length} cycles · version {wf.version}
            </p>
          </div>
          
          {/* Bouton Retour (Mobile uniquement : en haut à droite) */}
          <div className="md:hidden flex-none">
            <Link 
              to="/dispositifs" 
              className="flex items-center justify-center gap-1 border border-[#E5EAF1] bg-white hover:bg-[#F3F5F8] text-[#5A6B80] px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-none">
          {/* Barre de recherche */}
          <div className="flex items-center gap-2 bg-white border border-[#E5EAF1] rounded-[9px] px-3 py-2 flex-1 md:flex-none md:w-[240px] text-[#5A6B80] focus-within:border-[#cdd6e2] focus-within:shadow-sm transition-all">
            <Search className="w-4 h-4 shrink-0 text-[#8595A8]" />
            <input 
              type="text" 
              placeholder="Rechercher une étape…" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none outline-none bg-transparent font-inherit text-[13px] w-full placeholder:text-[#8595A8] text-[#131C29]"
            />
          </div>

          {/* Bouton Retour (Desktop uniquement : à côté de la recherche) */}
          <Link 
            to="/dispositifs" 
            className="hidden md:flex items-center justify-center gap-1.5 border border-[#E5EAF1] bg-white hover:bg-[#F3F5F8] text-[#5A6B80] px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour aux guichets
          </Link>
        </div>
      </div>

      <div className="flex-1 min-w-0 lg:min-h-0">
        <div className="lg:h-full grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-[22px] items-start">
          
          {/* Main Workflow Timeline */}
          <div className="lg:h-full lg:overflow-y-auto lg:pr-[10px] lg:pb-[40px] lg:-mr-[10px]">
            <h2 className="text-[14px] font-bold text-[#5A6B80] uppercase tracking-wider mb-6 lg:sticky lg:top-0 bg-[#F3F5F8] py-2 z-10">
              Progression dans les {wf.cycles.length} cycles
            </h2>
            
            <div className="relative">
              {filteredCycles.length === 0 ? (
                <div className="text-center py-10 text-[#5A6B80] bg-white border border-[#E5EAF1] rounded-[11px] border-dashed">
                  Aucune étape ne correspond à votre recherche.
                </div>
              ) : (
                filteredCycles.map((cycle, index) => {
                  const projectsInCycle = MOCK_PROJECTS.filter(p => p.etape === cycle.n).length
                  const isDone = MOCK_PROJECTS.some(p => p.etape > cycle.n)
                  
                  return (
                    <div key={cycle.n}>
                      {cycle.n === startN && (
                        <div className="relative ml-[40px] mt-[4px] mb-[14px] pt-[10px] border-t-2 border-dashed border-[#E7722B] flex">
                          <span className="text-[11.5px] font-bold text-[#C85E18] bg-[#FBEADE] rounded-[20px] px-[12px] py-[4px] -mt-[25px]">
                            <Flag className="w-[13px] h-[13px] inline mr-1 align-[-2px]" /> 
                            Démarrage de l'exécution dans le système
                          </span>
                        </div>
                      )}
                      <WorkflowCycle 
                        cycle={cycle} 
                        projectsInCycle={projectsInCycle} 
                        startN={startN}
                        isDone={isDone}
                        forceExpand={searchQuery.length > 0}
                      />
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Sidebar - Micro-projects */}
          <div className="lg:h-full flex flex-col pb-[60px] lg:pb-0">
            <div className="bg-white border border-[#E5EAF1] rounded-[11px] shadow-[0_1px_2px_rgba(18,28,41,.05),0_6px_20px_rgba(18,28,41,.06)] flex flex-col lg:max-h-full">
              <div className="flex-none p-[15px_18px] border-b border-[#EEF2F7] flex items-center gap-[10px]">
                <h3 className="font-bold text-[14.5px] text-[#131C29]">Micro-projets associés</h3>
                <div className="flex-1" />
                <span className="bg-[#FBEADE] text-[#C85E18] px-[6px] py-[2px] rounded-full text-[10px] font-bold leading-none">
                  {MOCK_PROJECTS.length}
                </span>
              </div>
              
              <div className="flex-none p-[12px_18px] border-b border-[#E5EAF1] flex justify-between items-center text-[12px] text-[#5A6B80]">
                <span>Montant total engagé</span>
                <b className="font-mono text-[#2D6BD4]">{formatMoney(totalMontant)}</b>
              </div>

              <div className="flex-1 p-[10px] space-y-[4px] lg:overflow-y-auto lg:min-h-[120px]">
                {MOCK_PROJECTS.map(p => (
                  <div key={p.id} className="flex items-center gap-[11px] p-[6px_8px] hover:bg-[#F3F5F8] rounded-[8px] cursor-pointer transition-colors group">
                    <div className={`w-[8px] h-[8px] rounded-full flex-none ${
                      p.statut === 'bl' ? 'bg-[#2D6BD4]' :
                      p.statut === 'gr' ? 'bg-[#20A83A]' :
                      p.statut === 'or' ? 'bg-[#E7722B]' : 'bg-[#5A6B80]'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[13px] text-[#131C29] truncate">{p.titre}</div>
                      <div className="text-[11px] text-[#8595A8] truncate">{p.code} · {p.jeune}</div>
                    </div>
                    <div className="text-[13px] font-mono text-[#5A6B80]">
                      {(p.montant / 1000).toFixed(0)}k
                    </div>
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
