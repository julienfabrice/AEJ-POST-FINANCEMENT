import { z } from 'zod'

export const organismeSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis.'),
  sigle: z.string().min(1, 'Le sigle est requis.'),
  type: z.number({ message: 'Le type de partenaire est requis.' }).min(1, 'Le type de partenaire est requis.'),
  site_web: z.string().optional(),
  description: z.string().optional(),
  adresse: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().email("L'email n'est pas valide.").optional().or(z.literal('')),
})

export type OrganismeFormValues = z.infer<typeof organismeSchema>
