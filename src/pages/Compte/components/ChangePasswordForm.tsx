import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { changePasswordSchema, type ChangePasswordFormValues } from '@/schema/profile.schema'

/**
 * Changement de mot de passe authentifié (ancien → nouveau).
 *
 * ⚠️ FORMULAIRE NON CÂBLÉ : l'endpoint n'est pas confirmé (cf. leftover #14).
 * La validation et le contrôleur de robustesse sont opérationnels ; seul
 * l'appel manque. NE PAS réutiliser `/password/setup` ni `/password/reset` :
 * ceux-là relèvent du parcours par lien email, non authentifié.
 */
export function ChangePasswordForm() {
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      mot_de_passe_actuel: '',
      mot_de_passe: '',
      mot_de_passe_confirmation: '',
    },
  })

  return (
    <Form {...form}>
      <form className="space-y-6 text-left" onSubmit={(e) => e.preventDefault()}>
        <div
          role="status"
          className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400"
        >
          Fonctionnalité en attente : l’endpoint de changement de mot de passe n’est pas
          encore disponible.
        </div>

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

        <Button type="submit" disabled className="w-full">
          Enregistrer
        </Button>
      </form>
    </Form>
  )
}
