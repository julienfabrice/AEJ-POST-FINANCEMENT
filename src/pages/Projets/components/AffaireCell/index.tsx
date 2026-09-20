import { Clock } from 'lucide-react'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import type { EtapeRolesMap } from '../../hooks/useEtapeRolesMap'
import type { WORKFLOW_ETAPE_ROLE_T } from '@/types/workflow.types'
import { useProjetActions } from '../../hooks/actions'
import { Button } from '@/components/ui/button'
import { roleCode, actionLabel } from '@/helpers/workflowLabels'

// ─── Props ────────────────────────────────────────────────────────────────────

interface AffaireCellProps {
  projet: MICRO_PROJET_T
  etapeRolesMap: EtapeRolesMap
  /** Code du rôle de l'utilisateur connecté (ex: "CIP", "CHEF_AGENCE"). */
  userRoleCode: string | undefined | null
}

/**
 * Cellule **"À faire"** dans la liste des micro-projets.
 *
 * Logique :
 * 1. Lit `workflow_instance.current_etape_code` du projet.
 * 2. Cherche les rôles de cette étape dans `etapeRolesMap`.
 * 3a. L'utilisateur fait partie des rôles → bouton(s) avec l'action à effectuer.
 * 3b. L'utilisateur ne fait PAS partie des rôles → liste des acteurs séparés par `/`.
 * 4. Pas d'instance workflow ou pas de rôles → `—`.
 */
export function AffaireCell({ projet, etapeRolesMap, userRoleCode }: AffaireCellProps) {
  const instance = projet.workflow_instance

  // Pas d'instance workflow
  if (!instance?.current_etape_code) {
    return <span className="text-slate-300 text-xs">—</span>
  }

  const etapeRoles: WORKFLOW_ETAPE_ROLE_T[] = etapeRolesMap[instance.current_etape_code] ?? []

  // Aucun rôle défini pour cette étape
  if (etapeRoles.length === 0) {
    return <span className="text-slate-300 text-xs">—</span>
  }

  // ── Cas 1 : l'utilisateur fait partie des rôles de l'étape ────────────────
  const myRoles = etapeRoles.filter((r) => r.role_code === userRoleCode)

  const { executeAction } = useProjetActions()

  // Logique du bouton de remboursement parallèle au workflow
  // Il est disponible si le plan de remboursement existe ET qu'on n'est pas terminé
  const isRemboursementAvailable = Boolean(projet.plan_remboursement) && projet.statut !== 'TERMINE' && projet.stade_projet !== 'TERMINE'

  // Si on n'est ni acteur de l'étape, ni éligible au remboursement, on affiche l'attente
  if (myRoles.length === 0 && !isRemboursementAvailable) {
    // ── Cas 2 : l'utilisateur n'est pas impliqué → afficher les acteurs ────────
    // Rôles distincts (dédupliqués par role_code)
    const acteursUniq = Array.from(
      new Map(etapeRoles.map((r) => [r.role_code, r])).values()
    )

    const acteursText = acteursUniq
      .map((r) => roleCode(r.role_code, r.role))
      .join(' / ')

    return (
      <div className="flex items-center h-full max-w-[170px]">
        <span
          className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-500 whitespace-nowrap truncate"
          title={`En attente de : ${acteursText}`}
        >
          <Clock className="w-3.5 h-3.5 opacity-80 shrink-0" />
          <span className="truncate">{acteursText}</span>
        </span>
      </div>
    )
  }

  // Sinon, on affiche les boutons d'actions (les actions du workflow + Remboursement si éligible)
  return (
    <div className="flex flex-wrap items-center gap-1 h-full">
      {myRoles.map((r) => (
        <Button
          key={`${r.id}-${r.action}`}
          type="button"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            executeAction(r.action, projet)
          }}
          className="bg-[#E7722B] text-white hover:bg-[#C85E18] h-7 px-3 text-[11px] font-semibold"
        >
          {actionLabel(r.action)}
        </Button>
      ))}

      {isRemboursementAvailable && (
        <Button
          type="button"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            executeAction('REMBOURSEMENTS', projet)
          }}
          className="bg-green-600 text-white hover:bg-green-700 h-7 px-3 text-[11px] font-semibold"
        >
          Remboursement
        </Button>
      )}
    </div>
  )
}

export { AffaireCellLoading } from './AffaireCellLoading'
