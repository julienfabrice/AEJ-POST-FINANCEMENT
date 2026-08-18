import { KeyRound } from 'lucide-react'
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
import { LoginBrand } from '../Login/UI/LoginBrand'
import { useSetPasswordForm } from './hooks/useSetPasswordForm'
import { InvalidLink } from './components/InvalidLink'

interface SetPasswordPageProps {
  uid?: string
  token?: string
}

/**
 * Écran 2 du parcours mot de passe — atteint UNIQUEMENT par le lien reçu par
 * email (`/set-password/{uid}/{token}`), quel que soit le mode d'origine
 * (`forgot` ou `setup`) : les deux parcours convergent ici.
 */
export function SetPasswordPage({ uid, token }: SetPasswordPageProps) {
  return (
    <div className="fixed inset-0 z-50 grid grid-cols-1 bg-background text-foreground md:grid-cols-2">
      <LoginBrand />
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
          {!uid || !token ? <InvalidLink /> : <SetPasswordForm uid={uid} token={token} />}
        </div>
      </div>
    </div>
  )
}

function SetPasswordForm({ uid, token }: { uid: string; token: string }) {
  const { form, onSubmit, isSubmitting, errorMessage } = useSetPasswordForm(uid, token)

  return (
    <>
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#E7722B]/10">
          <KeyRound className="size-6 text-[#E7722B]" />
        </div>
        <h1 className="mb-2 text-2xl font-extrabold">Choisissez votre mot de passe</h1>
        <p className="text-sm text-muted-foreground">
          Il vous servira à vous connecter à la plateforme. Choisissez-le robuste.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          {errorMessage && (
            <div
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
            >
              {errorMessage}
            </div>
          )}

          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nouveau mot de passe</FormLabel>
                <FormControl>
                  <PasswordInput
                    showChecker
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmez le mot de passe</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full cursor-pointer bg-[#E7722B] text-base font-semibold text-white hover:bg-[#C85E18]"
          >
            {isSubmitting ? 'Enregistrement…' : 'Enregistrer le mot de passe'}
          </Button>
        </form>
      </Form>
    </>
  )
}
