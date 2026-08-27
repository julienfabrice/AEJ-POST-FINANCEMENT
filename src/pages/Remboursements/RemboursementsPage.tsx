import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '../EspacePartenaireFinancier/components/StatusBadge'
import { money } from '../EspacePartenaireFinancier/utils/money'
import { MOCK_OP_REMBOURSEMENTS, type MockOpRemboursement } from '@/mock/remboursements.mock'

export function RemboursementsPage() {
  const { kpis, dossiersGroups } = useMemo(() => {
    let duTotal = 0
    let payeTotal = 0
    let impayesCount = 0

    const byProjet: Record<string, MockOpRemboursement[]> = {}

    MOCK_OP_REMBOURSEMENTS.forEach((r) => {
      duTotal += r.du
      payeTotal += r.paye
      if (r.statut === 'IMPAYE') impayesCount++

      if (!byProjet[r.projet_id]) byProjet[r.projet_id] = []
      byProjet[r.projet_id].push(r)
    })

    const cats: {
      AJOUR: any[]
      LEGER: any[]
      LOURD: any[]
    } = { AJOUR: [], LEGER: [], LOURD: [] }

    Object.entries(byProjet).forEach(([pid, rows]) => {
      const firstRow = rows[0]
      const nbImp = rows.filter((r) => r.statut === 'IMPAYE').length
      const retardMax = Math.max(0, ...rows.map((r) => r.jours_retard || 0))

      const item = {
        pid,
        titre: firstRow.projet_titre,
        code: firstRow.projet_code,
        agence: firstRow.agence,
        nbImp,
        retard: retardMax,
      }

      if (nbImp === 0) cats.AJOUR.push(item)
      else if (nbImp <= 3) cats.LEGER.push(item)
      else cats.LOURD.push(item)
    })

    return {
      kpis: {
        du: duTotal,
        paye: payeTotal,
        taux: duTotal > 0 ? Math.round((payeTotal / duTotal) * 100) : 0,
        impayes: impayesCount,
      },
      dossiersGroups: cats,
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* ---- KPIs ---- */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 shadow-sm">
          <div className="text-[12px] font-semibold text-[#5A6B80] uppercase tracking-wider mb-1">
            Total dû
          </div>
          <div className="text-[22px] font-bold font-mono text-[#131C29]">
            {money(kpis.du).replace(' F', '')} <small className="text-[14px]">F</small>
          </div>
        </Card>
        <Card className="p-4 shadow-sm">
          <div className="text-[12px] font-semibold text-[#5A6B80] uppercase tracking-wider mb-1">
            Total remboursé
          </div>
          <div className="text-[22px] font-bold font-mono text-[#0FA958]">
            {money(kpis.paye).replace(' F', '')} <small className="text-[14px]">F</small>
          </div>
        </Card>
        <Card className="p-4 shadow-sm">
          <div className="text-[12px] font-semibold text-[#5A6B80] uppercase tracking-wider mb-1">
            Taux de recouvrement
          </div>
          <div className="text-[22px] font-bold font-mono text-[#131C29]">{kpis.taux}%</div>
        </Card>
        <Card className="p-4 shadow-sm">
          <div className="text-[12px] font-semibold text-[#5A6B80] uppercase tracking-wider mb-1">
            Échéances impayées
          </div>
          <div className="text-[22px] font-bold font-mono text-[#D6453B]">{kpis.impayes}</div>
        </Card>
      </div>

      {/* ---- Dossiers Groups ---- */}
      <div className="grid grid-cols-3 gap-4">
        <GroupCard
          title="À jour"
          items={dossiersGroups.AJOUR}
          empty="Aucun dossier à jour"
          badgeColor="bg-[#E7F6EC] text-[#0FA958]"
        />
        <GroupCard
          title="≤ 3 échéances impayées"
          items={dossiersGroups.LEGER}
          empty="Aucun dossier concerné"
          badgeColor="bg-[#FEF5E6] text-[#E7722B]"
        />
        <GroupCard
          title="> 3 échéances impayées"
          items={dossiersGroups.LOURD}
          empty="Aucun dossier concerné"
          badgeColor="bg-[#FBE7E5] text-[#D6453B]"
        />
      </div>

      {/* ---- Table Remboursements ---- */}
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
    </div>
  )
}

function GroupCard({ title, items, empty, badgeColor }: { title: string; items: any[]; empty: string; badgeColor: string }) {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[#EEF2F7]">
        <h3 className="text-[13.5px] font-bold text-[#131C29]">{title}</h3>
        <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
          {items.length}
        </span>
      </div>
      <div className="px-4 flex-1 flex flex-col gap-2">
        {items.length === 0 ? (
          <div className="text-[13px] text-[#8595A8] italic flex-1 flex items-center justify-center text-center p-4 bg-[#fafbfd] rounded-md border border-dashed border-[#E5EAF1]">
            {empty}
          </div>
        ) : (
          items.map((it, idx) => (
            <div
              key={idx}
              className="group p-3 bg-white border border-[#E5EAF1] hover:border-[#D0D7E2] rounded-md shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <b className="block text-[13px] text-[#131C29] group-hover:text-[#2D6BD4] transition-colors">
                {it.titre}
              </b>
              <span className="text-[11.5px] text-[#5A6B80] leading-snug flex items-center gap-1 mt-1">
                {it.code} · {it.agence}
              </span>
              {(it.nbImp > 0 || it.retard > 0) && (
                <div className="mt-2 pt-2 border-t border-[#EEF2F7] border-dashed text-[11px] font-medium text-[#D6453B] flex items-center gap-2">
                  {it.nbImp > 0 && <span>{it.nbImp} échéance(s) impayée(s)</span>}
                  {it.retard > 0 && <span>{it.retard} j de retard</span>}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
