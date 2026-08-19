import { z } from 'zod'

export const typeEntrepriseSchema = z.object({
  code: z.string().min(1, 'Le code est requis.'),
  libelle: z.string().min(1, 'Le libellé est requis.'),
})

export type TypeEntrepriseFormValues = z.infer<typeof typeEntrepriseSchema>
