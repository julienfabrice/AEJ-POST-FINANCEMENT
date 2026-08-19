import { useMemo } from 'react'
import { AlertCircle, ShieldCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getRandomAvatarColor } from '@/helpers/getRandomAvatarColor'
import { cn } from '@/lib/utils'
import type { PERSONNEL_T } from '@/types/personnels.types'

export function CompteHeader({ user }: { user: PERSONNEL_T }) {
  const initials = `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase() || 'AJ'
  const fullName = `${user.prenom} ${user.nom}`.trim()

  // `getRandomAvatarColor` tire au hasard à chaque appel : on le fige sur l'id
  // pour que la couleur ne change pas d'un rendu à l'autre.
  const fallbackColor = useMemo(() => getRandomAvatarColor(), [])

  return (
    <section className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:gap-6">
      <Avatar className="size-20 border-2 border-background shadow-sm">
        <AvatarImage src={user.profile_picture ?? ''} alt={fullName} />
        <AvatarFallback
          className="text-2xl font-bold text-white"
          style={{ backgroundColor: fallbackColor }}
        >
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-1 sm:items-start">
        <h1 className="truncate text-2xl font-extrabold">{fullName}</h1>
        <p className="text-sm text-muted-foreground">{user.role?.libelle ?? 'Rôle non défini'}</p>
        <p className="truncate text-sm text-muted-foreground">{user.email}</p>
      </div>

      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
          user.is_active === 1
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
            : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
        )}
      >
        {user.is_active === 1 ? (
          <>
            <ShieldCheck className="size-3.5" />
            Compte actif
          </>
        ) : (
          <>
            <AlertCircle className="size-3.5" />
            Compte inactif
          </>
        )}
      </span>
    </section>
  )
}
