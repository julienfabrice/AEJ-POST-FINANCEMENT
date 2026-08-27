import { cn } from '@/lib/utils'

const BADGE_CLASSES: Record<string, string> = {
  gr: 'bg-[#E3F6E7] text-[#178A2E]',
  or: 'bg-[#FBEADE] text-[#C85E18]',
  bl: 'bg-[#E5EDFB] text-[#2D6BD4]',
  rd: 'bg-[#FBE7E5] text-[#D6453B]',
  am: 'bg-[#FBF1D6] text-[#8a6503]',
  gy: 'bg-[#eef1f6] text-[#5A6B80]',
}

interface StatusBadgeProps {
  label: string
  variant?: 'gr' | 'or' | 'bl' | 'rd' | 'am' | 'gy'
  dot?: boolean
  className?: string
}

export function StatusBadge({
  label,
  variant = 'gy',
  dot,
  className,
}: StatusBadgeProps) {
  const dotColor: Record<string, string> = {
    gr: 'bg-[#20A83A]',
    or: 'bg-[#E7722B]',
    bl: 'bg-[#2D6BD4]',
    rd: 'bg-[#D6453B]',
    am: 'bg-[#E0A106]',
    gy: 'bg-[#5A6B80]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] text-[11.5px] font-semibold px-[9px] py-[3px] rounded-full whitespace-nowrap',
        BADGE_CLASSES[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn('w-[7px] h-[7px] rounded-full inline-block', dotColor[variant])}
        />
      )}
      {label}
    </span>
  )
}

// Mapping helpers
export function lotStatutBadge(statut: string) {
  const map: Record<string, { label: string; variant: StatusBadgeProps['variant'] }> = {
    ENVOYE: { label: 'Envoyé', variant: 'bl' },
    EN_COURS: { label: 'En cours', variant: 'am' },
    RETOURNE: { label: 'Retourné', variant: 'gr' },
  }
  return map[statut] ?? { label: statut, variant: 'gy' }
}

export function approbationBadge(dec: string) {
  const map: Record<string, { label: string; variant: StatusBadgeProps['variant'] }> = {
    APPROUVE: { label: 'Approuvé', variant: 'gr' },
    REJETE: { label: 'Rejeté', variant: 'rd' },
    EN_ATTENTE: { label: 'À traiter', variant: 'am' },
  }
  return map[dec] ?? { label: dec, variant: 'gy' }
}

export function planStatutBadge(statut: string) {
  const map: Record<string, { label: string; variant: StatusBadgeProps['variant'] }> = {
    BROUILLON: { label: 'Brouillon', variant: 'gy' },
    EN_VALIDATION: { label: 'En validation', variant: 'am' },
    TRANSMIS_PF: { label: 'Transmis PF', variant: 'bl' },
    AJOURNE: { label: 'Ajourné', variant: 'rd' },
  }
  return map[statut] ?? { label: statut, variant: 'gy' }
}

export function ligneStatutBadge(statut: string) {
  const map: Record<string, { label: string; variant: StatusBadgeProps['variant'] }> = {
    PREVU: { label: 'Prévu', variant: 'gy' },
    AUTORISE: { label: 'Autorisé', variant: 'am' },
    EXECUTE: { label: 'Exécuté', variant: 'gr' },
  }
  return map[statut] ?? { label: statut, variant: 'gy' }
}

export function rembStatutBadge(statut: string) {
  const map: Record<string, { label: string; variant: StatusBadgeProps['variant'] }> = {
    A_JOUR: { label: 'À jour', variant: 'gr' },
    IMPAYE: { label: 'Impayé', variant: 'am' },
    CONTENTIEUX: { label: 'Contentieux', variant: 'rd' },
  }
  return map[statut] ?? { label: statut, variant: 'gy' }
}
