import { useMemo } from 'react'
import * as z from 'zod'
import { PASSWORD_RULES } from '@/constants/security'

/** Écran 1 — demande du lien : un seul champ email. */
export const useForgotPasswordSchema = () =>
  useMemo(
    () =>
      z.object({
        email: z.email('Adresse e-mail invalide.'),
      }),
    [],
  )

export type ForgotPasswordFormValues = z.infer<ReturnType<typeof useForgotPasswordSchema>>

/**
 * Écran 2 — définition du mot de passe. `uid` et `token` ne sont pas validés
 * ici : ils viennent des paramètres d'URL, pas d'une saisie utilisateur, et
 * leur absence est traitée en amont par l'écran « Lien invalide ».
 */
export const useSetPasswordSchema = () =>
  useMemo(
    () =>
      z
        .object({
          // Les règles sont dérivées de `PASSWORD_RULES` : ce que le contrôleur
          // visuel affiche est exactement ce qui est validé ici.
          new_password: z.string().superRefine((value, ctx) => {
            PASSWORD_RULES.forEach((rule) => {
              if (!rule.test(value)) {
                ctx.addIssue({ code: 'custom', message: rule.message })
              }
            })
          }),
          confirm_new_password: z.string().min(1, 'La confirmation est requise.'),
        })
        .refine((values) => values.new_password === values.confirm_new_password, {
          message: 'Les mots de passe ne correspondent pas.',
          path: ['confirm_new_password'],
        }),
    [],
  )

export type SetPasswordFormValues = z.infer<ReturnType<typeof useSetPasswordSchema>>
