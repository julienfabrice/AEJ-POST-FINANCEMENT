import { Card } from '@/components/ui/card'
import { StatusBadge } from '../../EspacePartenaireFinancier/components/StatusBadge'
import { money } from "@/helpers/money"
import { MOCK_OP_REMBOURSEMENTS } from '@/mock/remboursements.mock'

export function RemboursementsTable() {
  return (
    <Card className="p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)] mt-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {[
                'Projet',
                'Échéance',
                'Dû',
                'Payé',
                'Reste',
                'Retard',
                'Justificatif',
                'Observation',
                'Statut',
                '',
              ].map((h, i) => (
                <th
                  key={i}
                  className={`text-left text-[11px] uppercase tracking-[.05em] text-[#8595A8] font-bold px-[14px] py-[11px] border-b border-[#E5EAF1] bg-[#fafbfd] whitespace-nowrap ${
                    h === '' ? 'text-right' : ''
                  }`}
                >
                  {h === '' ? 'Actions' : h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_OP_REMBOURSEMENTS.map((r) => {
              const reste = r.du - r.paye
              return (
                <tr key={r.id} className="hover:bg-[#fafbfe] transition-colors">
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px]">
                    <b className="text-[#2D6BD4] font-semibold">{r.projet_code}</b>
                    <span className="block text-[12px] text-[#5A6B80]">{r.projet_titre}</span>
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#131C29]">
                    {r.echeance}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono font-semibold text-[#131C29]">
                    {money(r.du)}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono font-semibold text-[#0FA958]">
                    {money(r.paye)}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono font-semibold">
                    <span className={reste > 0 ? 'text-[#D6453B]' : 'text-[#8595A8]'}>
                      {money(reste)}
                    </span>
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px]">
                    {r.jours_retard > 0 ? (
                      <span className="text-[#D6453B] font-mono font-semibold">
                        {r.jours_retard} j
                      </span>
                    ) : (
                      <span className="text-[#8595A8]">—</span>
                    )}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                    {r.justificatif ? (
                      <div className="flex items-center gap-1 hover:text-[#2D6BD4] cursor-pointer">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <span className="underline decoration-dashed underline-offset-2">
                          {r.justificatif}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#8595A8]">—</span>
                    )}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80] max-w-[180px] truncate" title={r.observation}>
                    {r.observation || '—'}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <StatusBadge
                      label={
                        r.statut === 'PAYE'
                          ? 'Payé'
                          : r.statut === 'PARTIEL'
                          ? 'Partiel'
                          : 'Impayé'
                      }
                      variant={
                        r.statut === 'PAYE' ? 'gr' : r.statut === 'PARTIEL' ? 'am' : 'rd'
                      }
                    />
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#8595A8] hover:bg-[#EEF2F7] hover:text-[#2D6BD4] transition-colors"
                        title="Modifier"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                      </button>
                      <button
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#8595A8] hover:bg-[#FBE7E5] hover:text-[#D6453B] transition-colors"
                        title="Supprimer"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
