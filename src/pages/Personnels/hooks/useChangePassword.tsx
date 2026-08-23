import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { personnelsServices } from '@/services/personnels.services'
import { PASSWORD_RULES } from '@/constants/security'

export const changePasswordSchema = z.object({
  mot_de_passe: z.string().superRefine((value, ctx) => {
    PASSWORD_RULES.forEach((rule) => {
      if (!rule.test(value)) {
        ctx.addIssue({ code: 'custom', message: rule.message })
      }
    })
  }),
  confirm_mot_de_passe: z.string().min(1, 'La confirmation est requise.'),
}).refine((values) => values.mot_de_passe === values.confirm_mot_de_passe, {
  message: 'Les mots de passe ne correspondent pas.',
  path: ['confirm_mot_de_passe'],
})

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

export function useChangePassword(open: boolean, onOpenChange: (open: boolean) => void, userData: any) {
  const { mutate: setupPassword, isPending } = personnelsServices.useSetupPassword()
  
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { mot_de_passe: '', confirm_mot_de_passe: '' },
  })

  // Réinitialiser quand le modal s'ouvre
  useEffect(() => {
    if (open) form.reset()
  }, [open, form])

  const onSubmit = (values: ChangePasswordFormValues) => {
    if (!userData) return
    
    // Appel de l'endpoint api/password/setup
    setupPassword(
      { token: String(userData.id), password: values.mot_de_passe },
      {
        onSuccess: () => {
          toast.success('Mot de passe mis à jour avec succès.')
          onOpenChange(false)
          form.reset()
        },
        onError: (err) => {
          console.error(err)
          toast.error('Erreur lors du changement de mot de passe.')
        }
      }
    )
  }

  return { form, onSubmit, isPending }
}
