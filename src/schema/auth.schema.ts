import * as z from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Adresse e-mail invalide.'),
  password: z.string({error : (iss)=> iss.input === undefined ? "Le mot de passe est requis" : ""}).min(5, 'Mot de passe trop court'),
  remember: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
