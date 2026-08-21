import * as z from 'zod'

export const etapeSlaSchema = z.object({
  etape_code: z.string().min(1, 'Le code de l\'étape est requis.'),
  duration_value: z.number().min(1, 'La valeur de durée est requise.'),
  duration_unit: z.string().min(1, 'L\'unité de durée est requise.'),
  delay_type: z.string().min(1, 'Le type de délai est requis.'),
  description: z.string().min(1, 'La description est requise.')
})

export type EtapeSlaFormValues = z.infer<typeof etapeSlaSchema>
