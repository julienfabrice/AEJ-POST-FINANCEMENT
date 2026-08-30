import { Folder, Wrench, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '../components/StatusBadge'
import { type ProjetRecouvrement } from '@/mock/recouvrement.mock'
import { money } from '@/helpers/money'

interface PortefeuilleTabProps {
  aJour: ProjetRecouvrement[]
  leger: ProjetRecouvrement[]
  lourd: ProjetRecouvrement[]
  onActionAmiable: (id: string) => void
  onSortir: (id: string) => void
}

export function PortefeuilleTab({ aJour, leger, lourd, onActionAmiable, onSortir }: PortefeuilleTabProps) {
  function renderCarte(titre: string, cls: 'gr' | 'am' | 'rd', items: ProjetRecouvrement[], vide: string, amiable: boolean | 'lourd') {
    return (
      <Card className="p-0 border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)] overflow-hidden mb-4">
        <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
          <h3 className="text-[14.5px] font-bold text-[#131C29]">{titre}</h3>
          <div className="flex-1" />
          <StatusBadge text={items.length} cls={cls} />
        </div>
        <div className="p-[18px]">
          {items.length === 0 ? (
            <div className="text-center py-[50px] px-5 text-[#5A6B80]">{vide}</div>
          ) : (
            items.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-[14px] py-[12px] border border-[#E5EAF1] rounded-[8px] mb-2 bg-white last:mb-0">
                <div className="w-[26px] h-[26px] rounded-[8px] bg-[#131C29] text-white grid place-items-center flex-none">
                  <Folder size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <b className="block text-[13.5px] text-[#131C29]">{p.code} — {p.titre}</b>
                  <span className="text-[11.5px] text-[#5A6B80]">
                    {p.agence}
                    {p.nbImpayes > 0 ? ` · ${p.nbImpayes} impayé(s) · ${p.retardJours} j de retard` : ''}
                    {' · '}reste dû {money(p.resteDu)}
                    {p.nbActions > 0 ? ` · ${p.nbActions} action(s)` : ''}
                  </span>
                </div>
                {amiable === true && (
                  <Button variant="outline" size="sm" className="h-8 text-[12px] border-[#E5EAF1] text-[#131C29]" onClick={() => onActionAmiable(p.id)}>
                    <Plus size={14} className="mr-1" /> Action amiable
                  </Button>
                )}
                {amiable === 'lourd' && (
                  <Button size="sm" className="h-8 text-[12px] bg-[#FBE7E5] text-[#D6453B] hover:bg-[#f7d9d6] border border-[#FBE7E5]" onClick={() => onSortir(p.id)}>
                    Sortir du portefeuille
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    )
  }

  return (
    <div>
      <Card className="mb-4 p-2 border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
        <div className="flex items-center gap-[7px] bg-[#FBEADE] text-[#C85E18] text-[12px] px-[11px] py-[8px] rounded-[8px]">
          <Wrench size={14} className="flex-none" />
          Les recouvrements sont assurés par la société <b>C02CI</b>, qui verse au nom du bénéficiaire <em className="text-[#5A6B80] not-italic">— l&apos;interconnexion avec son outil reste à mettre en place</em>
        </div>
      </Card>

      {renderCarte("À jour", 'gr', aJour, "Aucun dossier à jour", false)}
      {renderCarte("≤ 3 échéances impayées — recouvrement à l'amiable", 'am', leger, "Aucun dossier concerné", true)}
      {renderCarte("> 3 échéances impayées — saisine de l'avocat", 'rd', lourd, "Aucun dossier concerné", 'lourd')}
    </div>
  )
}
