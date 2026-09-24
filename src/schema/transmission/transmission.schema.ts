import { z } from 'zod'

export const transmissionFormSchema = z.object({
  organisme_id: z.string().min(1, "Partenaire financier requis"),
  reference: z.string().optional(),
  fichier_repartition: z.string().optional(),
  courrier_fichier: z.string().optional(),
  courrier_reference: z.string().min(1, "Référence du courrier requise"),
  date_transmission: z.string().optional(),
  titre_courrier: z.string().optional(),
  taux_couverture: z.coerce.number().optional(),
  duree_differe: z.coerce.number().optional(),
  duree_remboursement: z.coerce.number().optional(),
  reference_convention: z.string().optional(),
})

export type TransmissionFormValues = z.infer<typeof transmissionFormSchema>
