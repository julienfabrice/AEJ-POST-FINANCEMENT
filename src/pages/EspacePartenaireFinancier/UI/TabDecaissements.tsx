import { Banknote, Loader2 } from 'lucide-react'
import { decaissementServices } from '@/services/decaissements.services'
import { StatusBadge, ligneStatutBadge } from '../components/StatusBadge'
import { money } from "@/helpers/money"
import { formatDate } from "@/helpers/date"

export function TabDecaissements() {
  const { data: decaissements = [], isLoading, error } = decaissementServices.useGetAll()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#5A6B80]">
        <Loader2 size={32} className="animate-spin text-[#E7722B] mb-2" />
        <span className="text-[13px]">Chargement des décaissements...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-14 text-[#D6453B]">
        <Banknote size={40} className="mx-auto mb-3 opacity-60" />
        <b className="block text-[15px] mb-1 font-['Archivo']">Erreur de chargement</b>
        <span className="text-[13px]">Impossible de récupérer la liste des décaissements.</span>
      </div>
    )
  }

  if (decaissements.length === 0) {
    return (
      <div className="text-center py-14 text-[#5A6B80]">
        <Banknote size={40} className="mx-auto mb-3 opacity-30" />
        <b className="block text-[#131C29] text-[15px] mb-1 font-['Archivo']">
          Aucun décaissement enregistré
        </b>
        <span className="text-[13px]">Aucun décaissement n'a encore été créé.</span>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#E5EAF1] rounded-[11px] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {[
                'N° Ligne',
                'Objet / Libellé',
                'Prestataire / Bénéficiaire',
                'Mode',
                'Compte / Contact',
                'Montant',
                'Date',
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
            {decaissements.map((d) => {
              const badge = ligneStatutBadge(d.statut)
              const montant = Number(d.montant_ligne ?? d.montant_decaisse ?? 0)

              return (
                <tr key={d.id} className="hover:bg-[#fafbfe] transition-colors">
                  {/* Numéro de ligne */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <span className="w-[26px] h-[26px] rounded-[8px] bg-[#131C29] text-white grid place-items-center text-[12px] font-bold inline-grid">
                      {d.numero_ligne || d.id}
                    </span>
                  </td>

                  {/* Objet de la ligne */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-semibold text-[#131C29]">
                    {d.object_ligne || (d.plan_decaissement ? `Plan #${d.plan_decaissement_id}` : `Décaissement #${d.id}`)}
                  </td>

                  {/* Prestataire */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                    {d.intitule_prestataire || '—'}
                  </td>

                  {/* Mode de décaissement */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[12px]">
                    <span className="bg-[#EEF2F7] text-[#5A6B80] px-2 py-0.5 rounded font-mono font-medium">
                      {d.mode_decaisse || '—'}
                    </span>
                  </td>

                  {/* Numéro de compte / contact */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[12px] text-[#5A6B80]">
                    {d.numero_compte && <span className="block font-mono text-[#131C29]">{d.numero_compte}</span>}
                    {d.contact && <span>{d.contact}</span>}
                    {!d.numero_compte && !d.contact && '—'}
                  </td>

                  {/* Montant */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono font-semibold text-[#131C29] whitespace-nowrap">
                    {money(montant)}
                  </td>

                  {/* Date */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[12px] text-[#5A6B80] whitespace-nowrap">
                    {formatDate(d.date_prevue || d.date_decaissement)}
                  </td>

                  {/* Statut */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <StatusBadge label={badge.label} variant={badge.variant} />
                  </td>

                  {/* Observations */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[12px] text-[#8595A8] max-w-[200px] truncate" title={d.observations || ''}>
                    {d.observations || '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

