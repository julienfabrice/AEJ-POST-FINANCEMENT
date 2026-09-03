import { z } from 'zod'

export const questionSchema = z.object(
    {
        code: z.string(),
        libelle: z.string(),
        type_question: z.string(),
        options: z.string().array(),
        ordre: z.number(),
        affichage: z.boolean(),
        obligatoire: z.boolean()
    })

export type QuestionFormValues = z.infer<typeof questionSchema>