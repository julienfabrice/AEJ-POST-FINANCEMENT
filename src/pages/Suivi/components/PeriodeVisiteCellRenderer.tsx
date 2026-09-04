import type { ICellRendererParams } from 'ag-grid-community'
import { formatDate } from '@/helpers/age'
import type { EXPLOITATION_T } from '@/types'

/**
 * Borne de la période — la SEULE logique propre à cet écran.
 *
 * Le « JJ/MM/AAAA » lui-même vient de `formatDate` (`@/helpers/age`), formateur
 * commun du dépôt : il gère déjà la date illisible et le repli « — ». Ne
 * subsiste ici que la borne ABSENTE, qui n'est pas une erreur mais une période
 * ouverte d'un côté — d'où « … » et non « — ».
 */
const borne = (valeur: string | null | undefined): string => (valeur ? formatDate(valeur) : '…')

/**
 * Période de visite — « JJ/MM/AAAA → JJ/MM/AAAA ».
 *
 * ARBITRAGE maquette ↔ API : la maquette n'avait qu'un champ « Date de visite ».
 * L'API porte une PÉRIODE (`date_debut_visite` → `date_fin_visite`). L'API fait
 * autorité sur le fond : la colonne affiche les deux bornes. Quand une seule
 * borne est renseignée, on n'invente pas l'autre — on affiche la borne connue
 * seule, précédée ou suivie de la flèche pour montrer que la période est
 * ouverte d'un côté.
 */
export const PeriodeVisiteCellRenderer = (params: ICellRendererParams<EXPLOITATION_T>) => {
  const debut = params.data?.date_debut_visite
  const fin = params.data?.date_fin_visite

  // Aucune borne : la visite n'est pas datée du tout — repli « — » habituel.
  if (!debut && !fin) {
    return <span className="text-[12.5px] text-slate-500">—</span>
  }

  return (
    <span className="text-[13px] text-[#131C29]">
      {borne(debut)} → {borne(fin)}
    </span>
  )
}
