// ─── Mapping des codes rôles → labels lisibles ───────────────────────────────
// Couvre à la fois les codes du backend auth ET les codes du backend workflow
export const ROLE_LABELS: Record<string, string> = {
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
export function roleCode(roleCode: string, roleRelation?: any): string {
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
export function actionLabel(action: string): string {
  const KNOWN: Record<string, string> = {
    JOINDRE_PLAN: 'Joindre le plan',
    AJOUT_PLAN_AFFAIRES: 'Joindre le plan',
    VALIDER: 'Valider',
    VALIDATION: 'Valider',
    TRANSMETTRE: 'Transmettre',
    TRANSMISSION: 'Transmettre',
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
