import { z } from 'zod'

export const serviceOrgSchema = z.object({
  code: z.string().min(1, 'Le code est requis.'),
  nom: z.string().min(1, 'Le nom est requis.'),
  description: z.string().optional(),
  direction_id: z.number({ message: 'La direction est requise.' }).min(1, 'La direction est requise.'),
})

export type ServiceOrgFormValues = z.infer<typeof serviceOrgSchema>
