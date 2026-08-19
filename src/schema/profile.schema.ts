import * as z from 'zod'

export const updateProfileSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis.'),
  prenom: z.string().min(1, 'Le prénom est requis.'),
  email: z.email('Adresse e-mail invalide.'),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
})

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>

/**
 * Changement de mot de passe authentifié. Le schéma est prêt ; l'endpoint reste
 * à confirmer avant câblage (cf. leftover #14).
 */
export const changePasswordSchema = z
  .object({
    mot_de_passe_actuel: z.string().min(1, 'Mot de passe actuel requis.'),
    mot_de_passe: z.string().min(8, 'Au moins 8 caractères.'),
    mot_de_passe_confirmation: z.string(),
  })
  .refine((v) => v.mot_de_passe === v.mot_de_passe_confirmation, {
    path: ['mot_de_passe_confirmation'],
    message: 'Les mots de passe ne correspondent pas.',
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
