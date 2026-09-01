import { useMemo } from 'react'
import { remboursementServices } from '@/services/remboursements.services'
import type { REMBOURSEMENT_T } from '@/types'

interface BucketItem {
  promoteurId: number
  nbImpayees: number
  du: number
  paye: number
}

function classer(remboursements: REMBOURSEMENT_T[]) {
  const parPromoteur = new Map<number, REMBOURSEMENT_T[]>()
  remboursements.forEach((r) => {
    const list = parPromoteur.get(r.promoteur_id) ?? []
    list.push(r)
    parPromoteur.set(r.promoteur_id, list)
  })

  const cats: { AJOUR: BucketItem[]; LEGER: BucketItem[]; LOURD: BucketItem[] } = { AJOUR: [], LEGER: [], LOURD: [] }
  parPromoteur.forEach((rows, promoteurId) => {
    const nbImpayees = rows.filter((r) => r.statut === 'NON_PAYE').length
    const item: BucketItem = {
      promoteurId,
      nbImpayees,
      du: rows.reduce((a, r) => a + r.montant_echu, 0),
      paye: rows.reduce((a, r) => a + r.montant_paye, 0),
    }
    if (nbImpayees === 0) cats.AJOUR.push(item)
    else if (nbImpayees <= 3) cats.LEGER.push(item)
    else cats.LOURD.push(item)
  })
  return cats
}

function BucketCard({ titre, badgeClass, items, vide }: { titre: string; badgeClass: string; items: BucketItem[]; vide: string }) {
  return (
    <div className="bg-white border border-[#E5EAF1] rounded-[11px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#F1F4F8]">
        <h3 className="text-[14px] font-bold text-[#131C29]">{titre}</h3>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>{items.length}</span>
      </div>
      <div className="p-4 space-y-2 max-h-[260px] overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">{vide}</p>
        ) : (
          items.map((it) => (
            <div key={it.promoteurId} className="rounded-lg border border-[#F1F4F8] px-3 py-2">
              <b className="text-[13.5px] text-[#131C29]">Promoteur #{it.promoteurId}</b>
              <div className="text-xs text-[#8595A8] mt-0.5">
                {it.nbImpayees > 0 ? `${it.nbImpayees} échéance(s) impayée(s)` : 'À jour'} · Dû {it.du.toLocaleString('fr-FR')} F · Payé {it.paye.toLocaleString('fr-FR')} F
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export function RemboursementsBuckets() {
  const { data: remboursements = [] } = remboursementServices.useGetAll()
  const cats = useMemo(() => classer(remboursements), [remboursements])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <BucketCard titre="À jour" badgeClass="bg-emerald-100 text-emerald-700" items={cats.AJOUR} vide="Aucun dossier à jour" />
      <BucketCard titre="≤ 3 échéances impayées" badgeClass="bg-amber-100 text-amber-700" items={cats.LEGER} vide="Aucun dossier concerné" />
      <BucketCard titre="> 3 échéances impayées" badgeClass="bg-red-100 text-red-700" items={cats.LOURD} vide="Aucun dossier concerné" />
    </div>
  )
}
