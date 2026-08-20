import * as z from 'zod'

export const createVersionSchema = z.object({
  name: z.string().min(1, 'Le nom est requis.'),
  version: z.string().min(1, 'Le numéro de version est requis.')
})

export type CreateVersionFormValues = z.infer<typeof createVersionSchema>

export const updateVersionSchema = z.object({
  name: z.string().min(1, 'Le nom est requis.'),
  version: z.string().min(1, 'Le numéro de version est requis.'),
  description: z.string().optional()
})

export type UpdateVersionFormValues = z.infer<typeof updateVersionSchema>

export const etapeSchema = z.object({
  code: z.string().min(1, 'Le code est requis.'),
  name: z.string().min(1, 'Le nom est requis.'),
  order: z.number().min(1, "L'ordre est requis."),
  description: z.string().optional()
})

export type EtapeFormValues = z.infer<typeof etapeSchema>
