import { Button } from '@/components/ui/button'
import { Plus, Workflow, Search } from 'lucide-react'

interface DispositifHeaderProps {
  onAdd: () => void
  searchQuery?: string
  onSearch?: (query: string) => void
}

export function DispositifHeader({ onAdd, searchQuery = '', onSearch }: DispositifHeaderProps) {
  return (
    <div className="flex-none flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
      
      <div className="flex items-start justify-between gap-4 min-w-0 flex-1">
        <div className="min-w-0">
          <h1 className="text-[19px] font-bold text-[#131C29] flex items-center">
            Procédures des dispositifs
          </h1>
          <p className="text-[12.5px] text-[#5A6B80] mt-[1px] flex flex-wrap items-center gap-2">
            <span className="truncate">Cycles et sous-étapes de la procédure d'exécution de chaque dispositif.</span>
            <span className="inline-flex items-center gap-1.5 px-[11px] py-1.5 rounded-lg bg-[#FBF1D6] text-[#E0A106] font-semibold text-xs">
              <Workflow className="w-[15px] h-[15px]" /> Pilotage
            </span>
          </p>
        </div>

        {/* Bouton Nouveau (Mobile) */}
        <div className="md:hidden flex-none mt-1">
          <Button 
            onClick={onAdd}
            className="bg-[#E7722B] hover:bg-[#C85E18] text-white shadow-[0_4px_12px_rgba(238,123,26,0.28)] border-none rounded-lg h-9 w-9 p-0 flex items-center justify-center shrink-0"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto flex-none">
        {/* Barre de recherche */}
        <div className="flex items-center gap-2 bg-white border border-[#E5EAF1] rounded-[9px] px-3 py-2 flex-1 md:flex-none md:w-[240px] text-[#5A6B80] focus-within:border-[#cdd6e2] focus-within:shadow-sm transition-all">
          <Search className="w-4 h-4 shrink-0 text-[#8595A8]" />
          <input 
            type="text" 
            placeholder="Rechercher…" 
            value={searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
            className="border-none outline-none bg-transparent font-inherit text-[13px] w-full placeholder:text-[#8595A8] text-[#131C29]"
          />
        </div>

        {/* Bouton Nouveau (Desktop) */}
        <Button 
          onClick={onAdd}
          className="hidden md:flex bg-[#E7722B] hover:bg-[#C85E18] text-white shadow-[0_4px_12px_rgba(238,123,26,0.28)] border-none rounded-lg h-9 px-3.5 items-center gap-1.5 font-semibold text-[13px]"
        >
          <Plus className="w-4 h-4" />
          Nouveau dispositif
        </Button>
      </div>
    </div>
  )
}
