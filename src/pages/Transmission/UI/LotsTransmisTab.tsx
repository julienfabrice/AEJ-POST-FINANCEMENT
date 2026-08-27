import { Card } from '@/components/ui/card'
import { StatusBadge } from '../../EspacePartenaireFinancier/components/StatusBadge'
import { money } from '../../EspacePartenaireFinancier/utils/money'
import { MOCK_TRANSMISSION_LOTS } from '@/mock/transmission.mock'

export function LotsTransmisTab() {
  return (
    <div className="space-y-5">
      <Card className="p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {[
                  'Lot',
                  'Guichet',
                  'Partenaire',
                  'Dossiers',
                  'Réf. courrier',
                  'Transmis le',
                  'Couverture',
                  'Statut',
                  '',
                ].map((h, i) => (
                  <th
                    key={i}
                    className={`text-left text-[11px] uppercase tracking-[.05em] text-[#8595A8] font-bold px-[14px] py-[11px] border-b border-[#E5EAF1] bg-[#fafbfd] whitespace-nowrap ${h === '' ? 'text-right' : ''
                      }`}
                  >
                    {h === '' ? 'Actions' : h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANSMISSION_LOTS.map((l) => (
                <tr key={l.id} className="hover:bg-[#fafbfe] transition-colors">
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px]">
                    <b className="text-[#2D6BD4] font-semibold block">{l.reference}</b>
                    <span className="text-[#5A6B80] text-[12px]">{l.courrier_titre}</span>
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <span className="inline-flex font-mono font-semibold text-[11.5px] px-2 py-0.5 rounded-full bg-[#EEF2F7] text-[#5A6B80]">
                      {l.dispositif_code}
                    </span>
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#131C29]">
                    {l.organisme_label}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <span className="inline-flex font-bold text-[11.5px] px-2 py-0.5 rounded-full bg-[#E5F0FF] text-[#2D6BD4]">
                      {l.nb_dossiers}
                    </span>
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono text-[#5A6B80]">
                    {l.courrier_reference}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                    {l.date_transmission}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                    {l.taux_couverture}%
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <StatusBadge
                      label={
                        l.statut === 'TRANSMIS'
                          ? 'Transmis au partenaire'
                          : l.statut === 'RETOURNE'
                            ? 'Retourné à l\'AEJ'
                            : 'Brouillon'
                      }
                      variant={l.statut === 'TRANSMIS' ? 'or' : l.statut === 'RETOURNE' ? 'gr' : 'gy'}
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="flex p-0 flex-col border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05)] overflow-hidden">
        <div className="p-4 border-b border-[#EEF2F7]">
          <h3 className="text-[14px] font-bold text-[#131C29]">Dossiers par lot</h3>
        </div>
        <div className="p-4 bg-[#fafbfd] flex flex-col gap-6">
          {MOCK_TRANSMISSION_LOTS.map((l) => (
            <div key={l.id} className="flex flex-col gap-3">
              <div className="text-[13px] font-semibold text-[#131C29] flex items-center gap-2">
                {l.reference} · {l.organisme_label}
                <StatusBadge
                  label={
                    l.statut === 'TRANSMIS'
                      ? 'Transmis'
                      : l.statut === 'RETOURNE'
                        ? 'Retourné'
                        : 'Brouillon'
                  }
                  variant={l.statut === 'TRANSMIS' ? 'or' : l.statut === 'RETOURNE' ? 'gr' : 'gy'}
                />
              </div>
              <div className="flex flex-col gap-2">
                {l.dossiers.map((d) => (
                  <div key={d.id} className="bg-white border border-[#E5EAF1] p-3 rounded flex items-center gap-4 hover:border-[#D0D7E2] cursor-pointer transition-colors">
                    <div className="text-[#8595A8]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <b className="block text-[13px] text-[#131C29] truncate">
                        {d.code} — {d.titre}
                      </b>
                      <span className="block text-[11.5px] text-[#5A6B80] truncate mt-0.5">
                        Réf. {l.courrier_reference} · transmis le {l.date_transmission} · couverture {l.taux_couverture}% · différé {l.duree_differe} mois · remboursement {l.duree_remboursement} mois · convention {l.reference_convention}
                      </span>
                    </div>
                    <div className="text-[14px] font-mono font-bold text-[#131C29] shrink-0">
                      {money(d.montant)}
                    </div>
                    <div className="shrink-0">
                      <StatusBadge
                        label={d.approbation === 'APPROUVE' ? 'Approuvé' : d.approbation === 'REJETE' ? 'Rejeté' : 'En attente'}
                        variant={d.approbation === 'APPROUVE' ? 'gr' : d.approbation === 'REJETE' ? 'rd' : 'am'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
