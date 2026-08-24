import { Button } from '@/components/ui/button'
import { Plus, Workflow, Search } from 'lucide-react'

interface DispositifsHeaderProps {
  onAdd: () => void
}

export function DispositifsHeader({ onAdd }: DispositifsHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-[19px] font-bold text-[#131C29] flex items-center">
          Procédures des guichets
        </h1>
        <p className="text-[12.5px] text-[#5A6B80] mt-[1px] flex items-center">
          Cycles et sous-étapes de la procédure d'exécution de chaque guichet.
          <span className="inline-flex items-center gap-1.5 ml-3 px-[11px] py-1.5 rounded-lg bg-[#FBF1D6] text-[#E0A106] font-semibold text-xs">
            <Workflow className="w-[15px] h-[15px]" /> Pilotage
          </span>
        </p>
      </div>
      <div className="flex items-center gap-4">
        {/* Barre de recherche */}
        <div className="flex items-center gap-2 bg-white border border-[#E5EAF1] rounded-[9px] px-3 py-2 w-[280px] text-[#5A6B80] focus-within:border-[#cdd6e2] focus-within:shadow-sm transition-all">
          <Search className="w-4 h-4 shrink-0 text-[#8595A8]" />
          <input 
            type="text" 
            placeholder="Rechercher…" 
            className="border-none outline-none bg-transparent font-inherit text-[13px] w-full placeholder:text-[#8595A8] text-[#131C29]"
          />
        </div>

        <Button 
          onClick={onAdd}
          className="bg-[#E7722B] hover:bg-[#C85E18] text-white shadow-[0_4px_12px_rgba(238,123,26,0.28)] border-none rounded-lg h-9 px-3.5 flex items-center gap-1.5 font-semibold text-[13px]"
        >
          <Plus className="w-4 h-4" />
          Nouveau guichet
        </Button>
      </div>
    </div>
  )
}
