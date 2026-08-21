import { z } from 'zod'

export const etapeDeliverableSchema = z.object({
  etape_code: z.string().min(1, 'Le code de l\'étape est requis.'),
  deliverable_code: z.string().min(1, 'Le code du livrable est requis.'),
  is_required: z.boolean()
})

export type EtapeDeliverableFormValues = z.infer<typeof etapeDeliverableSchema>
