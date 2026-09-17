import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LOGIN_ALERT_TONE_T } from '@/lib/loginError'
import { IMAGES } from '@/constants/images'
import { ROUTES } from '@/constants/routes'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Checkbox } from '@/components/ui/checkbox'
import { useLoginForm } from '../hooks/useLoginForm'

/**
 * `Alert` n'a que deux variantes ; le ton « warning » se compose ici, au plus
 * près du style. `lib/loginError` reste agnostique de la présentation.
 */
const TONE_CLASSES: Record<LOGIN_ALERT_TONE_T, string> = {
  warning:
    'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50',
  destructive:
    'border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/40',
}

export function LoginForm() {
  const { form, onSubmit, isSubmitting, alert, isLocked, lockRemainingLabel } = useLoginForm()
  const AlertIcon = alert?.icon

  return (
    <div className="flex items-center justify-center p-8 bg-card">
      <div className="w-full max-w-md">
        {/* Logo de repli : `LoginBrand` */}
        <div className="mb-8 flex justify-center md:hidden">
          <img
            src={IMAGES.logo}
            alt="Agence Emploi Jeunes"
            className="h-16 w-auto object-contain"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-extrabold">Connexion</h2>
          <p className="text-muted-foreground mt-2">Veuillez vous authentifier pour accéder à la plateforme.</p>
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">

            {alert && AlertIcon && (
              <Alert className={cn('max-w-md', TONE_CLASSES[alert.tone])}>
                <AlertIcon />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription className="text-current/90">
                  {alert.description}
                </AlertDescription>
              </Alert>
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
                className="text-sm font-medium text-[#E7722B] hover:text-[#C85E18]"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isLocked}
              className="w-full h-12 text-base font-semibold bg-[#E7722B] hover:bg-[#C85E18] text-white cursor-pointer disabled:cursor-not-allowed"
            >
              {isLocked
                ? `Réessayez dans ${lockRemainingLabel}`
                : isSubmitting
                  ? 'Connexion…'
                  : 'Se connecter'}
            </Button>
          </form>
        </Form>

        {/* Pas de lien « première connexion » : le lien d'activation est envoyé
            par le backend à la création du compte, il ne se demande pas ici. */}
        {/* <p className="text-xs text-center text-muted-foreground mt-8">
          Prototype de démonstration · données fictives
        </p> */}
      </div>
    </div>
  )
}




