import { z } from 'zod'

export const guichetSchema = z.object({
  code: z.string().min(1, 'Le code est requis.'),
  libelle: z.string().min(1, 'Le libellé est requis.'),
  description: z.string().optional(),
  couleur: z.string().optional(),
  montant_min: z.number().int('Le montant doit être un entier sans virgule').min(0, 'Le montant minimum doit être positif.'),
  montant_max: z.number().int('Le montant doit être un entier sans virgule').min(0, 'Le montant maximum doit être positif.'),
  is_active: z.boolean(),
  is_form_active: z.boolean(),
}).refine((data) => data.montant_max >= data.montant_min, {
  message: 'Le montant maximum doit être supérieur ou égal au montant minimum.',
  path: ['montant_max'],
})

export type GuichetFormValues = z.infer<typeof guichetSchema>
