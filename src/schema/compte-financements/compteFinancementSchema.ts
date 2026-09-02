import { z } from 'zod'

export const compteFinancementSchema = z.object({
  organisme_id: z.number().int().positive("Le partenaire (organisme) est requis."),
  micro_projet_id: z.number().int().positive('Le micro-projet est requis.'),
  etat_ouverture: z.enum(['NON_OUVERT', 'OUVERT']),
  localite_ouverture: z.string().optional(),
  date_ouverture: z.string().optional(),
  avis_partenaire: z.enum(['ACCORDE', 'REFUSE', 'EN_ATTENTE']),
  observations: z.string().optional(),
})

export type CompteFinancementFormValues = z.infer<typeof compteFinancementSchema>
