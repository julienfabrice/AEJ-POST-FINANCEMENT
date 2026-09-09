import { z } from 'zod'

export const decaissementSchema = z.object({
  plan_decaissement_id: z.number().int().positive('Le plan de décaissement est requis.'),
  ligne_decaissement_id: z.number().int().positive().optional(),
  agence_id: z.number().int().positive().optional(),
  montant_decaisse: z.number().positive('Le montant doit être positif.'),
  date_decaissement: z.string().optional(),
  reference_banque: z.string().optional(),
  statut: z.enum(['EN_ATTENTE', 'VALIDE', 'NON_VALIDE']),
  observations: z.string().optional(),
})

export type DecaissementFormValues = z.infer<typeof decaissementSchema>
