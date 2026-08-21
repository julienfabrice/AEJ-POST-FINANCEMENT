import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { personnelsServices } from '@/services/personnels.services'

export const changePasswordSchema = z.object({
  mot_de_passe: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),
})

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

export function useChangePassword(open: boolean, onOpenChange: (open: boolean) => void, userData: any) {
  const { mutate: setupPassword, isPending } = personnelsServices.useSetupPassword()
  
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { mot_de_passe: '' },
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
