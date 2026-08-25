import { z } from 'zod'

export const etapeRoleSchema = z.object({
  etape_code: z.string().min(1, 'Le code de l\'étape est requis.'),
  role_code: z.string().min(1, 'Le code du rôle est requis.'),
  action: z.string().min(1, 'L\'action est requise.')
})

export type EtapeRoleFormValues = z.infer<typeof etapeRoleSchema>
