import { Mail, MessageCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OTP_METHOD_T } from '@/types/auth.types'

const METHODS: { key: OTP_METHOD_T; label: string; hint: string; icon: LucideIcon }[] = [
  { key: 'MAIL', label: 'Email', hint: 'Recevoir le code par email', icon: Mail },
  { key: 'WHATSAPP', label: 'WhatsApp', hint: 'Recevoir le code par WhatsApp', icon: MessageCircle },
]

interface MethodPickerProps {
  value?: OTP_METHOD_T
  onSelect: (method: OTP_METHOD_T) => void
  disabled?: boolean
  /**
   * `has_phone` de la réponse de login. Faux ⇒ le compte n'a pas de numéro
   * exploitable : WhatsApp reste visible mais inactif, pour que l'utilisateur
   * comprenne pourquoi le canal ne lui est pas offert.
   */
  hasPhone?: boolean
}

export function MethodPicker({ value, onSelect, disabled, hasPhone }: MethodPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Canal de réception du code"
      className="grid grid-cols-2 gap-3"
    >
      {METHODS.map(({ key, label, hint, icon: Icon }) => {
        const selected = value === key
        const unavailable = key === 'WHATSAPP' && !hasPhone
        const isDisabled = disabled || unavailable

        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={unavailable ? 'WhatsApp indisponible : aucun numéro enregistré' : hint}
            title={unavailable ? 'Aucun numéro enregistré sur ce compte' : undefined}
            disabled={isDisabled}
            onClick={() => onSelect(key)}
            className={cn(
              'flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border px-4 py-3 transition-colors',
              'disabled:cursor-not-allowed disabled:opacity-60',
              selected
                ? 'border-[#E7722B] bg-[#E7722B]/10 text-[#E7722B]'
                : 'border-border text-muted-foreground hover:border-[#E7722B]/50 hover:text-foreground',
            )}
          >
            <Icon className="size-5" />
            <span className="text-sm font-medium">{label}</span>
            {unavailable && (
              <span className="text-[10px] leading-tight">Aucun numéro</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
