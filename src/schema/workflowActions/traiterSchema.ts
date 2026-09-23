import { z } from 'zod'

export const traiterSchema = z.object({
  date_ouverture_compte: z.string().optional(),
  decision: z.enum(['EN_ATTENTE', 'APPROUVE', 'REJETE']),
  montant_credit: z.number().min(0),
  taux_interet: z.number().min(0).max(100),
  duree_pret: z.number().min(0),
  duree_remboursement: z.number().min(0),
  motif_rejet: z.string().optional(),
})

export type TraiterFormValues = z.infer<typeof traiterSchema>
