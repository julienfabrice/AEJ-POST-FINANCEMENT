import { useMemo, useState } from 'react'
import { Search, Plus, Pencil, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Fuse from 'fuse.js'
import { budgetServices } from '@/services/budgets.services'
import { projetsServices } from '@/services/projets.services'
import { BudgetFormModal } from './BudgetFormModal'
import type { BUDGET_T } from '@/types'

const formatMontant = (n: number) => `${n.toLocaleString('fr-FR')} F`

const APPROBATION_STYLES: Record<string, string> = {
  EN_ATTENTE: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-0',
  APPROUVE: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0',
  NON_APPROUVE: 'bg-red-100 text-red-700 hover:bg-red-100 border-0',
}
const APPROBATION_LABELS: Record<string, string> = {
  EN_ATTENTE: 'EN ATTENTE',
  APPROUVE: 'APPROUVE',
  NON_APPROUVE: 'NON APPROUVE',
}

export function BudgetsTable() {
  const [search, setSearch] = useState('')
  const [editingItem, setEditingItem] = useState<BUDGET_T | null>(null)

  const { data: budgets = [], isLoading } = budgetServices.useGetAll()
  const { mutate: deleteBudget } = budgetServices.useDelete()
  // Table de correspondance micro_projet_id → libellé lisible (code, intitulé, promoteur).
  const { data: projetsPage } = projetsServices.useGetAll(1, 100)

  const projetById = useMemo(() => {
    const map = new Map<number, { code: string; intitule: string; promoteur?: string }>()
    projetsPage?.data.forEach((p) => {
      map.set(p.id, {
        code: p.code,
        intitule: p.intitule,
        promoteur: p.promoteur ? `${p.promoteur.prenom} ${p.promoteur.nom}` : undefined,
      })
    })
    return map
  }, [projetsPage])

  const filtered = useMemo(() => {
    if (!search.trim()) return budgets
    const fuse = new Fuse(budgets, { keys: ['intitule', 'source'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(search).map((r) => r.item)
  }, [budgets, search])

  return (
    <div className="space-y-4">
      {editingItem && (
        <BudgetFormModal open onOpenChange={(open) => !open && setEditingItem(null)} initialData={editingItem} />
      )}

      <div className="flex items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Rechercher un budget…"
            className="pl-9 h-9 bg-white border-slate-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-[12.5px] text-slate-500 whitespace-nowrap">
          {isLoading ? 'Chargement...' : `${filtered.length} budget(s) accordé(s)`}
        </span>
        <div className="flex-1" />
        <BudgetFormModal>
          <Button className="h-9"><Plus className="w-4 h-4 mr-2" />Nouveau budget</Button>
        </BudgetFormModal>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-[11.5px] font-semibold text-[#8595A8] uppercase tracking-wide border-b border-[#E5EAF1]">
              <th className="py-3 pr-4">Projet</th>
              <th className="py-3 pr-4">Réf. courrier</th>
              <th className="py-3 pr-4">Transmis le</th>
              <th className="py-3 pr-4">Couverture</th>
              <th className="py-3 pr-4">Montant</th>
              <th className="py-3 pr-4">Approbation</th>
              <th className="py-3 pr-4">Taux</th>
              <th className="py-3 pr-4">Durée rembt.</th>
              <th className="py-3 pr-4">Convention</th>
              <th className="py-3 pr-4">Déblocage</th>
              <th className="py-3 pr-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => {
              const projet = projetById.get(b.micro_projet_id)
              return (
                <tr key={b.id} className="border-b border-[#F1F4F8] hover:bg-[#FAFBFD]">
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-[#131C29]">
                      {projet ? `${projet.code} — ${projet.intitule}` : `Micro-projet #${b.micro_projet_id}`}
                    </div>
                    {projet?.promoteur && <div className="text-xs text-[#8595A8]">({projet.promoteur})</div>}
                  </td>
                  <td className="py-3 pr-4 text-[#8595A8]">—</td>
                  <td className="py-3 pr-4 text-[#8595A8]">—</td>
                  <td className="py-3 pr-4 text-[#8595A8]">—</td>
                  <td className="py-3 pr-4 font-semibold text-[#131C29] whitespace-nowrap">{formatMontant(b.montant_accorde)}</td>
                  <td className="py-3 pr-4">
                    <Badge className={APPROBATION_STYLES[b.statut]}>{APPROBATION_LABELS[b.statut]}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-[#8595A8]">—</td>
                  <td className="py-3 pr-4 text-[#8595A8]">—</td>
                  <td className="py-3 pr-4">
                    <Badge className={b.signature_convention === 'SIGNEE' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0' : 'bg-slate-100 text-slate-500 hover:bg-slate-100 border-0'}>
                      {b.signature_convention === 'SIGNEE' ? 'Signée' : 'Non signée'}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge className={b.deblocage === 'OUI' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0' : 'bg-slate-100 text-slate-500 hover:bg-slate-100 border-0'}>
                      {b.deblocage === 'OUI' ? 'DEBLOQUE' : 'NON DEBLOQUE'}
                    </Badge>
                  </td>
                  <td className="py-3 pr-2">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditingItem(b)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteBudget(b.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {!isLoading && filtered.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-10">Aucun budget accordé.</p>
        )}
      </div>
    </div>
  )
}
