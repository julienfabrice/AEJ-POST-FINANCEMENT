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
  telephone: z.string().min(1, 'Le numéro est requis.'),
})

type Values = z.infer<typeof schema>

export function TelephoneForm({
  currentValue,
  onSuccess,
}: {
  currentValue?: string | null
  onSuccess: () => void
}) {
  const { mutateAsync: updateProfile } = useUpdateProfile()

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { telephone: currentValue ?? '' },
  })

  const submit = async (values: Values) => {
    try {
      await updateProfile({ telephone: values.telephone })
      toast.success('Téléphone mis à jour')
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
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de téléphone</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  autoComplete="tel"
                  placeholder="+225 07 00 00 00 00"
                  {...field}
                  className="h-11"
                />
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
