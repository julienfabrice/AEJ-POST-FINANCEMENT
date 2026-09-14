import { z } from 'zod'

export const formulaireSchema = z.object({
    code: z.string().min(1),
    libelle: z.string(),
    public_cible: z.string(),
    actif: z.boolean()
})

export type FormulaireFormValues = z.infer<typeof formulaireSchema>