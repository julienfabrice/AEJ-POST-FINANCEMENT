import { Flag } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '../components/StatusBadge'
import { type ProjetRecouvrement } from '@/mock/recouvrement.mock'
import { money } from '@/helpers/money'

export function ContentieuxTab({ contentieux }: { contentieux: ProjetRecouvrement[] }) {
  return (
    <Card className="p-0 border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)] overflow-hidden">
      <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
        <h3 className="text-[14.5px] font-bold text-[#131C29]">Dossiers transmis à l&apos;avocat de l&apos;AEJ</h3>
        <div className="flex-1" />
        <StatusBadge text={contentieux.length} cls="rd" />
      </div>
      <div className="p-[18px]">
        <p className="text-[12.5px] text-[#5A6B80] mb-3">
          Au-delà du 3ᵉ impayé, ces dossiers ne figurent plus dans le portefeuille actif de recouvrement amiable.
        </p>

        {contentieux.length === 0 ? (
          <div className="text-center py-[50px] px-5 text-[#5A6B80]">Aucun dossier en contentieux</div>
        ) : (
          contentieux.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-[14px] py-[12px] border border-[#E5EAF1] rounded-[8px] mb-2 bg-white last:mb-0 cursor-pointer hover:border-[#cdd6e2] transition-colors">
              <div className="w-[26px] h-[26px] rounded-[8px] bg-[#131C29] text-white grid place-items-center flex-none">
                <Flag size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <b className="block text-[13.5px] text-[#131C29]">{p.code} — {p.titre}</b>
                <span className="text-[11.5px] text-[#5A6B80]">
                  {p.agence}
                  {' · '}reste dû {money(p.resteDu)}
                  {p.garantieAppelee ? ` · garantie appelée ${money(p.garantieAppelee)} le ${p.dateRappel}` : ' · garantie non encore appelée'}
                </span>
              </div>
              <StatusBadge text="Contentieux" cls="rd" />
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
