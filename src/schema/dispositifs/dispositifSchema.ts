import { z } from 'zod'

export const dispositifSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  projet_id: z.number().nullable().optional(),
  guichet_id: z.number().nullable().optional(),
  intitule: z.string().min(1, "L'intitulé est requis"),
  budget_alloue: z.number().min(0),
  montant_min: z.number().min(0),
  montant_max: z.number().min(0),
  taux: z.number().min(0),
  duree: z.number().min(0),
  nbre_emplois_prevu: z.number().min(0),
  nbre_beneficiaire_prevu: z.number().min(0),
  nbre_micro_projet_prevu: z.number().min(0),
})

export type DispositifFormValues = z.infer<typeof dispositifSchema>
