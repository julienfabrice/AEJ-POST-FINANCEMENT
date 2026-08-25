import type { BaseSyntheticEvent } from 'react'
import { useForm } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { loginSchema, type LoginFormValues } from '@/schema/auth.schema'
import { useLogin } from '@/hooks/auth.hooks'
import { useCountdown } from '@/hooks/useCountdown'
import { ROUTES } from '@/constants/routes'
import { formatCountdown } from '@/constants/security'
import { describeLoginFailure, parseLoginFailure } from '@/lib/loginError'
import { resolveHome } from '@/lib/resolveHome'
import { useAuthStore } from '@/store/useAuthStore'

export function useLoginForm(): {
  form: UseFormReturn<LoginFormValues>
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>
  isSubmitting: boolean
  errorMessage?: string
  /** Compte bloqué : la soumission doit rester fermée jusqu'à expiration. */
  isLocked: boolean
  /** Temps restant avant déblocage, prêt à afficher (« 26:25 »). */
  lockRemainingLabel: string
} {
  const navigate = useNavigate()
  const { redirect } = useSearch({ from: ROUTES.LOGIN })
  const { mutateAsync: login } = useLogin()

  // Le blocage vient du serveur (`retry_after`) ; ce compte à rebours n'est
  // qu'un miroir local, il n'autorise rien de lui-même.
  const lock = useCountdown()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
  })

  /**
   * `useLogin` porte tout le flow cookie et renvoie le résultat normalisé ;
   * il ne reste ici que la redirection  en fonction de la reponse :
   *  - OTP requis → écran de vérification (aucune session ouverte) ;
   *  - sinon      → la cible demandée, ou le tableau de bord.
   */
  const submit = async (values: LoginFormValues) => {
    // Rien à tenter tant que le compte est bloqué : on éviterait juste de
    // consommer une tentative pour rien.
    if (lock.isRunning) return

    try {
      const result = await login({ email: values.email, mot_de_passe: values.password })

      if (result.otpRequired) {
        await navigate({ to: ROUTES.OTP, replace: true })
        return
      }

      // Le rôle ne choisit QUE l'atterrissage — jamais les droits.
      const home = resolveHome(useAuthStore.getState().user)
      await navigate({ to: redirect ?? home, replace: true })
    } catch (error) {
      const failure = parseLoginFailure(error)

      // 423 la soumission reste fermée jusqu'au
      // bout. Sans `retry_after`, on affiche le message sans verrouiller —
      // mieux vaut laisser réessayer que bloquer indéfiniment.
      if (failure.kind === 'locked' && failure.retryAfterSeconds) {
        lock.start(failure.retryAfterSeconds)
      }

      // Erreur de formulaire et non de champ : `root` est vidé automatiquement
      // à chaque nouvelle soumission.
      form.setError('root', { message: describeLoginFailure(failure) })
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(submit),
    isSubmitting: form.formState.isSubmitting,
    errorMessage: form.formState.errors.root?.message,
    isLocked: lock.isRunning,
    lockRemainingLabel: formatCountdown(lock.seconds),
  }
}
