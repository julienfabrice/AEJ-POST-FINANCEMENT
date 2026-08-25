import { useState } from 'react'
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
import {
  describeLoginFailure,
  parseLoginFailure,
  type LOGIN_ALERT_T,
  type LOGIN_FAILURE_T,
} from '@/lib/loginError'
import { resolveHome } from '@/lib/resolveHome'
import { useAuthStore } from '@/store/useAuthStore'

export function useLoginForm(): {
  form: UseFormReturn<LoginFormValues>
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>
  isSubmitting: boolean
  /** Alerte prête à afficher (titre, description, icône, ton) — sinon `undefined`. */
  alert?: LOGIN_ALERT_T
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

  /**
   * L'échec est conservé STRUCTURÉ, pas aplati en chaîne : `setError('root')`
   * ne transporte qu'un message, alors que l'alerte a besoin du titre, de
   * l'icône et du ton — et doit se recomposer à chaque seconde du décompte.
   */
  const [failure, setFailure] = useState<LOGIN_FAILURE_T | null>(null)

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

    // L'alerte n'est plus portée par `setError('root')` : à nous de la vider
    // au début de chaque tentative.
    setFailure(null)

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
      const parsed = parseLoginFailure(error)

      // 423 : la soumission reste fermée jusqu'au bout. Sans `retry_after`, on
      // affiche le message sans verrouiller — mieux vaut laisser réessayer que
      // bloquer indéfiniment.
      if (parsed.kind === 'locked' && parsed.retryAfterSeconds) {
        lock.start(parsed.retryAfterSeconds)
      }

      setFailure(parsed)
    }
  }

  const lockRemainingLabel = formatCountdown(lock.seconds)

  return {
    form,
    onSubmit: form.handleSubmit(submit),
    isSubmitting: form.formState.isSubmitting,
    // Recomposée à chaque rendu : le décompte de blocage change chaque seconde.
    alert: failure
      ? describeLoginFailure(failure, lock.isRunning ? lockRemainingLabel : undefined)
      : undefined,
    isLocked: lock.isRunning,
    lockRemainingLabel,
  }
}
