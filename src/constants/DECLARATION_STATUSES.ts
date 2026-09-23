import type { REMBOURSEMENT_DECLARATION_STATUT_T, DECAISSEMENT_DECLARATION_STATUT_T } from '@/types'

/**
 * Libellés des statuts de déclarations (remboursements, décaissements).
 */
export const STATUT_LABELS: Record<REMBOURSEMENT_DECLARATION_STATUT_T | DECAISSEMENT_DECLARATION_STATUT_T, string> = {
  BROUILLON: 'Brouillon',
  SOUMIS: 'Soumis',
  TRAITE: 'Traité',
} as const

export const DECLARATION_STATUT_LABELS = STATUT_LABELS

/**
 * Styles visuels (Badges) pour les statuts de déclarations.
 */
export const STATUT_STYLES: Record<REMBOURSEMENT_DECLARATION_STATUT_T | DECAISSEMENT_DECLARATION_STATUT_T, string> = {
  BROUILLON: 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-0',
  SOUMIS: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-0',
  TRAITE: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0',
} as const

export const DECLARATION_STATUT_STYLES = STATUT_STYLES
