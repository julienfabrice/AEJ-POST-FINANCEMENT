import { z } from 'zod'

export const decaissementSchema = z.object({
  plan_decaissement_id: z.number().int().positive('Le plan de décaissement est requis.'),
  agence_id: z.number().int().positive().optional(),
  numero_decaissement: z.string().min(1, 'Le numéro de décaissement est requis.'),
  reference_banque: z.string().min(1, 'La référence bancaire est requise.'),
  date_decaissement: z.string().min(1, 'La date est requise.'),
  // Pas de z.coerce → on convertit manuellement via valueAsNumber dans l'input
  montant_decaisse: z.number({ message: 'Le montant doit être un nombre.' }).positive('Le montant doit être positif.'),
  statut: z.enum(['EN_ATTENTE', 'VALIDE', 'NON_VALIDE']),
  observations: z.string().optional(),
})

export type DecaissementFormValues = z.infer<typeof decaissementSchema>
