import { Link } from '@tanstack/react-router'
import { Search, ChevronLeft } from 'lucide-react'

interface GuichetWorkflowHeaderProps {
  wf: any
  searchQuery: string
  setSearchQuery: (val: string) => void
}

export function GuichetWorkflowHeader({ wf, searchQuery, setSearchQuery }: GuichetWorkflowHeaderProps) {
  return (
    <div className="flex-none flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
      
      <div className="flex items-start justify-between gap-4 min-w-0 flex-1">
        {/* Title Area */}
        <div className="min-w-0">
          <h1 className="text-[19px] font-bold text-[#131C29] flex flex-wrap items-center gap-2">
            <span className="truncate">{wf?.title}</span>
            <span className="flex-none px-2 py-0.5 rounded text-[11px] font-bold bg-[#F3F5F8] text-[#5A6B80]">
              GUICH-002
            </span>
          </h1>
          <p className="text-[12.5px] text-[#5A6B80] mt-[1px] truncate">
            Procédure {wf?.code} · {wf?.cycles?.length || 0} cycles · version {wf?.version}
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
  )
}
