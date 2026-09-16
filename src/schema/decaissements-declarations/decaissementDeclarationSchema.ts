import { z } from 'zod'

export const decaissementDeclarationSchema = z.object({
  plan_decaissement_id: z.number().int().positive('Le plan de décaissement est requis.'),
  promoteur_id: z.number().int().positive('Le promoteur est requis.'),
  montant_declare: z.number().positive('Le montant doit être positif.'),
  date_declaree: z.string().min(1, 'La date est requise.'),
  reference_banque: z.string().optional(),
  justificatif_path: z.string().optional(),
  observations: z.string().optional(),
  statut: z.enum(['BROUILLON', 'SOUMIS', 'TRAITE']),
})

export type DecaissementDeclarationFormValues = z.infer<typeof decaissementDeclarationSchema>
