import { z } from 'zod'

export const validerSchema = z.object({
  observation: z.string().optional(),
})

export type ValiderFormValues = z.infer<typeof validerSchema>
