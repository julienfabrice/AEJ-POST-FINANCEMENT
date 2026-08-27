import { TrendingDown, Flag } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { MOCK_REMBOURSEMENTS } from '@/mock/financement.mock'
import { StatusBadge, rembStatutBadge } from '../components/StatusBadge'
import { money } from '../utils/money'

export function TabRemboursements() {
  return (
    <Card className="p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
      {/* En-tête table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {[
                'Dossier',
                'Partenaire',
                'Agence',
                'Crédit',
                'Remboursé',
                'Reste dû',
                'Période',
                'Statut',
              ].map((h) => (
                <th
                  key={h}
                  className="text-left text-[11px] uppercase tracking-[.05em] text-[#8595A8] font-bold px-[14px] py-[11px] border-b border-[#E5EAF1] bg-[#fafbfd] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_REMBOURSEMENTS.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-14 text-[#5A6B80] text-[13px]"
                >
                  <TrendingDown size={40} className="mx-auto mb-3 opacity-30" />
                  <b className="block text-[#131C29] text-[15px] mb-1 font-['Archivo']">
                    Aucun remboursement enregistré
                  </b>
                </td>
              </tr>
            ) : (
              MOCK_REMBOURSEMENTS.map((r) => {
                const badge = rembStatutBadge(r.statut)
                const pct = r.montant_du
                  ? Math.round((r.montant_rembourse / r.montant_du) * 100)
                  : 0

                return (
                  <tr
                    key={r.id}
                    className="hover:bg-[#fafbfe] transition-colors cursor-pointer"
                  >
                    {/* Dossier */}
                    <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px]">
                      <b className="block font-semibold text-[#131C29]">{r.code}</b>
                      <span className="text-[12px] text-[#5A6B80] block truncate max-w-[180px]">
                        {r.titre} — {r.promoteur}
                      </span>
                    </td>

                    {/* Partenaire */}
                    <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                      {r.partenaire}
                    </td>

                    {/* Agence */}
                    <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                      {r.agence}
                    </td>

                    {/* Crédit */}
                    <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono font-semibold text-[#131C29]">
                      {money(r.montant_credit)}
                    </td>

                    {/* Remboursé */}
                    <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                      <div className="text-[13px] font-mono font-semibold text-[#20A83A]">
                        {money(r.montant_rembourse)}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="bg-[#EEF2F7] rounded-full h-[6px] overflow-hidden min-w-[70px]">
                          <div
                            className="h-full rounded-full bg-[#20A83A]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10.5px] font-bold text-[#5A6B80]">
                          {pct}%
                        </span>
                      </div>
                    </td>

                    {/* Reste dû */}
                    <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono font-semibold text-[#C85E18]">
                      {money(r.montant_du - r.montant_rembourse)}
                    </td>

                    {/* Période */}
                    <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[12px] text-[#5A6B80] whitespace-nowrap">
                      {r.date_debut} → {r.date_fin}
                      {r.jours_retard > 0 && (
                        <div className="text-[#D6453B] font-semibold flex items-center gap-1 mt-0.5">
                          <Flag size={10} />
                          {r.jours_retard} j de retard
                        </div>
                      )}
                    </td>

                    {/* Statut */}
                    <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                      <StatusBadge label={badge.label} variant={badge.variant} />
                      {r.nb_impayes > 0 && (
                        <div className="text-[11px] text-[#D6453B] font-semibold mt-0.5">
                          {r.nb_impayes} impayé(s)
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
