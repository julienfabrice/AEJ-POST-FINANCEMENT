import type { BaseSyntheticEvent } from 'react'
import { useForm } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { loginSchema, type LoginFormValues } from '@/schema/auth.schema'
import { useLogin } from '@/hooks/auth.hooks'
import { ROUTES } from '@/constants/routes'

export function useLoginForm(): {
  form: UseFormReturn<LoginFormValues>
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>
  isSubmitting: boolean
  errorMessage?: string
} {
  const navigate = useNavigate()
  const { redirect } = useSearch({ from: ROUTES.LOGIN })
  const { mutateAsync: login } = useLogin()

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
    try {
      const result = await login({ email: values.email, mot_de_passe: values.password })
       console.log("Resultat de la connexion", result)
      if (result.otpRequired) {
        await navigate({ to: ROUTES.OTP, replace: true })
        return
      }
        
      await navigate({ to: redirect ?? ROUTES.DASHBOARD, replace: true })
    } catch (error){
      // Erreur de formulaire et non de champ : `root` est vidé automatiquement
      // à chaque nouvelle soumission.
    console.log("Erreur", error)
      form.setError('root', { message: 'Identifiants invalides ou service indisponible.' })
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(submit),
    isSubmitting: form.formState.isSubmitting,
    errorMessage: form.formState.errors.root?.message,
  }
}
