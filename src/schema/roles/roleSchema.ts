import { z } from 'zod'

export const roleSchema = z.object({
  code: z.string().min(1, 'Le code est requis.'),
  libelle: z.string().min(1, 'Le libellé est requis.'),
  description: z.string().optional(),
})

export type RoleFormValues = z.infer<typeof roleSchema>
