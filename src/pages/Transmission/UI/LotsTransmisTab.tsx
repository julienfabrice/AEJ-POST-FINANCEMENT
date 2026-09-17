import { Card } from '@/components/ui/card'
import { StatusBadge, type StatusBadgeVariant } from '../../EspacePartenaireFinancier/components/StatusBadge'
import { lotsTransmissionServices } from '@/services/lotsTransmission.services'
import { lotsMicroProjetsServices } from '@/services/lotsMicroProjets.services'
import type { LOT_TRANSMISSION_STATUT_T, LOT_MICRO_PROJET_STATUT_T } from '@/types'

const LOT_STATUT_CONFIG: Record<LOT_TRANSMISSION_STATUT_T, { label: string; variant: StatusBadgeVariant }> = {
  BROUILLON: { label: 'Brouillon', variant: 'gy' },
  TRANSMIS: { label: 'Transmis au partenaire', variant: 'or' },
  TRAITE: { label: 'Traité', variant: 'gr' },
  REJETE: { label: 'Rejeté', variant: 'rd' },
}

const DOSSIER_STATUT_CONFIG: Record<LOT_MICRO_PROJET_STATUT_T, { label: string; variant: StatusBadgeVariant }> = {
  EN_ATTENTE: { label: 'En attente', variant: 'am' },
  APPROUVE: { label: 'Approuvé', variant: 'gr' },
  NON_APPROUVE: { label: 'Rejeté', variant: 'rd' },
}

export function LotsTransmisTab() {
  const { data: lots = [], isLoading: isLoadingLots } = lotsTransmissionServices.useGetAll()
  const { data: associations = [] } = lotsMicroProjetsServices.useGetAll()
  const { mutate: deleteLot } = lotsTransmissionServices.useDelete()

  const associationsByLot = new Map<number, typeof associations>()
  associations.forEach((a) => {
    const list = associationsByLot.get(a.lot_id) ?? []
    list.push(a)
    associationsByLot.set(a.lot_id, list)
  })

  if (isLoadingLots) {
    return <p className="text-sm text-slate-500 p-4">Chargement des lots…</p>
  }

  if (lots.length === 0) {
    return <p className="text-sm text-slate-500 p-4">Aucun lot transmis pour le moment.</p>
  }

  return (
    <div className="space-y-5">
      <Card className="p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Lot', 'Guichet', 'Partenaire', 'Dossiers', 'Réf. courrier', 'Transmis le', 'Couverture', 'Statut', ''].map((h, i) => (
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
              {lots.map((l) => {
                const nbDossiers = associationsByLot.get(l.id)?.length ?? l.dossiers?.length ?? 0
                const statutConfig = LOT_STATUT_CONFIG[l.statut]
                return (
                  <tr key={l.id} className="hover:bg-[#fafbfe] transition-colors">
                    <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px]">
                      <b className="text-[#2D6BD4] font-semibold block">{l.code}</b>
                      <span className="text-[#5A6B80] text-[12px]">{l.titre}</span>
                    </td>
                    <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                      <span className="inline-flex font-mono font-semibold text-[11.5px] px-2 py-0.5 rounded-full bg-[#EEF2F7] text-[#5A6B80]">
                        {l.guichet?.code ?? '—'}
                      </span>
                    </td>
                    <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#131C29]">
                      {l.organisme?.sigle ?? l.organisme?.nom ?? '—'}
                    </td>
                    <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                      <span className="inline-flex font-bold text-[11.5px] px-2 py-0.5 rounded-full bg-[#E5F0FF] text-[#2D6BD4]">
                        {nbDossiers}
                      </span>
                    </td>
                    <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono text-[#5A6B80]">
                      {l.reference_courrier ?? '—'}
                    </td>
                    <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                      {l.date_transmission ?? '—'}
                    </td>
                    <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                      {l.taux_recouvrement != null ? `${l.taux_recouvrement}%` : '—'}
                    </td>
                    <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                      <StatusBadge label={statutConfig.label} variant={statutConfig.variant} />
                    </td>
                    <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[#8595A8] hover:bg-[#FBE7E5] hover:text-[#D6453B] transition-colors"
                          title="Supprimer"
                          onClick={() => {
                            if (confirm(`Supprimer le lot ${l.code} ?`)) deleteLot(l.id)
                          }}
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

      <Card className="flex p-0 flex-col border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05)] overflow-hidden">
        <div className="p-4 border-b border-[#EEF2F7]">
          <h3 className="text-[14px] font-bold text-[#131C29]">Dossiers par lot</h3>
        </div>
        <div className="p-4 bg-[#fafbfd] flex flex-col gap-6">
          {lots.map((l) => {
            const lotAssociations = associationsByLot.get(l.id) ?? []
            const statutConfig = LOT_STATUT_CONFIG[l.statut]
            return (
              <div key={l.id} className="flex flex-col gap-3">
                <div className="text-[13px] font-semibold text-[#131C29] flex items-center gap-2">
                  {l.code} · {l.organisme?.sigle ?? l.organisme?.nom ?? '—'}
                  <StatusBadge label={statutConfig.label} variant={statutConfig.variant} />
                </div>
                <div className="flex flex-col gap-2">
                  {lotAssociations.length === 0 && (
                    <p className="text-[12.5px] text-[#8595A8]">Aucun dossier associé.</p>
                  )}
                  {lotAssociations.map((a) => {
                    const dossierStatut = DOSSIER_STATUT_CONFIG[a.statut]
                    return (
                      <div key={a.id} className="bg-white border border-[#E5EAF1] p-3 rounded flex items-center gap-4 hover:border-[#D0D7E2] cursor-pointer transition-colors">
                        <div className="text-[#8595A8]">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <b className="block text-[13px] text-[#131C29] truncate">
                            {a.micro_projet ? `${a.micro_projet.code} — ${a.micro_projet.intitule}` : `Micro-projet #${a.micro_projet_id}`}
                          </b>
                          <span className="block text-[11.5px] text-[#5A6B80] truncate mt-0.5">
                            Réf. {l.reference_courrier ?? '—'} · transmis le {l.date_transmission ?? '—'} · couverture {l.taux_recouvrement ?? '—'}% · différé {l.duree_differee ?? '—'} mois · remboursement {l.duree_remboursement ?? '—'} mois
                          </span>
                        </div>
                        <div className="shrink-0">
                          <StatusBadge label={dossierStatut.label} variant={dossierStatut.variant} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}