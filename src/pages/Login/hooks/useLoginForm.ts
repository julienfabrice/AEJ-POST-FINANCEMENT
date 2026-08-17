import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormValues } from '@/schema/auth.schema'

export function useLoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
  })

  function onSubmit(values: LoginFormValues) {
    console.log('Connexion...', values)
    // TODO: Appel API réel
  }

  return {
    form,
    onSubmit,
  }
}
