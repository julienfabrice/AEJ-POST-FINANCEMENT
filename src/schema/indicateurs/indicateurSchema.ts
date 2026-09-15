import { z } from 'zod'

export const indicateurSchema = z.object({
  libelle: z.string().min(1, 'Le nom est requis.'),
  description: z.string().optional(),
  type_valeur: z.string().min(1, 'Le type de valeur est requis.'),
  unite: z.string().min(1, 'L\'unité est requise.'),
  statut: z.boolean(),
  code: z.string(),
  valeur_cible: z.string(),
  micro_projet_id: z.number()
})

export type IndicateurFormValues = z.infer<typeof indicateurSchema>
