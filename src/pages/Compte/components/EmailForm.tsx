import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useUpdateProfile } from '@/hooks/profile.hooks'

const schema = z.object({
  email: z.email('Adresse e-mail invalide.'),
})

type Values = z.infer<typeof schema>

export function EmailForm({
  currentValue,
  onSuccess,
}: {
  currentValue?: string | null
  onSuccess: () => void
}) {
  const { mutateAsync: updateProfile } = useUpdateProfile()

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: currentValue ?? '' },
  })

  const submit = async (values: Values) => {
    try {
      await updateProfile({ email: values.email })
      toast.success('Adresse e-mail mise à jour')
      onSuccess()
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined

      // 409/422 = adresse déjà utilisée par un autre compte : l'erreur appartient
      // au champ, pas au formulaire.
      if (status === 409 || status === 422) {
        form.setError('email', { message: 'Cette adresse est déjà utilisée.' })
        return
      }

      form.setError('root', { message: 'Impossible d’enregistrer. Réessayez.' })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6 text-left">
        {form.formState.errors.root && (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          >
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse e-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="prenom.nom@aej.ci"
                  {...field}
                  className="h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* L'email est l'identifiant de connexion ET le canal du code OTP :
            mieux vaut le dire avant que l'utilisateur ne se verrouille dehors. */}
        <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          Cette adresse sert à vous connecter et à recevoir vos codes de vérification.
          Assurez-vous d’y avoir accès avant de l’enregistrer.
        </p>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full cursor-pointer"
        >
          {form.formState.isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </form>
    </Form>
  )
}
