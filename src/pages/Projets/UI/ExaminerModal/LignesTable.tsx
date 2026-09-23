import dayjs from 'dayjs'
import { cn } from '@/lib/utils'
import type { LIGNE_DECAISSEMENT_T } from '@/types'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { STATUT_LIGNE } from '@/constants/PLAN_STATUSES'
import { useConfigStore } from '@/store/useConfigStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useAutoriserNumero } from '../../hooks/actions/autoriser/useAutoriserNumero'
import { useExecuterNumero } from '../../hooks/actions/executer/useExecuterNumero'
import { AutoriserModal } from '../PlanDecaissementModal/AutoriserModal'
import { ExecuterModal } from '../PlanDecaissementModal/ExecuterModal'
import { Button } from '@/components/ui/button'

export function peutAutoriserNumero(num: number, lignes: LIGNE_DECAISSEMENT_T[]) {
  const grp = lignes.filter(l => l.numero_ligne === num)
  if (!grp.length || !grp.every(l => l.statut === 'PREVU')) return false
  const prec = lignes.filter(l => l.numero_ligne < num)
  return prec.every(l => l.statut === 'EXECUTE')
}

export function peutExecuterNumero(num: number, lignes: LIGNE_DECAISSEMENT_T[]) {
  const grp = lignes.filter(l => l.numero_ligne === num)
  if (!grp.length) return false
  // L'agence peut exécuter si toutes les lignes du groupe sont au moins AUTORISE,
  // et qu'il reste au moins une ligne qui n'est pas encore EXECUTE.
  if (!grp.every(l => l.statut === 'AUTORISE' || l.statut === 'EXECUTE')) return false
  if (grp.every(l => l.statut === 'EXECUTE')) return false
  return true
}

export function LignesTable({ lignes, projet }: { lignes: LIGNE_DECAISSEMENT_T[], projet?: MICRO_PROJET_T }) {
  const { sigle_monnaie_pays } = useConfigStore()
  const user = useAuthStore(s => s.user)
  const roleCode = import.meta.env.VITE_MOCK_USER_ROLE || user?.role?.code || ''
  
  const autoriserHook = useAutoriserNumero(projet || null)
  const executerHook = useExecuterNumero(projet || null)

  if (!lignes || lignes.length === 0) {
    return (
      <div className="text-[12px] text-slate-500 italic p-3 border border-slate-100 rounded-lg bg-slate-50 text-center">
        Aucune ligne de décaissement trouvée.
      </div>
    )
  }

  // Grouper les lignes par numéro
  const grouped = lignes.reduce<Record<number, LIGNE_DECAISSEMENT_T[]>>((acc, l) => {
    const num = l.numero_ligne
    if (!acc[num]) acc[num] = []
    acc[num].push(l)
    return acc
  }, {})

  return (
    <>
      <div className="space-y-3">
        {Object.entries(grouped).map(([numStr, grpLignes]) => {
          const num = Number(numStr)
          const peutAutoriser = roleCode === 'PF' && peutAutoriserNumero(num, lignes)
          const peutExecuter = ['CAR', 'CIP'].includes(roleCode) && peutExecuterNumero(num, lignes)

          return (
            <div key={num} className="border border-slate-100 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-3 py-1.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-slate-700 text-white text-[11px] font-bold flex items-center justify-center flex-none">
                    {num}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {grpLignes.length} ligne{grpLignes.length > 1 ? 's' : ''} · Numéro {num}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {peutAutoriser && (
                    <Button 
                      size="sm" 
                      className="h-7 text-[11px] bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => autoriserHook.openAutoriserModal(num)}
                    >
                      Autoriser le décaissement
                    </Button>
                  )}
                  {peutExecuter && (
                    <Button 
                      size="sm" 
                      className="h-7 text-[11px] bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => executerHook.openExecuterModal(num)}
                    >
                      Exécuter le décaissement
                    </Button>
                  )}
                </div>
              </div>
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-3 py-1.5 text-slate-400 font-semibold">Libellé</th>
                    <th className="text-right px-3 py-1.5 text-slate-400 font-semibold">Montant</th>
                    <th className="text-left px-3 py-1.5 text-slate-400 font-semibold hidden sm:table-cell">Date prévue</th>
                    <th className="text-left px-3 py-1.5 text-slate-400 font-semibold hidden sm:table-cell">Mode</th>
                    <th className="text-left px-3 py-1.5 text-slate-400 font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {grpLignes.map((l, i) => {
                    const st = STATUT_LIGNE[l.statut] ?? { label: l.statut, color: 'text-slate-500 bg-slate-100' }
                    return (
                      <tr key={i} className="border-b border-slate-50 last:border-0">
                        <td className="px-3 py-2 text-slate-700">{l.object_ligne || 'N/A'}</td>
                        <td className="px-3 py-2 text-right font-mono font-semibold text-slate-800">
                          {Number(l.montant_ligne || 0).toLocaleString('fr-FR')} {sigle_monnaie_pays}
                        </td>
                        <td className="px-3 py-2 text-slate-500 hidden sm:table-cell">
                          {l.date_prevue ? dayjs(l.date_prevue).format('DD/MM/YYYY') : 'N/A'}
                        </td>
                        <td className="px-3 py-2 text-slate-500 hidden sm:table-cell">{l.mode_decaisse || 'N/A'}</td>
                        <td className="px-3 py-2">
                          <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', st.color)}>
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
      <AutoriserModal hook={autoriserHook} />
      <ExecuterModal hook={executerHook} />
    </>
  )
}
