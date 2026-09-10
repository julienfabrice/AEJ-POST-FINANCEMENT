import { z } from 'zod'

export const recouvrementSchema = z.object({
  micro_projet_id: z.number().int().positive('Le micro-projet est requis.'),
  plan_remboursement_id: z.number().int().positive('Le plan de remboursement est requis.'),
  agent_id: z.number().int().positive("L'agent est requis."),
  montant_recouvre: z.number().positive('Le montant doit être positif.'),
  date_recouvrement: z.string().min(1, 'La date est requise.'),
  type_action: z.enum(['APPEL', 'COURRIER', 'DECHARGE', 'MISE_EN_DEMEURE', 'CONTENTIEUX']),
  justificatif_path: z.string().optional(),
  observations: z.string().optional(),
})

export type RecouvrementFormValues = z.infer<typeof recouvrementSchema>
