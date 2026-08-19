import { LogOut, ChevronDown, ShieldCheck, AlertCircle, ShieldCog, ChevronRight } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/constants/routes'
import { useLogout } from '@/hooks/auth.hooks'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'

export function UserProfileMenu() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const logout = useLogout()

  const initials = user
    ? `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase()
    : 'AJ'
  const displayName = user ? `${user.prenom} ${user.nom}` : 'Utilisateur'
  const roleName = user?.role?.libelle ?? ''

  // Invalide aussi la session serveur (l'ancien `clearSession` seul laissait le
  // cookie valide côté backend), puis renvoie sur l'écran de connexion.
  const handleLogout = () =>
    logout.mutate(undefined, {
      onSettled: () => {
        void navigate({ to: '/login' })
      },
    })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 h-[38px] px-2 rounded-[9px] hover:bg-white/[0.08] transition-colors outline-none">
          <Avatar className="w-[26px] h-[26px] rounded-full">
            <AvatarFallback className="text-[11px] font-bold bg-[#E7722B] text-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start min-w-0 max-w-[120px] text-left">
            <b className="text-[12.5px] font-semibold text-white leading-tight truncate w-full">{displayName}</b>
            <span className="text-[10px] text-[#7f8fa4] leading-tight truncate w-full">{roleName}</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#7f8fa4] ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-xl p-0"
        side={'bottom'}
        align={'end'}
        sideOffset={4}
      >
        <div className="flex flex-col items-center gap-3 border-b border-border/50 px-4 py-5">
          <div className="relative">
            <Avatar className="size-18 border-2 border-background shadow-sm">
              <AvatarImage src={user?.profile_picture ?? ''} />
              <AvatarFallback className="bg-[#E7722B] text-3xl font-bold text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            <span
              className="
                absolute bottom-0.5 right-0.5
                size-3 rounded-full
                border-2 border-background
                bg-emerald-500
              "
            />
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <p className="text-sm font-medium">{`${user?.nom} ${user?.prenom}`}</p>

            <p className="text-xs text-muted-foreground">
              {user?.email}
            </p>

            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                  user?.is_active === 1
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                )}
              >
                {user?.is_active === 1 ? (
                  <>
                    <ShieldCheck className="size-3" />
                    Compte actif
                  </>
                ) : (
                  <>
                    <AlertCircle className="size-3" />
                    Action requise
                  </>
                )}
              </span>

            
            </div>
          </div>
        </div>

        <div className="p-1.5">
          <DropdownMenuItem
            asChild
            className="cursor-pointer rounded-lg px-3 py-2.5"
          >
            <Link
              to={ROUTES.COMPTE}
              className="flex items-center gap-3"
            >
              <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                <ShieldCog className="size-3.5 text-muted-foreground" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  Gérer mon compte
                </span>
                <span className="text-xs text-muted-foreground">
                  Profil et sécurité
                </span>
              </div>

              <ChevronRight className="ml-auto size-3.5 text-muted-foreground" />
            </Link>
          </DropdownMenuItem>

        
        </div>

             <>
            <DropdownMenuSeparator className="my-0" />

            <div className="p-1.5">
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer rounded-lg px-3 py-2.5"
                onClick={()=> handleLogout()}
              >
                <div className="flex size-7 items-center justify-center rounded-md bg-red-100 dark:bg-red-950">
                  <LogOut className="size-3.5 text-red-600 dark:text-red-400" />
                </div>

                <span className="text-sm font-medium">
                  Déconnexion
                </span>
              </DropdownMenuItem>
            </div>
          </>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
