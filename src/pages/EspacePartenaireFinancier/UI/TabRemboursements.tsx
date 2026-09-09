import { TrendingDown, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { remboursementServices } from '@/services/remboursements.services'
import { StatusBadge, rembStatutBadge } from '../components/StatusBadge'
import { money } from "@/helpers/money"
import { formatDate } from "@/helpers/date"

export function TabRemboursements() {
  const { data: remboursements = [], isLoading, error } = remboursementServices.useGetAll()

  return (
    <Card className="p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
      {/* En-tête table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {[
                'Bénéficiaire / Promoteur',
                'Budget associé',
                'Montant échu',
                'Montant payé',
                'Montant impayé',
                'Pénalités',
                'Date paiement',
                'Statut',
                'Observations',
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
            {isLoading && (
              <tr>
                <td colSpan={9} className="text-center py-14 text-[#5A6B80]">
                  <Loader2 size={32} className="animate-spin text-[#E7722B] mx-auto mb-2" />
                  <span className="text-[13px]">Chargement des remboursements...</span>
                </td>
              </tr>
            )}

            {!isLoading && error && (
              <tr>
                <td colSpan={9} className="text-center py-14 text-[#D6453B]">
                  <TrendingDown size={40} className="mx-auto mb-3 opacity-60" />
                  <b className="block text-[15px] mb-1 font-['Archivo']">Erreur de chargement</b>
                  <span className="text-[13px]">Impossible de récupérer la liste des remboursements.</span>
                </td>
              </tr>
            )}

            {!isLoading && !error && remboursements.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-14 text-[#5A6B80] text-[13px]"
                >
                  <TrendingDown size={40} className="mx-auto mb-3 opacity-30" />
                  <b className="block text-[#131C29] text-[15px] mb-1 font-['Archivo']">
                    Aucun remboursement enregistré
                  </b>
                  <span className="text-[13px]">Aucun paiement de remboursement enregistré pour le moment.</span>
                </td>
              </tr>
            )}

            {!isLoading && !error && remboursements.map((r) => {
              const badge = rembStatutBadge(r.statut)
              const promoteurName = r.promoteur ? `${r.promoteur.nom} ${r.promoteur.prenom}` : `Promoteur #${r.promoteur_id}`
              const budgetName = r.budget?.intitule || (r.budget_id ? `Budget #${r.budget_id}` : '—')
              const montantEchu = Number(r.montant_echu) || 0
              const montantPaye = Number(r.montant_paye) || 0
              const montantImpaye = Number(r.montant_impaye) || 0
              const penalites = Number(r.penalites) || 0

              const pct = montantEchu > 0
                ? Math.min(100, Math.round((montantPaye / montantEchu) * 100))
                : 0

              return (
                <tr
                  key={r.id}
                  className="hover:bg-[#fafbfe] transition-colors"
                >
                  {/* Promoteur */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px]">
                    <b className="block font-semibold text-[#131C29]">{promoteurName}</b>
                    {r.promoteur?.telephone && (
                      <span className="text-[12px] text-[#5A6B80]">{r.promoteur.telephone}</span>
                    )}
                  </td>

                  {/* Budget */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                    {budgetName}
                  </td>

                  {/* Montant échu */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono font-semibold text-[#131C29]">
                    {money(montantEchu)}
                  </td>

                  {/* Montant payé */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <div className="text-[13px] font-mono font-semibold text-[#20A83A]">
                      {money(montantPaye)}
                    </div>
                    {montantEchu > 0 && (
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
                    )}
                  </td>

                  {/* Montant impayé */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono font-semibold text-[#C85E18]">
                    {money(montantImpaye)}
                  </td>

                  {/* Pénalités */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono text-[#D6453B]">
                    {penalites > 0 ? money(penalites) : '0 F'}
                  </td>

                  {/* Date paiement */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[12px] text-[#5A6B80] whitespace-nowrap">
                    {formatDate(r.date_paiement)}
                  </td>

                  {/* Statut */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <StatusBadge label={badge.label} variant={badge.variant} />
                  </td>

                  {/* Observations */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[12px] text-[#8595A8] max-w-[200px] truncate" title={r.observations || ''}>
                    {r.observations || '—'}
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

