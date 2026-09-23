import dayjs from 'dayjs'
import { cn } from '@/lib/utils'
import type { LIGNE_DECAISSEMENT_T } from '@/types'
import { STATUT_LIGNE } from '@/constants/PLAN_STATUSES'
import { useConfigStore } from '@/store/useConfigStore'

export function LignesTable({ lignes }: { lignes: LIGNE_DECAISSEMENT_T[] }) {
  const { sigle_monnaie_pays } = useConfigStore()

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
    <div className="space-y-3">
      {Object.entries(grouped).map(([num, grpLignes]) => (
        <div key={num} className="border border-slate-100 rounded-lg overflow-hidden">
          <div className="bg-slate-50 px-3 py-1.5 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-700 text-white text-[11px] font-bold flex items-center justify-center flex-none">
              {num}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {grpLignes.length} ligne{grpLignes.length > 1 ? 's' : ''} · Numéro {num}
            </span>
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
                      {Number(l.montant_ligne || 0).toLocaleString('fr-FR')} ${sigle_monnaie_pays}
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
      ))}
    </div>
  )
}
