import { useState, useMemo } from 'react'
import dayjs from 'dayjs'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '../../EspacePartenaireFinancier/components/StatusBadge'
import { money } from '@/helpers/money'
import { budgetServices } from '@/services/budgets.services'
import { guichetServices } from '@/services/guichets.services'
import { organismeServices } from '@/services/organismes.services'
import { BudgetEditModal } from '../components/BudgetEditModal'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'
import type { BUDGET_T } from '@/types'

export function TabBudgetsAccordes() {
  const { data: budgets = [], isLoading } = budgetServices.useGetAll()
  const { mutate: deleteBudget } = budgetServices.useDelete()
  const { data: guichets = [] } = guichetServices.useGetAll()
  const { data: organismes = [] } = organismeServices.useGetAll()

  const guichetById = useMemo(() => new Map(guichets.map((g) => [g.id, g])), [guichets])
  const organismeById = useMemo(() => new Map(organismes.map((o) => [o.id, o])), [organismes])

  const [budgetToEdit, setBudgetToEdit] = useState<BUDGET_T | null>(null)
  const [budgetToDelete, setBudgetToDelete] = useState<BUDGET_T | null>(null)

  return (
    <Card className="p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
      <BudgetEditModal budget={budgetToEdit} onClose={() => setBudgetToEdit(null)} />
      <DeleteConfirmModal
        open={!!budgetToDelete}
        onOpenChange={(open) => !open && setBudgetToDelete(null)}
        itemLabel={budgetToDelete?.intitule}
        onConfirm={() => budgetToDelete && deleteBudget(budgetToDelete.id)}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {[
                'Projet',
                'Guichet',
                'Partenaire',
                'Réf courrier',
                'Transmis',
                'Couverture',
                'Montant',
                'Approbation',
                'Taux. Int',
                'Durée Remb',
                'Convention',
                'Déblocage',
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
              <tr><td colSpan={13} className="px-[14px] py-6 text-center text-[13px] text-[#8595A8]">Chargement...</td></tr>
            )}
            {!isLoading && budgets.length === 0 && (
              <tr><td colSpan={13} className="px-[14px] py-6 text-center text-[13px] text-[#8595A8]">Aucun budget accordé.</td></tr>
            )}
            {budgets.map((b) => {
              const projet = b.micro_projet
              // Ajouté par la mise à jour API (GET /projets embarque lot_transmission
              // avec réf. courrier, date de transmission, taux de couverture, durée
              // de remboursement) — voir src/types/promoteurs.types.ts::LOT_TRANSMISSION_T
              const lot = projet?.lot_transmission
              const guichet = lot?.guichet_id ? guichetById.get(lot.guichet_id) : undefined
              const organisme = lot?.organisme_id ? organismeById.get(lot.organisme_id) : undefined

              return (
                <tr key={b.id} className="hover:bg-[#fafbfe] transition-colors">
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px]">
                    <b className="text-[#2D6BD4] font-semibold block">{projet?.code ?? `#${b.micro_projet_id}`}</b>
                    <span className="text-[#5A6B80] text-[12px]">{projet?.intitule ?? '—'}</span>
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <span className="inline-flex font-mono font-semibold text-[11.5px] px-2 py-0.5 rounded-full bg-[#EEF2F7] text-[#5A6B80]">
                      {guichet?.code ?? '—'}
                    </span>
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#131C29]">
                    {organisme?.sigle ?? organisme?.nom ?? '—'}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono text-[#5A6B80]">
                    {lot?.reference_courrier ?? '—'}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                    {lot?.date_transmission ? dayjs(lot.date_transmission).format('DD/MM/YYYY') : '—'}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                    {lot?.taux_recouvrement != null ? `${Math.round(Number(lot.taux_recouvrement) * 100)}%` : '—'}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono font-semibold text-[#131C29]">
                    {money(Number(b.montant_accorde))}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <StatusBadge
                      label={b.statut}
                      variant={b.statut === 'APPROUVE' ? 'gr' : b.statut === 'EN_ATTENTE' ? 'am' : 'rd'}
                    />
                  </td>
                  {/* Taux. Int (taux d'intérêt) : toujours sans source confirmée —
                      ni /compte-financements ni lot_transmission ne l'exposent
                      (lot_transmission.taux_recouvrement est la couverture, pas
                      un taux d'intérêt). */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">—</td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                    {lot?.duree_remboursement != null ? `${lot.duree_remboursement} mois` : '—'}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <StatusBadge
                      label={b.signature_convention === 'SIGNEE' ? 'Signée' : 'En cours'}
                      variant={b.signature_convention === 'SIGNEE' ? 'gr' : 'am'}
                    />
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <StatusBadge
                      label={b.deblocage ? 'DEBLOQUE' : 'NON'}
                      variant={b.deblocage ? 'gr' : 'gy'}
                    />
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setBudgetToEdit(b)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#8595A8] hover:bg-[#EEF2F7] hover:text-[#2D6BD4] transition-colors"
                        title="Modifier"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                      </button>
                      <button
                        onClick={() => setBudgetToDelete(b)}
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
