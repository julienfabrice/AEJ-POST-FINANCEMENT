import { z } from 'zod'

export const questionSchema = z.object(
    {
        formulaire_id: z.number(),
        code: z.string(),
        libelle: z.string(),
        type_question: z.string(),
        ordre: z.number(),
        affichage: z.boolean(),
        obligatoire: z.boolean(),
        options: z.array(z.string()).nullable().optional()
    })

export type QuestionFormValues = z.infer<typeof questionSchema>