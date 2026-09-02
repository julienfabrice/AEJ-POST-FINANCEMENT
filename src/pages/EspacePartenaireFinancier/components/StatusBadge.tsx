import { cn } from '@/lib/utils'

const BADGE_CLASSES: Record<string, string> = {
  gr: 'bg-[#E3F6E7] text-[#178A2E]',
  or: 'bg-[#FBEADE] text-[#C85E18]',
  bl: 'bg-[#E5EDFB] text-[#2D6BD4]',
  rd: 'bg-[#FBE7E5] text-[#D6453B]',
  am: 'bg-[#FBF1D6] text-[#8a6503]',
  gy: 'bg-[#eef1f6] text-[#5A6B80]',
}

export type StatusBadgeVariant = 'gr' | 'or' | 'bl' | 'rd' | 'am' | 'gy'

interface StatusBadgeProps {
  label: string
  variant?: StatusBadgeVariant
  dot?: boolean
  className?: string
}

export function StatusBadge({
  label,
  variant = 'gy',
  dot,
  className,
}: StatusBadgeProps) {
  const dotColor: Record<StatusBadgeVariant, string> = {
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
export function lotStatutBadge(statut?: string): { label: string; variant: StatusBadgeVariant } {
  const map: Record<string, { label: string; variant: StatusBadgeVariant }> = {
    BROUILLON: { label: 'Brouillon', variant: 'gy' },
    TRANSMIS: { label: 'Transmis', variant: 'bl' },
    TRAITE: { label: 'Traité', variant: 'gr' },
    REJETE: { label: 'Rejeté', variant: 'rd' },
    ENVOYE: { label: 'Envoyé', variant: 'bl' },
    EN_COURS: { label: 'En cours', variant: 'am' },
    RETOURNE: { label: 'Retourné', variant: 'gr' },
  }
  if (!statut) return { label: '—', variant: 'gy' }
  return map[statut] ?? { label: statut, variant: 'gy' }
}

export function approbationBadge(dec?: string): { label: string; variant: StatusBadgeVariant } {
  const map: Record<string, { label: string; variant: StatusBadgeVariant }> = {
    APPROUVE: { label: 'Approuvé', variant: 'gr' },
    NON_APPROUVE: { label: 'Non approuvé', variant: 'rd' },
    REJETE: { label: 'Rejeté', variant: 'rd' },
    EN_ATTENTE: { label: 'En attente', variant: 'am' },
    EN_COURS: { label: 'En cours', variant: 'bl' },
    EN_SOUMISSION: { label: 'En soumission', variant: 'gy' },
    EN_ANALYSE: { label: 'En analyse', variant: 'am' },
    ANNULE: { label: 'Annulé', variant: 'rd' },
    EN_FORMATION: { label: 'En formation', variant: 'bl' },
    EN_FINANCEMENT: { label: 'En financement', variant: 'or' },
    EN_DECAISSEMENT: { label: 'En décaissement', variant: 'or' },
    EN_SUIVI: { label: 'En suivi', variant: 'bl' },
    EN_REMBOURSEMENT: { label: 'En remboursement', variant: 'am' },
    TERMINE: { label: 'Terminé', variant: 'gr' },
    BROUILLON: { label: 'Brouillon', variant: 'gy' },
  }
  if (!dec) return { label: '—', variant: 'gy' }
  return map[dec] ?? { label: dec, variant: 'gy' }
}

export function planStatutBadge(statut?: string): { label: string; variant: StatusBadgeVariant } {
  const map: Record<string, { label: string; variant: StatusBadgeVariant }> = {
    BROUILLON: { label: 'Brouillon', variant: 'gy' },
    EN_VALIDATION: { label: 'En validation', variant: 'am' },
    TRANSMIS_PF: { label: 'Transmis PF', variant: 'bl' },
    AJOURNE: { label: 'Ajourné', variant: 'rd' },
    VALIDE: { label: 'Validé', variant: 'gr' },
    NON_VALIDE: { label: 'Non validé', variant: 'rd' },
  }
  if (!statut) return { label: '—', variant: 'gy' }
  return map[statut] ?? { label: statut, variant: 'gy' }
}

export function ligneStatutBadge(statut?: string): { label: string; variant: StatusBadgeVariant } {
  const map: Record<string, { label: string; variant: StatusBadgeVariant }> = {
    VALIDE: { label: 'Validé', variant: 'gr' },
    NON_VALIDE: { label: 'Non validé', variant: 'rd' },
    PREVU: { label: 'Prévu', variant: 'gy' },
    AUTORISE: { label: 'Autorisé', variant: 'am' },
    EXECUTE: { label: 'Exécuté', variant: 'gr' },
    EN_ATTENTE: { label: 'En attente', variant: 'am' },
  }
  if (!statut) return { label: '—', variant: 'gy' }
  return map[statut] ?? { label: statut, variant: 'gy' }
}

export function rembStatutBadge(statut?: string): { label: string; variant: StatusBadgeVariant } {
  const map: Record<string, { label: string; variant: StatusBadgeVariant }> = {
    EN_ATTENTE: { label: 'En attente', variant: 'am' },
    PAYE: { label: 'Payé', variant: 'gr' },
    PARTIEL: { label: 'Partiel', variant: 'or' },
    NON_PAYE: { label: 'Non payé', variant: 'rd' },
    A_JOUR: { label: 'À jour', variant: 'gr' },
    IMPAYE: { label: 'Impayé', variant: 'rd' },
    CONTENTIEUX: { label: 'Contentieux', variant: 'rd' },
  }
  if (!statut) return { label: '—', variant: 'gy' }
  return map[statut] ?? { label: statut, variant: 'gy' }
}

