import { Check, Dot } from 'lucide-react'
import { PASSWORD_RULES } from '@/constants/security'
import { cn } from '@/lib/utils'

interface PasswordCheckerProps {
  password?: string | null
  className?: string
}

/**
 * Contrôleur de robustesse — barre de progression + liste des règles.
 * Les règles viennent de `PASSWORD_RULES`, la même liste qui alimente le schéma
 * Zod : ce qui est affiché ici est exactement ce qui est validé.
 */
export function PasswordChecker({ password, className }: PasswordCheckerProps) {
  const value = password ?? ''
  const isEmpty = value.length === 0

  const validCount = PASSWORD_RULES.filter((rule) => rule.test(value)).length
  const progress = (validCount / PASSWORD_RULES.length) * 100

  const strengthLabel = isEmpty
    ? 'Entrez un mot de passe'
    : progress === 100
      ? 'Mot de passe fort'
      : progress >= 60
        ? 'Mot de passe moyen'
        : 'Mot de passe faible'

  const strengthTone = isEmpty
    ? 'text-muted-foreground'
    : progress === 100
      ? 'text-emerald-600 dark:text-emerald-400'
      : progress >= 60
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-red-600 dark:text-red-400'

  const barTone = isEmpty
    ? 'bg-muted-foreground/20'
    : progress === 100
      ? 'bg-emerald-500'
      : progress >= 60
        ? 'bg-amber-500'
        : 'bg-red-500'

  return (
    <section
      className={cn(
        'mt-3 flex flex-col space-y-3 rounded-lg border bg-muted/10 p-4 dark:bg-primary/5',
        className,
      )}
    >
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className={cn('text-sm font-medium transition-colors', strengthTone)}>
            {strengthLabel}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {validCount}/{PASSWORD_RULES.length}
          </span>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn('h-full rounded-full transition-all duration-500', barTone)}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1.5 pt-1 sm:grid-cols-2">
        {PASSWORD_RULES.map((rule) => {
          const isValid = !isEmpty && rule.test(value)

          return (
            <div
              key={rule.key}
              className={cn(
                'flex items-center gap-2 text-xs transition-colors duration-200',
                isValid
                  ? 'font-medium text-emerald-600 dark:text-emerald-400'
                  : 'text-muted-foreground/60',
              )}
            >
              <span className="flex-shrink-0">
                {isValid ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Dot className="h-3.5 w-3.5 text-muted-foreground/40" />
                )}
              </span>
              <span>{rule.label}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
