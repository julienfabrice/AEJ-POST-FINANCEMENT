import { useState } from 'react'
import dayjs from 'dayjs'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '../../EspacePartenaireFinancier/components/StatusBadge'
import { money } from '@/helpers/money'
import { transactionServices } from '@/services/transactions.services'
import { TransactionFormModal } from '../components/TransactionFormModal'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'
import type { TRANSACTION_T, TRANSACTION_STATUT_T } from '@/types'

const STATUT_VARIANTS: Record<TRANSACTION_STATUT_T, 'gr' | 'am' | 'rd' | 'gy'> = {
  BROUILLON: 'gy',
  SOUMIS: 'am',
  VALIDE: 'gr',
  REJETE: 'rd',
  ANNULE: 'gy',
}

export function TabDepenses() {
  const { data: depenses = [], isLoading } = transactionServices.useGetAll()
  const { mutate: deleteTransaction } = transactionServices.useDelete()

  const [toEdit, setToEdit] = useState<TRANSACTION_T | null>(null)
  const [toDelete, setToDelete] = useState<TRANSACTION_T | null>(null)

  return (
    <Card className="p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
      <TransactionFormModal open={!!toEdit} onOpenChange={(open) => !open && setToEdit(null)} initialData={toEdit} />
      <DeleteConfirmModal
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        itemLabel={toDelete?.libelle}
        onConfirm={() => toDelete && deleteTransaction(toDelete.id)}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Micro-projet', 'Catégorie', 'Intitulé', 'Montant', 'Date', 'Statut', ''].map((h, i) => (
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
            {isLoading && (
              <tr><td colSpan={7} className="px-[14px] py-6 text-center text-[13px] text-[#8595A8]">Chargement...</td></tr>
            )}
            {!isLoading && depenses.length === 0 && (
              <tr><td colSpan={7} className="px-[14px] py-6 text-center text-[13px] text-[#8595A8]">Aucune dépense.</td></tr>
            )}
            {depenses.map((d) => {
              const projet = d.micro_projet
              return (
                <tr key={d.id} className="hover:bg-[#fafbfe] transition-colors">
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px]">
                    {projet ? (
                      <>
                        <span className="inline-flex items-center gap-[5px] text-[11.5px] font-semibold px-[9px] py-[3px] rounded-full bg-[#FBEADE] text-[#C85E18] mr-2">
                          {projet.code}
                        </span>
                        <span className="text-[#5A6B80]">{projet.intitule}</span>
                      </>
                    ) : (
                      <span className="text-[#8595A8]">#{d.micro_projet_id}</span>
                    )}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                    {d.categorie_id ? `Catégorie #${d.categorie_id}` : '—'}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#131C29]">
                    {d.libelle}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono font-semibold text-[#131C29]">
                    {money(Number(d.montant))}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                    {d.date ? dayjs(d.date).format('DD/MM/YYYY') : '—'}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <StatusBadge label={d.statut} variant={STATUT_VARIANTS[d.statut]} />
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setToEdit(d)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#8595A8] hover:bg-[#EEF2F7] hover:text-[#2D6BD4] transition-colors"
                        title="Modifier"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                      </button>
                      <button
                        onClick={() => setToDelete(d)}
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
