import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '../../EspacePartenaireFinancier/components/StatusBadge'
import { money } from '../../EspacePartenaireFinancier/utils/money'
import { remboursementServices } from '@/services/remboursements.services'
import { budgetServices } from '@/services/budgets.services'
import { useProjetsLookup } from '../../Financements/hooks/useProjetsLookup'
import { RemboursementEditModal } from '../components/RemboursementEditModal'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'
import type { REMBOURSEMENT_T } from '@/types'

const STATUT_LABELS: Record<REMBOURSEMENT_T['statut'], string> = {
  EN_ATTENTE: 'En attente',
  PAYE: 'Payé',
  PARTIEL: 'Partiel',
  NON_PAYE: 'Impayé',
}
const STATUT_VARIANTS: Record<REMBOURSEMENT_T['statut'], 'gr' | 'am' | 'rd'> = {
  EN_ATTENTE: 'am',
  PAYE: 'gr',
  PARTIEL: 'am',
  NON_PAYE: 'rd',
}

export function RemboursementsTable() {
  const { data: remboursements = [], isLoading } = remboursementServices.useGetAll()
  const { mutate: deleteRemboursement } = remboursementServices.useDelete()
  const { data: budgets = [] } = budgetServices.useGetAll()
  const { projetById } = useProjetsLookup()

  const [toEdit, setToEdit] = useState<REMBOURSEMENT_T | null>(null)
  const [toDelete, setToDelete] = useState<REMBOURSEMENT_T | null>(null)

  // remboursement.budget_id → budget.micro_projet_id → projet (jointure à deux sauts)
  const budgetById = useMemo(() => {
    const map = new Map<number, (typeof budgets)[number]>()
    budgets.forEach((b) => map.set(b.id, b))
    return map
  }, [budgets])

  return (
    <Card className="p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)] mt-6">
      <RemboursementEditModal remboursement={toEdit} onClose={() => setToEdit(null)} />
      <DeleteConfirmModal
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        itemLabel={toDelete ? `remboursement #${toDelete.id}` : undefined}
        onConfirm={() => toDelete && deleteRemboursement(toDelete.id)}
      />

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
            {isLoading && (
              <tr><td colSpan={10} className="px-[14px] py-6 text-center text-[13px] text-[#8595A8]">Chargement...</td></tr>
            )}
            {!isLoading && remboursements.length === 0 && (
              <tr><td colSpan={10} className="px-[14px] py-6 text-center text-[13px] text-[#8595A8]">Aucun remboursement.</td></tr>
            )}
            {remboursements.map((r) => {
              const budget = r.budget_id ? budgetById.get(r.budget_id) : undefined
              const projet = budget ? projetById.get(budget.micro_projet_id) : undefined
              const reste = r.montant_echu - r.montant_paye
              return (
                <tr key={r.id} className="hover:bg-[#fafbfe] transition-colors">
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px]">
                    <b className="text-[#2D6BD4] font-semibold">{projet?.code ?? `Promoteur #${r.promoteur_id}`}</b>
                    <span className="block text-[12px] text-[#5A6B80]">{projet?.intitule ?? '—'}</span>
                  </td>
                  {/* Pas de date d'échéance distincte dans le payload confirmé (seulement date_paiement) */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#131C29]">
                    {r.date_paiement ?? '—'}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono font-semibold text-[#131C29]">
                    {money(r.montant_echu)}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono font-semibold text-[#0FA958]">
                    {money(r.montant_paye)}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono font-semibold">
                    <span className={reste > 0 ? 'text-[#D6453B]' : 'text-[#8595A8]'}>{money(reste)}</span>
                  </td>
                  {/* Jours de retard : non présent dans le payload confirmé */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#8595A8]">—</td>
                  {/* Justificatif : non présent dans le payload confirmé */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#8595A8]">—</td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80] max-w-[180px] truncate" title={r.observations ?? ''}>
                    {r.observations || '—'}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <StatusBadge label={STATUT_LABELS[r.statut]} variant={STATUT_VARIANTS[r.statut]} />
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setToEdit(r)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#8595A8] hover:bg-[#EEF2F7] hover:text-[#2D6BD4] transition-colors"
                        title="Modifier"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                      </button>
                      <button
                        onClick={() => setToDelete(r)}
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
