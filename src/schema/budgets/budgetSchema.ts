import { z } from 'zod'

export const budgetSchema = z.object({
  micro_projet_id: z.number().int().positive('Le micro-projet est requis.'),
  intitule: z.string().min(1, "L'intitulé est requis."),
  montant_accorde: z.number().positive('Le montant doit être positif.'),
  date_accord: z.string().optional(),
  source: z.string().optional(),
  statut: z.enum(['EN_ATTENTE', 'APPROUVE', 'NON_APPROUVE']),
  devise: z.string().min(1, 'La devise est requise.'),
  deblocage: z.boolean(),
  date_deblocage: z.string().optional(),
  signature_convention: z.enum(['SIGNEE', 'NON_SIGNEE']),
  date_signature: z.string().optional(),
  reception_acte_credit: z.enum(['OUI', 'NON', 'PARTIEL']),
  date_reception: z.string().optional(),
  observations: z.string().optional(),
})

export type BudgetFormValues = z.infer<typeof budgetSchema>
