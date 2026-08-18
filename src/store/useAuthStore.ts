import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  id: number
  nom: string
  prenoms: string
  email: string
  roleId: number
  roleCode: string
  roleLibelle: string
  kind: 'agent' | 'benef'
  agenceId?: number
  organismeId?: number
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean

  setSession: (user: AuthUser, token: string) => void
  clearSession: () => void

  // Vérification des permissions (basé sur la maquette)
  can: (module: string, action?: 'v' | 'c' | 'e' | 'd') => boolean
}

// Matrice des permissions extraite de la maquette
const PERMS: Record<string, Record<string, Record<string, number>>> = {
  ADMIN: { '*': { v: 1, c: 1, e: 1, d: 1 }, remboursements: { v: 1 }, transmission: { v: 1 }, pf_espace: { v: 1 }, imputation: { v: 1 }, plans_dec: { v: 1 }, recouvrement: { v: 1 } },
  DPF: { dashboard: { v: 1 }, dispositifs: { v: 1, c: 1, e: 1 }, jeunes: { v: 1 }, projets: { v: 1, c: 1, e: 1, d: 1 }, financements: { v: 1, c: 1, e: 1, d: 1 }, remboursements: { v: 1 }, suivi: { v: 1, e: 1 }, rapports: { v: 1, c: 1, e: 1 }, indicateurs: { v: 1 } },
  DAICG: { dashboard: { v: 1 }, dispositifs: { v: 1 }, jeunes: { v: 1 }, projets: { v: 1 }, financements: { v: 1 }, remboursements: { v: 1, c: 1, e: 1, d: 1 }, suivi: { v: 1 }, rapports: { v: 1, c: 1, e: 1 }, indicateurs: { v: 1, c: 1, e: 1, d: 1 } },
  CAR: { dashboard: { v: 1 }, dispositifs: { v: 1 }, jeunes: { v: 1, c: 1, e: 1, d: 1 }, projets: { v: 1, c: 1, e: 1, d: 1 }, financements: { v: 1 }, remboursements: { v: 1, c: 1, e: 1, d: 1 }, suivi: { v: 1, c: 1, e: 1, d: 1 }, rapports: { v: 1 }, indicateurs: { v: 1, c: 1, e: 1, d: 1 } },
  CIP: { dashboard: { v: 1 }, jeunes: { v: 1, c: 1, e: 1 }, projets: { v: 1, c: 1, e: 1 }, financements: { v: 1 }, remboursements: { v: 1, c: 1, e: 1, d: 1 }, suivi: { v: 1, c: 1, e: 1, d: 1 }, rapports: { v: 1 }, indicateurs: { v: 1, c: 1, e: 1, d: 1 } },
  PF: { dashboard: { v: 1 }, projets: { v: 1 }, financements: { v: 1, c: 1, e: 1, d: 1 }, remboursements: { v: 1, c: 1, e: 1, d: 1 }, suivi: { v: 1 }, indicateurs: { v: 1, c: 1, e: 1, d: 1 } },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setSession: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      clearSession: () =>
        set({ user: null, token: null, isAuthenticated: false }),

      can: (module, action = 'v') => {
        const { user } = get()
        if (!user) return false
        const rolePerms = PERMS[user.roleCode]
        if (!rolePerms) return false
        // Wildcard '*' = toutes les permissions sauf exceptions
        if (rolePerms[module]) return !!rolePerms[module][action]
        return !!rolePerms['*']?.[action]
      },
    }),
    {
      name: 'aej-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)
