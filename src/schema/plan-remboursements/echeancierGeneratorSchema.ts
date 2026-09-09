import { z } from 'zod'

export const echeancierGeneratorSchema = z.object({
  micro_projet_id: z.number().int().positive('Le micro-projet est requis.'),
  budget_id: z.number().int().positive().optional(),
  capital: z.number().positive('Le capital doit être positif.'),
  taux_annuel: z.number().min(0, 'Le taux doit être positif ou nul.'),
  duree_mois: z.number().int().positive('La durée doit être supérieure à 0.'),
  differe_mois: z.number().int().min(0, 'Le différé doit être positif ou nul.'),
  date_debut: z.string().min(1, 'La date de première échéance est requise.'),
})

export type EcheancierGeneratorFormValues = z.infer<typeof echeancierGeneratorSchema>
