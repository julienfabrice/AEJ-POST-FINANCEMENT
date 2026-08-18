import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Checkbox } from '@/components/ui/checkbox'
import { useLoginForm } from '../hooks/useLoginForm'

export function LoginForm() {
  const { form, onSubmit, isSubmitting, errorMessage } = useLoginForm()

  return (
    <div className="flex items-center justify-center p-8 bg-card">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold">Connexion</h2>
          <p className="text-muted-foreground mt-2">Veuillez vous authentifier pour accéder à la plateforme.</p>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identifiant</FormLabel>
                  <FormControl>
                    <Input placeholder="prenom.nom@aej.ci" {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between mt-2">
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      Rester connecté
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                search={{ mode: 'forgot' as const }}
                className="text-sm font-medium text-[#E7722B] hover:text-[#C85E18]"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-semibold bg-[#E7722B] hover:bg-[#C85E18] text-white cursor-pointer"
            >
              {isSubmitting ? 'Connexion…' : 'Se connecter'}
            </Button>
          </form>
        </Form>

        {/* Première connexion : même écran que « mot de passe oublié », en mode
            `setup` — l'utilisateur reçoit un lien d'activation par email. */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Première connexion ?{' '}
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            search={{ mode: 'setup' as const }}
            className="font-medium text-[#E7722B] hover:text-[#C85E18]"
          >
            Définissez votre mot de passe
          </Link>
        </p>

        <p className="text-xs text-center text-muted-foreground mt-8">
          Prototype de démonstration · données fictives
        </p>
      </div>
    </div>
  )
}
