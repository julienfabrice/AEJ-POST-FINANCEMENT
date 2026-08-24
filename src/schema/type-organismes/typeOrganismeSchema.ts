import { z } from 'zod'

export const typeOrganismeSchema = z.object({
  code: z.string().min(1, 'Le code est requis.'),
  libelle: z.string().min(1, 'Le libellé est requis.'),
})

export type TypeOrganismeFormValues = z.infer<typeof typeOrganismeSchema>
