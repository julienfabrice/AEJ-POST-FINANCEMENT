import { useForm } from 'react-hook-form'
import type { UseFormReturn, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormValues } from '@/schema/auth.schema'

export function useLoginForm(): {
  form: UseFormReturn<LoginFormValues>
  onSubmit: SubmitHandler<LoginFormValues>
} {
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
  })

  function onSubmit(values: LoginFormValues) {
    console.log('====================================');
    console.log('Values : ', values);
    console.log('====================================');
  }

  return {
    form,
    onSubmit,
  }
}
