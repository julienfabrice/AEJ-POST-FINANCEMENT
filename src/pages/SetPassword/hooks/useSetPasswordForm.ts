import type { BaseSyntheticEvent } from 'react'
import { useForm } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ROUTES } from '@/constants/routes'
import { useResetPasswordMutation } from '@/hooks/auth.hooks'
import { useSetPasswordSchema, type SetPasswordFormValues } from '@/schema/password.schema'
import type { PASSWORD_LINK_MODE_T } from '@/types/auth.types'
import { SET_PASSWORD_COPY } from '../copy'

export function useSetPasswordForm(
  token: string,
  mode: PASSWORD_LINK_MODE_T,
): {
  form: UseFormReturn<SetPasswordFormValues>
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>
  isSubmitting: boolean
  errorMessage?: string
} {
  const navigate = useNavigate()
  const schema = useSetPasswordSchema()
  // Le `mode` sélectionne l'endpoint : `/password/set` ou `/password/reset`.
  const { mutateAsync: submitPassword } = useResetPasswordMutation(mode)

  const form = useForm<SetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { new_password: '', confirm_new_password: '' },
  })

  const submit = async (values: SetPasswordFormValues) => {
    try {
      // Le backend n'attend qu'un `password` : la confirmation ne sert qu'à la
      // validation côté client. Le `token`, lui, vient de l'URL — c'est lui qui
      // identifie l'utilisateur à la place d'une session.
      await submitPassword({ password: values.new_password, token })
      toast.success(SET_PASSWORD_COPY[mode].toast)
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
