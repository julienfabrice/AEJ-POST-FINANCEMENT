import type { BaseSyntheticEvent } from 'react'
import { useForm } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ROUTES } from '@/constants/routes'
import { useResetPasswordMutation } from '@/hooks/auth.hooks'
import { useSetPasswordSchema, type SetPasswordFormValues } from '@/schema/password.schema'

export function useSetPasswordForm(
  uid: string,
  token: string,
): {
  form: UseFormReturn<SetPasswordFormValues>
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>
  isSubmitting: boolean
  errorMessage?: string
} {
  const navigate = useNavigate()
  const schema = useSetPasswordSchema()
  const { mutateAsync: setPassword } = useResetPasswordMutation()

  const form = useForm<SetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { new_password: '', confirm_new_password: '' },
  })

  const submit = async (values: SetPasswordFormValues) => {
    try {
      // `uid` / `token` viennent de l'URL, pas du formulaire : ils identifient
      // l'utilisateur à la place d'une session.
      await setPassword({ ...values, uid, token })
      toast.success('Mot de passe réinitialisé avec succès')
      await navigate({ to: ROUTES.LOGIN, replace: true })
    } catch {
      form.setError('root', {
        message:
          'Impossible d’enregistrer le mot de passe. Le lien a peut-être expiré — demandez-en un nouveau.',
      })
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(submit),
    isSubmitting: form.formState.isSubmitting,
    errorMessage: form.formState.errors.root?.message,
  }
}
