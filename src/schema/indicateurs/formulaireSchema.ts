import { z } from 'zod'
import {questionSchema} from "@/schema/indicateurs/questionSchema.ts";

export const formulaireSchema = z.object({
    code: z.string().min(1),
    libelle: z.string(),
    public_cible: z.string(),
    actif: z.boolean(),
    questions:  z.array(questionSchema).min(1, "Sélectionnez au moins une question")
})

export type FormulaireFormValues = z.infer<typeof formulaireSchema>