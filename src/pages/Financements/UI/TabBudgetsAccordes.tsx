import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '../../EspacePartenaireFinancier/components/StatusBadge'
import { money } from '../../EspacePartenaireFinancier/utils/money'
import { budgetServices } from '@/services/budgets.services'
import { refLabel } from '@/types/referentials.types'
import { BudgetEditModal } from '../components/BudgetEditModal'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'
import type { BUDGET_T } from '@/types'

export function TabBudgetsAccordes() {
  const { data: budgets = [], isLoading } = budgetServices.useGetAll()
  const { mutate: deleteBudget } = budgetServices.useDelete()

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
              return (
                <tr key={b.id} className="hover:bg-[#fafbfe] transition-colors">
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px]">
                    <b className="text-[#2D6BD4] font-semibold block">{projet?.code ?? `#${b.micro_projet_id}`}</b>
                    <span className="text-[#5A6B80] text-[12px]">{projet?.intitule ?? '—'}</span>
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <span className="inline-flex font-mono font-semibold text-[11.5px] px-2 py-0.5 rounded-full bg-[#EEF2F7] text-[#5A6B80]">
                      {projet?.guichet ? refLabel(projet.guichet) : '—'}
                    </span>
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#131C29]">
                    {projet?.organisme ? refLabel(projet.organisme) : '—'}
                  </td>
                  {/* Réf courrier / Transmis / Couverture : source lots_transmission, endpoint non confirmé */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono text-[#5A6B80]">—</td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">—</td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">—</td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono font-semibold text-[#131C29]">
                    {money(Number(b.montant_accorde))}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <StatusBadge
                      label={b.statut}
                      variant={b.statut === 'APPROUVE' ? 'gr' : b.statut === 'EN_ATTENTE' ? 'am' : 'rd'}
                    />
                  </td>
                  {/* Taux. Int / Durée Remb : source compte_financements, endpoint non confirmé */}
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">—</td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">—</td>
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
