import * as z from 'zod'

export const etapeSchema = z.object({
  code: z.string().min(1, 'Le code est requis.'),
  name: z.string().min(1, 'Le nom est requis.'),
  order: z.number().min(1, "L'ordre est requis."),
  description: z.string().optional()
})

export type EtapeFormValues = z.infer<typeof etapeSchema>
