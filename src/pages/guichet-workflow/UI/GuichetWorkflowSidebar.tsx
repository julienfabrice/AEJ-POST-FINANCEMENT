interface GuichetWorkflowSidebarProps {
  projects: any[]
  totalMontant: number
}

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount)
}

export function GuichetWorkflowSidebar({ projects, totalMontant }: GuichetWorkflowSidebarProps) {
  return (
    <div className="lg:h-full flex flex-col pb-[60px] lg:pb-0">
      <div className="bg-white border border-[#E5EAF1] rounded-[11px] shadow-[0_1px_2px_rgba(18,28,41,.05),0_6px_20px_rgba(18,28,41,.06)] flex flex-col lg:max-h-full">
        <div className="flex-none p-[15px_18px] border-b border-[#EEF2F7] flex items-center gap-[10px]">
          <h3 className="font-bold text-[14.5px] text-[#131C29]">Micro-projets associés</h3>
          <div className="flex-1" />
          <span className="bg-[#FBEADE] text-[#C85E18] px-[6px] py-[2px] rounded-full text-[10px] font-bold leading-none">
            {projects.length}
          </span>
        </div>
        
        <div className="flex-none p-[12px_18px] border-b border-[#E5EAF1] flex justify-between items-center text-[12px] text-[#5A6B80]">
          <span>Montant total engagé</span>
          <b className="font-mono text-[#2D6BD4]">{formatMoney(totalMontant)}</b>
        </div>

        <div className="flex-1 p-[10px] space-y-[4px] lg:overflow-y-auto lg:min-h-[120px]">
          {projects.map(p => (
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
  )
}
