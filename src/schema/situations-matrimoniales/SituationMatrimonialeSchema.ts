import { z } from 'zod'

export const SituationMatrimonialeSchema = z.object({
  libelle: z.string().min(1, 'Le libellé est requis.'),
})

export type SituationMatrimonialeFormValues = z.infer<typeof SituationMatrimonialeSchema>
