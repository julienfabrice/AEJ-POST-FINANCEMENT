import { AlertCircle, CheckCircle2, Clock, Users } from 'lucide-react'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import type { WorkflowVersionMap } from '../hooks/useWorkflowVersionsMap'
import { getEtapeActuelle, getActionsForRole } from '../hooks/useWorkflowVersionsMap'
import type { WORKFLOW_ETAPE_T } from '@/types/workflow.types'

/** Labels lisibles pour les actions workflow. */
const ACTION_LABELS: Record<string, string> = {
  VALIDER: 'À valider',
  APPROUVER: 'À approuver',
  CERTIFIER: 'À certifier',
  TRANSMETTRE: 'À transmettre',
  DECAISSER: 'À décaisser',
  VERIFIER: 'À vérifier',
  SIGNER: 'À signer',
  INSTRUIRE: 'À instruire',
  ANALYSER: 'À analyser',
  SOUMETTRE: 'À soumettre',
  TRAITER: 'À traiter',
  IMPUTER: 'À imputer',
}

/** Labels lisibles pour les codes de rôle. */
const ROLE_LABELS: Record<string, string> = {
  'ADMIN-1': 'Admin national',
  CIP: 'CIP',
  CAR: 'Chef d\'agence',
  DPF: 'DPF',
  DIC: 'DIC',
  DESSE: 'DESSE',
  SDRF: 'SDRF',
  CSFM: 'CSFM',
  CSRGC: 'CSRGC',
  AGENT_DIR: 'Agent direction',
  SDEF: 'SDEF',
  SDPF: 'SDPF',
  DAICG: 'DAICG',
  AF: 'Agent financier',
  COMITE: 'Comité',
  PF: 'Partenaire financier',
}

/** Couleur du badge selon l'urgence / type d'action. */
function getActionStyle(action: string): string {
  const urgent = ['VALIDER', 'APPROUVER', 'CERTIFIER', 'SIGNER', 'DECAISSER']
  const warning = ['TRANSMETTRE', 'INSTRUIRE', 'ANALYSER']
  if (urgent.includes(action))
    return 'bg-amber-50 text-amber-700 border border-amber-200'
  if (warning.includes(action))
    return 'bg-blue-50 text-blue-700 border border-blue-200'
  return 'bg-slate-50 text-slate-600 border border-slate-200'
}

/**
 * Retourne la liste des rôles distincts impliqués dans une étape
 * avec leur libellé lisible.
 */
function getRolesActeurs(etape: WORKFLOW_ETAPE_T): { code: string; label: string }[] {
  if (!etape.roles) return []
  const seen = new Set<string>()
  const result: { code: string; label: string }[] = []
  for (const r of etape.roles) {
    if (!seen.has(r.role_code)) {
      seen.add(r.role_code)
      // Priorité : libellé depuis la relation backend, sinon mapping local, sinon code brut
      const label =
        (r.role as any)?.libelle ||
        (r.role as any)?.nom ||
        ROLE_LABELS[r.role_code] ||
        r.role_code
      result.push({ code: r.role_code, label })
    }
  }
  return result
}

interface AffaireCellProps {
  projet: MICRO_PROJET_T
  versionsMap: WorkflowVersionMap
  userRoleCode: string | undefined | null
}

/**
 * Cellule "À faire" dans la liste des micro-projets.
 *
 * Logique :
 * 1. Récupère l'étape actuelle depuis le `workflow_instance` du projet.
 * 2. Cherche les rôles de cette étape dans le dictionnaire des versions.
 * 3. Si l'utilisateur fait partie des rôles ⇒ affiche les actions à faire (badge coloré).
 * 4. Sinon ⇒ affiche la liste des acteurs/rôles attendus pour cette étape.
 */
export function AffaireCell({ projet, versionsMap, userRoleCode }: AffaireCellProps) {
  const instance = projet.workflow_instance

  // Pas d'instance workflow : affichage neutre
  if (!instance) {
    return (
      <div className="flex items-center h-full">
        <span className="text-slate-300 text-xs">—</span>
      </div>
    )
  }

  const etape = getEtapeActuelle(instance.workflow_version, instance.current_etape_code, versionsMap)

  // Version pas encore chargée (map vide)
  if (!etape) {
    return (
      <div className="flex items-center h-full">
        <span className="text-slate-300 text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
        </span>
      </div>
    )
  }

  const actions = getActionsForRole(etape, userRoleCode)

  // ── Cas 1 : l'utilisateur a des actions à effectuer ─────────────────────────
  if (actions.length > 0) {
    return (
      <div className="flex items-center gap-1 h-full flex-wrap">
        {actions.map((action, i) => {
          const label = ACTION_LABELS[action] ?? action.replace(/_/g, ' ')
          const style = getActionStyle(action)
          return (
            <span
              key={i}
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${style}`}
            >
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              {label}
            </span>
          )
        })}
      </div>
    )
  }

  // ── Cas 2 : l'utilisateur n'est pas impliqué → afficher les acteurs attendus ─
  const acteurs = getRolesActeurs(etape)

  if (acteurs.length === 0) {
    return (
      <div className="flex items-center h-full">
        <span className="text-slate-300 text-xs">—</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center gap-0.5 h-full py-1">
      <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium mb-0.5">
        <Users className="w-3 h-3 shrink-0" />
        En attente de :
      </span>
      <div className="flex flex-wrap gap-1">
        {acteurs.map((acteur) => (
          <span
            key={acteur.code}
            className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200"
          >
            {acteur.label}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Variante pour le cas "chargement des versions en cours". */
export function AffaireCellLoading() {
  return (
    <div className="flex items-center h-full">
      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100">
        <AlertCircle className="w-3 h-3" />
        Chargement...
      </span>
    </div>
  )
}

