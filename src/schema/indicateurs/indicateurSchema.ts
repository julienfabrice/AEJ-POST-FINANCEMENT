import { z } from 'zod'

export const indicateurSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis.'),
  description: z.string().optional(),
  type_valeur: z.string().min(1, 'Le type de valeur est requis.'),
  unite: z.string().min(1, 'L\'unité est requise.'),
  statut: z.boolean(),
  code: z.string().optional(),
  valeur_cible: z.number().optional()
})

export type IndicateurFormValues = z.infer<typeof indicateurSchema>
