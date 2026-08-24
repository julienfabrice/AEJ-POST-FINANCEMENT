import { z } from 'zod'

export const personnelSchema = z.object({
  nom: z.string().min(1, 'Le nom est obligatoire.'),
  prenom: z.string().min(1, 'Le prénom est obligatoire.'),
  email: z.string().email('Format email invalide.').min(1, "L'email est obligatoire."),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
  mot_de_passe: z.string().optional(),
  role_id: z.string().min(1, 'Le rôle est obligatoire.'),
  fonction_id: z.string().min(1, 'La fonction est obligatoire.'),
})

export type PersonnelFormValues = z.infer<typeof personnelSchema>
