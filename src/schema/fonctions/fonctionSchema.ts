import { z } from 'zod'

export const fonctionSchema = z.object({
  code: z.string().min(1, 'Le code est requis.'),
  nom: z.string().min(1, 'Le nom est requis.'),
  description: z.string().optional(),
  service_id: z.number({ message: 'Le service est requis.' }).min(1, 'Le service est requis.'),
})

export type FonctionFormValues = z.infer<typeof fonctionSchema>
