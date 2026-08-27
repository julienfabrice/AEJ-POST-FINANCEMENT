import { Card } from '@/components/ui/card'
import { StatusBadge } from '../../EspacePartenaireFinancier/components/StatusBadge'
import { money } from '../../EspacePartenaireFinancier/utils/money'
import { MOCK_DEPENSES } from '@/mock/financements.mock'

export function TabDepenses() {
  return (
    <Card className="p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Micro-projet', 'Catégorie', 'Intitulé', 'Montant', 'Date', ''].map((h, i) => (
                <th
                  key={i}
                  className={`text-left text-[11px] uppercase tracking-[.05em] text-[#8595A8] font-bold px-[14px] py-[11px] border-b border-[#E5EAF1] bg-[#fafbfd] whitespace-nowrap ${h === '' ? 'text-right' : ''}`}
                >
                  {h === '' ? 'Actions' : h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_DEPENSES.map((d) => (
              <tr key={d.id} className="hover:bg-[#fafbfe] transition-colors">
                <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px]">
                  <span className="inline-flex items-center gap-[5px] text-[11.5px] font-semibold px-[9px] py-[3px] rounded-full bg-[#FBEADE] text-[#C85E18] mr-2">
                    {d.projet_code}
                  </span>
                  <span className="text-[#5A6B80]">{d.projet_titre}</span>
                </td>
                <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                  <StatusBadge
                    label={d.categorie}
                    variant={
                      ({
                        MATERIEL: 'bl',
                        STOCK: 'am',
                        SALAIRE: 'or',
                        CHARGE: 'gy',
                        TRANSPORT: 'gr',
                        AUTRE: 'gy',
                      }[d.categorie] as any) || 'gy'
                    }
                  />
                </td>
                <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#131C29]">
                  {d.intitule}
                </td>
                <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono font-semibold text-[#131C29]">
                  {money(d.montant_depense)}
                </td>
                <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                  {d.date_depense}
                </td>
                <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                  <div className="flex items-center justify-end gap-1">
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#8595A8] hover:bg-[#EEF2F7] hover:text-[#2D6BD4] transition-colors" title="Modifier">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </button>
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#8595A8] hover:bg-[#FBE7E5] hover:text-[#D6453B] transition-colors" title="Supprimer">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
