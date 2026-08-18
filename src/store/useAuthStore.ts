import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PERMISSION_ACTION_T, USER_SPACE_T } from '@/types/auth.types'
import type { PERSONNEL_T } from '@/types/personnels.types'

interface AuthState {
  user?: PERSONNEL_T
  // Auth par cookie : la session vit dans un cookie httpOnly (aucun token ici).
  // `isAuthenticated` n'est qu'un indice UI — `GET /me` fait foi.
  isAuthenticated?: boolean

  setSession: (user: PERSONNEL_T) => void
  clearSession: () => void

  /** Espace applicatif de l'utilisateur — pilote l'arbre de routes. */
  space: () => USER_SPACE_T

  /** Vérification des permissions (matrice `PERMS` ci-dessous). */
  can: (module: string, action?: PERMISSION_ACTION_T) => boolean
}

/**
 * Matrice des permissions, indexée par le `code` RÉEL du rôle en base
 * (`user.role.code`), tel que renvoyé par `/personnel/me`.
 * Tout code absent d'ici tombe sur `can() === false` pour TOUS les modules.
 */
const PERMS: Record<string, Record<string, Partial<Record<PERMISSION_ACTION_T, number>>>> = {

  'ADMIN-1': { '*': { v: 1, c: 1, e: 1, d: 1 }, remboursements: { v: 1 }, transmission: { v: 1 }, pf_espace: { v: 1 }, imputation: { v: 1 }, plans_dec: { v: 1 }, recouvrement: { v: 1 } },

  // Conseiller en Insertion Professionnelle — enrôlement, visites, suivi terrain.
  CIP: { dashboard: { v: 1 }, jeunes: { v: 1, c: 1, e: 1 }, projets: { v: 1, c: 1, e: 1 }, financements: { v: 1 }, remboursements: { v: 1, c: 1, e: 1, d: 1 }, suivi: { v: 1, c: 1, e: 1, d: 1 }, rapports: { v: 1 }, indicateurs: { v: 1, c: 1, e: 1, d: 1 }, guichets_home: { v: 1 }, transmission: { v: 1 }, plans_dec: { v: 1, c: 1, e: 1 }, recouvrement: { v: 1 } },

  // Chef d'Agence Régionale — supervision d'agence & guichets.
  CAR: { dashboard: { v: 1 }, dispositifs: { v: 1 }, jeunes: { v: 1, c: 1, e: 1, d: 1 }, projets: { v: 1, c: 1, e: 1, d: 1 }, financements: { v: 1 }, remboursements: { v: 1, c: 1, e: 1, d: 1 }, suivi: { v: 1, c: 1, e: 1, d: 1 }, rapports: { v: 1 }, indicateurs: { v: 1, c: 1, e: 1, d: 1 }, guichets_home: { v: 1 }, transmission: { v: 1 }, imputation: { v: 1 }, plans_dec: { v: 1, e: 1 }, recouvrement: { v: 1 } },

  // Dir. Études Statistiques & Suivi Évaluation — suivi-évaluation, reporting.
  DESSE: { dashboard: { v: 1 }, dispositifs: { v: 1 }, jeunes: { v: 1 }, projets: { v: 1 }, suivi: { v: 1, e: 1 }, rapports: { v: 1, c: 1, e: 1, d: 1 }, indicateurs: { v: 1, c: 1, e: 1, d: 1 }, guichets_home: { v: 1 }, transmission: { v: 1 }, plans_dec: { v: 1 } },

  // --- Direction du financement -------------------------------------------
  // Directeur du Partenariat et du Financement — pilotage guichets & financements.
  DPF: { dashboard: { v: 1 }, dispositifs: { v: 1, c: 1, e: 1 }, jeunes: { v: 1 }, projets: { v: 1, c: 1, e: 1, d: 1 }, financements: { v: 1, c: 1, e: 1, d: 1 }, remboursements: { v: 1 }, suivi: { v: 1, e: 1 }, rapports: { v: 1, c: 1, e: 1 }, indicateurs: { v: 1 }, guichets_home: { v: 1 }, transmission: { v: 1 }, pf_espace: { v: 1 }, imputation: { v: 1 }, plans_dec: { v: 1, e: 1 }, recouvrement: { v: 1 } },

  // Chef de Service Développement des Ressources de Financement — pilote la
  // transmission par lot aux partenaires financiers.
  SDRF: { dashboard: { v: 1 }, dispositifs: { v: 1 }, jeunes: { v: 1 }, projets: { v: 1, c: 1, e: 1 }, financements: { v: 1, c: 1, e: 1, d: 1 }, remboursements: { v: 1 }, suivi: { v: 1 }, rapports: { v: 1, c: 1, e: 1 }, guichets_home: { v: 1 }, transmission: { v: 1, c: 1, e: 1, d: 1 }, pf_espace: { v: 1 }, imputation: { v: 1 }, plans_dec: { v: 1, e: 1 }, recouvrement: { v: 1 } },

  // Chef de Service Financement et Monitoring — imputation aux agences,
  // stratégie de recouvrement des impayés.
  CSFM: { dashboard: { v: 1 }, dispositifs: { v: 1 }, projets: { v: 1 }, remboursements: { v: 1, c: 1, e: 1, d: 1 }, suivi: { v: 1, c: 1, e: 1 }, rapports: { v: 1 }, guichets_home: { v: 1 }, transmission: { v: 1 }, pf_espace: { v: 1 }, imputation: { v: 1, c: 1, e: 1 }, plans_dec: { v: 1, e: 1 }, recouvrement: { v: 1, c: 1, e: 1, d: 1 } },

  // Chef de Service Risques, Garanties et Contentieux — conventions de prêt.
  CSRGC: { dashboard: { v: 1 }, dispositifs: { v: 1 }, jeunes: { v: 1 }, projets: { v: 1 }, financements: { v: 1, e: 1 }, remboursements: { v: 1 }, suivi: { v: 1 }, rapports: { v: 1 }, guichets_home: { v: 1 }, transmission: { v: 1 }, pf_espace: { v: 1 }, plans_dec: { v: 1 }, recouvrement: { v: 1, c: 1, e: 1 } },

  // Agent de la Direction — saisie des plans de décaissement non imputés.
  AGENT_DIR: { dashboard: { v: 1 }, dispositifs: { v: 1 }, jeunes: { v: 1 }, projets: { v: 1 }, financements: { v: 1 }, remboursements: { v: 1 }, suivi: { v: 1, c: 1, e: 1 }, guichets_home: { v: 1 }, transmission: { v: 1 }, plans_dec: { v: 1, c: 1, e: 1 } },

  // --- Chaîne de validation des plans de décaissement ----------------------
  // Sous-Directeur de l'Évaluation Financière.
  SDEF: { dashboard: { v: 1 }, dispositifs: { v: 1 }, jeunes: { v: 1 }, projets: { v: 1 }, financements: { v: 1 }, remboursements: { v: 1 }, suivi: { v: 1 }, rapports: { v: 1 }, guichets_home: { v: 1 }, transmission: { v: 1 }, pf_espace: { v: 1 }, plans_dec: { v: 1, e: 1 }, recouvrement: { v: 1 } },

  // Sous-Directeur du Partenariat et du Financement.
  SDPF: { dashboard: { v: 1 }, dispositifs: { v: 1 }, jeunes: { v: 1 }, projets: { v: 1 }, financements: { v: 1 }, remboursements: { v: 1 }, suivi: { v: 1 }, rapports: { v: 1 }, guichets_home: { v: 1 }, transmission: { v: 1 }, pf_espace: { v: 1 }, imputation: { v: 1 }, plans_dec: { v: 1, e: 1 }, recouvrement: { v: 1 } },

  // --- Partenaire financier (espace `organisme`) ---------------------------

  PF: { dashboard: { v: 1 }, projets: { v: 1 }, financements: { v: 1, c: 1, e: 1, d: 1 }, remboursements: { v: 1, c: 1, e: 1, d: 1 }, suivi: { v: 1 }, indicateurs: { v: 1, c: 1, e: 1, d: 1 }, guichets_home: { v: 1 }, transmission: { v: 1 }, pf_espace: { v: 1, c: 1, e: 1, d: 1 }, plans_dec: { v: 1, e: 1 }, recouvrement: { v: 1 } },


  DIC: { dashboard: { v: 1 }, guichets_home: { v: 1 } },
}

/**
 * Rôle → espace applicatif, d'après le regroupement des comptes de démonstration
 * de la maquette :
 *  - `agence`     → personnel AEJ (agences régionales, direction du financement,
 *                   chaîne de validation) ;
 *  - `organisme`  → partenaire financier (UNACOOPEC-CI, Orange Bank Africa…) ;
 *  - `entreprise` → promoteur bénéficiaire.
 *
 * Table à étendre quand un nouveau rôle apparaît ; un code inconnu retombe sur
 * `DEFAULT_SPACE`.
 */
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

  // Promoteur bénéficiaire — pas de ligne dans `PERMS` : l'espace bénéficiaire
  // a son propre jeu de modules (`BENEF_NAV_ITEMS`) et ne passe pas par `can()`.
  BENEF: 'entreprise',
}

const DEFAULT_SPACE: USER_SPACE_T = 'agence'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      setSession: (user) => set({ user, isAuthenticated: true }),

      clearSession: () => set({ user: undefined, isAuthenticated: undefined }),

 
      // `ROLE_SPACES`, table à étendre quand un  nouveau rôle apparaît.
      space: () => {
        const roleCode = get().user?.role?.code
        if (!roleCode) return DEFAULT_SPACE
        return ROLE_SPACES[roleCode] ?? DEFAULT_SPACE
      },

      can: (module, action = 'v') => {
        const roleCode = get().user?.role?.code
        if (!roleCode) return false
        const rolePerms = PERMS[roleCode]
        if (!rolePerms) return false
        if (rolePerms[module]) return !!rolePerms[module][action]
        return !!rolePerms['*']?.[action]
      },
    }),
    {
      name: 'aej-auth',
      version: 2,
      migrate: () => ({ user: undefined, isAuthenticated: undefined }),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
