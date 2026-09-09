import { Loader2 } from 'lucide-react'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import type { EtapeRolesMap } from '../hooks/useEtapeRolesMap'
import type { WORKFLOW_ETAPE_ROLE_T } from '@/types/workflow.types'
import { useProjetActions } from '../hooks/actions'

// ─── Mapping des codes rôles → labels lisibles ───────────────────────────────
// Couvre à la fois les codes du backend auth ET les codes du backend workflow
const ROLE_LABELS: Record<string, string> = {
  // Codes workflow (provenant de etape-roles)
  CHEF_AGENCE: "Chef d'agence",
  CIP: 'CIP',
  SDRF: 'SDRF',
  DPF: 'DPF',
  DIC: 'DIC',
  DESSE: 'DESSE',
  CSFM: 'CSFM',
  CSRGC: 'CSRGC',
  SDEF: 'SDEF',
  SDPF: 'SDPF',
  DAICG: 'DAICG',
  AF: 'Agent financier',
  COMITE: 'Comité',
  PF: 'Partenaire financier',
  // Codes auth (provenant de user.role.code)
  'ADMIN-1': 'Admin national',
  CAR: "Chef d'agence",
  AGENT_DIR: 'Agent direction',
}

/** Retourne le label lisible d'un role_code (workflow ou auth). */
function roleCode(roleCode: string, roleRelation?: any): string {
  // Priorité 1 : relation backend si chargée
  if (roleRelation?.code) return roleRelation.code
  // if (roleRelation?.nom) return roleRelation.nom
  // Priorité 2 : mapping local
  if (ROLE_LABELS[roleCode]) return ROLE_LABELS[roleCode]
  // Fallback : code brut formaté
  return roleCode.replace(/_/g, ' ')
}

/** Formate un code action en label bouton lisible.
 *  Ex: "AJOUT_PLAN_AFFAIRES" → "Ajouter plan d'affaires" */
function actionLabel(action: string): string {
  const KNOWN: Record<string, string> = {
    JOINDRE_PLAN: 'Joindre le plan',
    VALIDER: 'Valider',
    TRANSMETTRE: 'Transmettre',
    TRAITER: 'Traiter',
    DECAISSER: 'Décaisser',
    REMBOURSEMENTS: 'Remboursements',
    VISITE_SUIVI: 'Visite de suivi',
    IMPUTER: 'Imputer',
    PLAN_DECAISSEMENT: 'Plan de décaissement',
    CORRIGER: 'Corriger',
    EXAMINER: 'Examiner',
    AUTORISER: 'Autoriser',
    EXECUTER: 'Exécuter',
    PLAN_CONVENTION: 'Plan & convention'
  }
  if (KNOWN[action]) return KNOWN[action]
  // Format générique : "AJOUT_PLAN_AFFAIRES" → "Ajout plan affaires"
  return action
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
}

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

  if (myRoles.length > 0) {
    return (
      <div className="flex flex-wrap items-center gap-1 h-full">
        {myRoles.map((r) => (
          <button
            key={`${r.id}-${r.action}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              executeAction(r.action, projet)
            }}
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md
              bg-[#5B5FEF] text-white hover:bg-[#4347d6] active:scale-95
              transition-all duration-100 shadow-sm cursor-pointer border-0 outline-none"
          >
            {actionLabel(r.action)}
          </button>
        ))}
      </div>
    )
  }

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
        className="text-[11px] text-slate-500 leading-tight truncate"
        title={acteursText}
      >
        {acteursText}
      </span>
    </div>
  )
}

// ─── Skeleton affiché pendant le chargement ───────────────────────────────────

export function AffaireCellLoading() {
  return (
    <div className="flex items-center h-full">
      <Loader2 className="w-3.5 h-3.5 text-slate-300 animate-spin" />
    </div>
  )
}
