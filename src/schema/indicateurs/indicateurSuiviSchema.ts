import { z } from 'zod'

export const indicateurSuiviSchema = z.object({
    indicateur_id: z.number(),
    valeur: z.string(),

})

export type IndicateurSuiviValues = z.infer<typeof indicateurSuiviSchema>