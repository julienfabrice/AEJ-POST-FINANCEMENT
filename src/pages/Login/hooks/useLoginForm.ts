import { useForm } from 'react-hook-form'
import type { UseFormReturn, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'
import { loginSchema, type LoginFormValues } from '@/schema/auth.schema'
import { useAuthStore } from '@/store/useAuthStore'

export function useLoginForm(): {
  form: UseFormReturn<LoginFormValues>
  onSubmit: SubmitHandler<LoginFormValues>
} {
  const router = useRouter()
  const setSession = useAuthStore((s) => s.setSession)
  
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
    
    // Simulate login for demonstration
    if (values.email.toLowerCase().includes('benef')) {
      // Login as Beneficiary
      setSession({
        id: 999,
        nom: 'Kouassi',
        prenoms: 'Marc',
        email: values.email,
        roleId: 0,
        roleCode: 'BENEF',
        roleLibelle: 'Bénéficiaire',
        kind: 'benef'
      }, 'demo-token-benef')
      
      router.navigate({ to: '/benef-dashboard' })
    } else {
      // Login as Agent
      setSession({
        id: 1,
        nom: 'Agent',
        prenoms: 'Demo',
        email: values.email || 'admin@aej.ci',
        roleId: 1,
        roleCode: 'ADMIN',
        roleLibelle: 'Administrateur',
        kind: 'agent'
      }, 'demo-token-agent')
      
      router.navigate({ to: '/dashboard' })
    }
  }

  return {
    form,
    onSubmit,
  }
}
