import { useEffect, useState } from 'react'
import type { BaseSyntheticEvent } from 'react'
import { useForm } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useResetLinkMutation } from '@/hooks/auth.hooks'
import { RESET_LINK_CONFIG } from '@/constants/security'
import {
  useForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/schema/password.schema'
import type { PASSWORD_LINK_MODE_T } from '@/types/auth.types'
import { FORGOT_COPY } from '../copy'

export function useForgotPasswordForm(mode: PASSWORD_LINK_MODE_T): {
  form: UseFormReturn<ForgotPasswordFormValues>
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>
  isSubmitting: boolean
  errorMessage?: string
  /** Email auquel le lien a été envoyé — bascule l'écran en confirmation. */
  sentTo?: string
  onResend: () => void
  resendIn: number
  canResend: boolean
} {
  const schema = useForgotPasswordSchema()
  const { mutateAsync: requestLink, isPending } = useResetLinkMutation(mode)

  
  const [sentTo, setSentTo] = useState<string>()
  const [resendIn, setResendIn] = useState(0)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  useEffect(() => {
    if (resendIn <= 0) return
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendIn])

  const send = async (email: string) => {
    await requestLink(email)
    setSentTo(email)
    setResendIn(RESET_LINK_CONFIG.resendCooldownSeconds)
    toast.success(FORGOT_COPY[mode].toast)
  }

  const submit = async (values: ForgotPasswordFormValues) => {
    try {
      await send(values.email)
    } catch {
      form.setError('root', {
        message: "Impossible d'envoyer le lien. Vérifiez l'adresse et réessayez.",
      })
    }
  }

  const onResend = () => {
    if (!sentTo || resendIn > 0 || isPending) return
    void send(sentTo).catch(() => toast.error("Impossible de renvoyer le lien. Réessayez."))
  }

  return {
    form,
    onSubmit: form.handleSubmit(submit),
    isSubmitting: form.formState.isSubmitting || isPending,
    errorMessage: form.formState.errors.root?.message,
    sentTo,
    onResend,
    resendIn,
    canResend: resendIn === 0 && !isPending,
  }
}
