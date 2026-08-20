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
  prenom: z.string().min(1, 'Le prénom est requis.'),
  nom: z.string().min(1, 'Le nom est requis.'),
})

type Values = z.infer<typeof schema>

/** Prénom + nom : une seule carte « Nom complet », donc un seul formulaire. */
export function IdentiteForm({
  currentPrenom,
  currentNom,
  onSuccess,
}: {
  currentPrenom?: string | null
  currentNom?: string | null
  onSuccess: () => void
}) {
  const { mutateAsync: updateProfile } = useUpdateProfile()

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { prenom: currentPrenom ?? '', nom: currentNom ?? '' },
  })

  const submit = async (values: Values) => {
    try {
      await updateProfile(values)
      toast.success('Nom mis à jour')
      onSuccess()
    } catch {
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
          name="prenom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input autoComplete="given-name" {...field} className="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input autoComplete="family-name" {...field} className="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
