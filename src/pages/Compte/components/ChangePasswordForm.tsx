import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { PasswordInput } from '@/components/ui/password-input'
import { useChangePassword } from '@/hooks/profile.hooks'
import { changePasswordSchema, type ChangePasswordFormValues } from '@/schema/profile.schema'

/**
 * Changement de mot de passe authentifié (ancien → nouveau).
 *
 * ⚠️ Le chemin de l'endpoint est PROVISOIRE (`profileServices.changePassword`),
 * de même que les noms de champs de `CHANGE_PASSWORD_T` : à réaligner dès que
 * le backend expose le contrat définitif.
 */
export function ChangePasswordForm({ onSuccess }: { onSuccess: () => void }) {
  const { mutateAsync: changePassword } = useChangePassword()

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      mot_de_passe_actuel: '',
      mot_de_passe: '',
      mot_de_passe_confirmation: '',
    },
  })

  const submit = async (values: ChangePasswordFormValues) => {
    try {
      await changePassword(values)
      toast.success('Mot de passe modifié')
      onSuccess()
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined

      // 401/422 sur cet appel = mot de passe actuel refusé. On place l'erreur
      // sur le champ concerné plutôt qu'en bandeau : c'est là que l'utilisateur
      // doit corriger.
      if (status === 401 || status === 422) {
        form.setError('mot_de_passe_actuel', {
          message: 'Mot de passe actuel incorrect.',
        })
        return
      }

      form.setError('root', {
        message: 'Impossible de modifier le mot de passe. Réessayez.',
      })
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
          name="mot_de_passe_actuel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe actuel</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mot_de_passe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormControl>
                <PasswordInput showChecker autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mot_de_passe_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmez le nouveau mot de passe</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="new-password" {...field} />
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
