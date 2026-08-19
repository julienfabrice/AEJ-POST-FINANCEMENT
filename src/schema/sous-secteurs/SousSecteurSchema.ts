import { z } from 'zod'

export const SousSecteurSchema = z.object({
  libelle: z.string().min(1, 'Le libellé est requis.'),
})

export type SousSecteurFormValues = z.infer<typeof SousSecteurSchema>
