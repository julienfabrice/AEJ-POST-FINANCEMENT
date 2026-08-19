import { z } from 'zod'

export const SecteurSchema = z.object({
  libelle: z.string().min(1, 'Le libellé est requis.'),
})

export type SecteurFormValues = z.infer<typeof SecteurSchema>
