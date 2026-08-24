import { z } from 'zod'

export const directionSchema = z.object({
  code: z.string().min(1, 'Le code est requis.'),
  nom: z.string().min(1, 'Le nom est requis.'),
  description: z.string().optional(),
})

export type DirectionFormValues = z.infer<typeof directionSchema>
