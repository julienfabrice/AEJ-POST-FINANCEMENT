import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AUTH_DISABLED } from '@/constants/devFlags'
import { canFrom, indexPermissions } from '@/lib/permissions'
import type { PERMISSION_ACTION_T, USER_SPACE_T } from '@/types/auth.types'
import type { PermissionIndex } from '@/types/permissions.types'
import type { PERSONNEL_T } from '@/types/personnels.types'

interface AuthState {
  user?: PERSONNEL_T
  isAuthenticated?: boolean

  /**
   * DÉRIVÉ de `user.permissions`.
   */
  permissions?: PermissionIndex

  setSession: (user: PERSONNEL_T) => void
  clearSession: () => void

  /** Espace applicatif de l'utilisateur — pilote l'arbre de routes. */
  space: () => USER_SPACE_T

  /**
   * Unique point de vérification des droits. Lit exclusivement les permissions
   */
  can: (module: string, action?: PERMISSION_ACTION_T) => boolean

  /** Retourne l'agence_regionale_id si l'utilisateur est cloisonné à une agence (CIP, CAR). */
  agencyScope: () => string | null

  /** Retourne l'organisme_id si l'utilisateur est un PF. */
  organismeScope: () => string | null
}


const ROLE_SPACES: Record<string, USER_SPACE_T> = {
  // Personnel AEJ
  'ADMIN-1': 'agence',
  CIP: 'agence',
  CAR: 'agence',
  DPF: 'agence',
  DIC: 'agence',
  DESSE: 'agence',
  SDRF: 'agence',
  CSFM: 'agence',
  CSRGC: 'agence',
  AGENT_DIR: 'agence',
  SDEF: 'agence',
  SDPF: 'agence',

  // Partenaire financier
  PF: 'organisme',

  // Promoteur bénéficiaire
  BENEF: 'entreprise',
}

const DEFAULT_SPACE: USER_SPACE_T = 'agence'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      setSession: (user) =>
        set({
          user,
          isAuthenticated: true,
          permissions: indexPermissions(user.permissions ?? []),
        }),

      clearSession: () =>
        set({ user: undefined, isAuthenticated: undefined, permissions: undefined }),

      space: () => {
        const roleCode = get().user?.role?.code
        if (!roleCode) return DEFAULT_SPACE
        return ROLE_SPACES[roleCode] ?? DEFAULT_SPACE
      },

     
      can: (module, action = 'v') => {
 
        if (AUTH_DISABLED) return true

        return canFrom(get().permissions, module, action)
      },

      agencyScope: () => {
        const user = get().user
        if (!user || user.role?.code === 'BENEF') return null
        // CIP et CAR sont cloisonnés par agence
        if (['CIP', 'CAR', 'AC'].includes(user.role?.code || '') && user.agence?.id) {
          return String(user.agence.id)
        }
        return null
      },

      organismeScope: () => {
        const user = get().user
        if (!user || user.role?.code === 'BENEF') return null
        if (user.role?.code === 'PF' && user.organisme?.id) {
          return String(user.organisme.id)
        }
        return null
      },
    }),
    {
      name: 'aej-auth',

      version: 3,
      migrate: () => ({ user: undefined, isAuthenticated: undefined }),

      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      // …et elle est reconstruite depuis `user.permissions` au réhydratage,
      // sinon `can()` renverrait `false` partout après un rechargement de page.
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          state.permissions = indexPermissions(state.user.permissions ?? [])
        }
      },
    },
  ),
)
