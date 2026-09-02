import { z } from 'zod'

export const remboursementSchema = z.object({
  promoteur_id: z.number().int().positive('Le promoteur est requis.'),
  budget_id: z.number().int().positive().optional(),
  montant_echu: z.number().min(0, 'Le montant échu doit être positif ou nul.'),
  montant_paye: z.number().min(0, 'Le montant payé doit être positif ou nul.'),
  montant_impaye: z.number().min(0, "Le montant impayé doit être positif ou nul."),
  penalites: z.number().min(0, 'Les pénalités doivent être positives ou nulles.'),
  date_paiement: z.string().optional(),
  observations: z.string().optional(),
  statut: z.enum(['EN_ATTENTE', 'PAYE', 'PARTIEL', 'NON_PAYE']),
})

export type RemboursementFormValues = z.infer<typeof remboursementSchema>
