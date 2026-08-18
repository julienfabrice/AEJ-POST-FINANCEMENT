import { Mail, MessageSquare } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OTP_METHOD_T } from '@/types/auth.types'

const METHODS: { key: OTP_METHOD_T; label: string; hint: string; icon: LucideIcon }[] = [
  { key: 'email', label: 'Email', hint: 'Recevoir le code par email', icon: Mail },
  { key: 'sms', label: 'SMS', hint: 'Recevoir le code par SMS', icon: MessageSquare },
]

interface MethodPickerProps {
  value?: OTP_METHOD_T
  onSelect: (method: OTP_METHOD_T) => void
  disabled?: boolean
}

/** Choix du canal — chaque clic déclenche un envoi. */
export function MethodPicker({ value, onSelect, disabled }: MethodPickerProps) {
  return (
    <div role="radiogroup" aria-label="Canal de réception du code" className="grid grid-cols-2 gap-3">
      {METHODS.map(({ key, label, hint, icon: Icon }) => {
        const selected = value === key
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={hint}
            disabled={disabled}
            onClick={() => onSelect(key)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-lg border px-4 py-3 transition-colors',
              'disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer',
              selected
                ? 'border-[#E7722B] bg-[#E7722B]/10 text-[#E7722B]'
                : 'border-border text-muted-foreground hover:border-[#E7722B]/50 hover:text-foreground',
            )}
          >
            <Icon className="size-5" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
