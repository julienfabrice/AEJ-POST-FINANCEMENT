import * as z from 'zod'

// ─── Patch d'une instance de workflow ────────────────────────────────────────

export const workflowInstancePatchSchema = z.object({
  current_etape_code: z.string().nullable().optional(),
  next_etape_code: z.string().nullable().optional(),
  statut: z.string().optional(),
  completed_at: z.string().nullable().optional(),
})

export type WorkflowInstancePatchValues = z.infer<typeof workflowInstancePatchSchema>

// ─── Création d'un historique d'action ───────────────────────────────────────

export const workflowHistorySchema = z.object({
  workflow_instance_id: z.number(),
  etape_code: z.string().min(1),
  role_code: z.string().min(1),
  acted_by: z.number(),
  action: z.string().min(1),
  comment: z.string().nullable().optional(),
})

export type WorkflowHistoryValues = z.infer<typeof workflowHistorySchema>
