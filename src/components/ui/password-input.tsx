import { useState } from 'react'
import type { ComponentProps } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { PasswordChecker } from '@/components/ui/password-checker'
import { cn } from '@/lib/utils'

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type'> & {
  /** Adosse le contrôleur de robustesse sous le champ. */
  showChecker?: boolean
  /** Masque la bascule de visibilité si besoin (activée par défaut). */
  showToggle?: boolean
}

/**
 * Champ mot de passe réutilisable : bascule de visibilité, et contrôleur de
 * robustesse optionnel rendu juste en dessous.
 *
 * Compatible `FormControl` : les props injectées (`aria-invalid`,
 * `aria-describedby`, `id`…) sont reversées sur l'`<input>` lui-même, pas sur le
 * conteneur, donc l'accessibilité des messages d'erreur reste intacte.
 */
export function PasswordInput({
  showChecker = false,
  showToggle = true,
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  const value = typeof props.value === 'string' ? props.value : ''

  return (
    <div>
      <div className="relative">
        <Input
          {...props}
          type={visible ? 'text' : 'password'}
          className={cn('h-12', showToggle && 'pr-11', className)}
        />

        {showToggle && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            className="absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>

      {showChecker && <PasswordChecker password={value} />}
    </div>
  )
}
