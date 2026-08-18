import { Link } from '@tanstack/react-router'
import { ROUTES } from '@/constants/routes'
import type { PASSWORD_LINK_MODE_T } from '@/types/auth.types'
import { LoginBrand } from '../Login/UI/LoginBrand'
import { ForgotPasswordForm } from './components/ForgotPasswordForm'
import { FORGOT_COPY } from './copy'

/**
 * Écran 1 du parcours mot de passe : demande du lien envoyé par email.
 * `mode` ne pilote que les textes et l'endpoint appelé — la mécanique est
 * identique dans les deux cas.
 */
export function ForgotPasswordPage({ mode }: { mode: PASSWORD_LINK_MODE_T }) {
  const copy = FORGOT_COPY[mode]

  return (
    <div className="fixed inset-0 z-50 grid grid-cols-1 bg-background text-foreground md:grid-cols-2">
      <LoginBrand />

      <div className="flex min-h-screen items-center justify-center bg-card p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">{copy.title}</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">{copy.description}</p>
          </div>

          <ForgotPasswordForm mode={mode} />

          {/* Le retour à la connexion n'a de sens que pour un compte existant :
              en mode `setup`, l'utilisateur n'a pas encore de mot de passe. */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">ou</span>
                </div>
              </div>

              <Link
                to={ROUTES.LOGIN}
                className="flex items-center justify-center rounded-lg border border-border py-2.5 text-sm font-medium transition hover:bg-muted/60"
              >
                Se connecter
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
