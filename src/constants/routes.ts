import {
  LayoutDashboard,
  Building2,
  GitBranch,
  ArrowUpFromLine,
  Landmark,
  MapPin,
  Wallet,
  RefreshCcw,
  Users,
  FolderOpen,
  Banknote,
  BarChart3,
  Eye,
  FileText,
  Shield,
  Globe,
  Boxes,
  Tags,
  Workflow,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export const ROUTES = {
  LOGIN: '/login',
  // Parcours d'authentification (hors coquille applicative — aucun AppLayout)
  OTP: '/2fa',
  /** Écran 1 — demande du lien. `?mode=forgot` (défaut) ou `?mode=setup`. */
  FORGOT_PASSWORD: '/forgot-password',
  /** Écran 2 — cible du lien email : `/set-password/{uid}/{token}`. */
  SET_PASSWORD: '/set-password/$uid/$token',
  // Pilotage (Agent)
  HOME: '/dashboard',
  DASHBOARD: '/dashboard',
  DISPOSITIFS: '/dispositifs',
  // Circuit de financement
  TRANSMISSION: '/transmission',
  PF_ESPACE: '/pf-espace',
  IMPUTATION: '/imputation',
  PLANS_DECAISSEMENT: '/plans-decaissement',
  RECOUVREMENT: '/recouvrement',
  // Opérations
  JEUNES: '/jeunes',
  PROJETS: '/projets',
  FINANCEMENTS: '/financements',
  REMBOURSEMENTS: '/remboursements',
  INDICATEURS: '/indicateurs',
  // Suivi & Évaluation
  SUIVI: '/suivi',
  RAPPORTS: '/rapports',
  // Administration
  ADMIN_PROFILS: '/admin/profils',
  ADMIN_UTILISATEURS: '/admin/utilisateurs',
  ADMIN_LOCALITES: '/admin/localites',
  ADMIN_UNITES: '/admin/unites',
  ADMIN_PARTENAIRES: '/admin/partenaires',
  ADMIN_REFERENTIELS: '/admin/referentiels',
  ADMIN_WORKFLOWS: '/admin/workflows',
  ADMIN_PARAMETRES: '/admin/parametres',
  
  // Bénéficiaire
  BENEF_DASHBOARD: '/dashboard',
  BENEF_PROJETS: '/mes-projets',
  BENEF_REMBOURSEMENTS: '/mes-remboursements',
  BENEF_PIECES: '/mes-pieces',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]

export interface NavItem {
  key: string
  label: string
  path: AppRoute
  icon: LucideIcon
  group: string
}

export const AGENT_NAV_ITEMS: NavItem[] = [
  // PILOTAGE
  { key: 'guichets_home', label: 'Guichets', path: ROUTES.HOME, icon: Building2, group: 'PILOTAGE' },
  { key: 'dashboard', label: 'Tableau de bord', path: ROUTES.DASHBOARD, icon: LayoutDashboard, group: 'PILOTAGE' },
  { key: 'dispositifs', label: 'Procédures', path: ROUTES.DISPOSITIFS, icon: GitBranch, group: 'PILOTAGE' },
  // CIRCUIT DE FINANCEMENT
  { key: 'transmission', label: 'Transmission par lot', path: ROUTES.TRANSMISSION, icon: ArrowUpFromLine, group: 'CIRCUIT DE FINANCEMENT' },
  { key: 'pf_espace', label: 'Espace partenaire financier', path: ROUTES.PF_ESPACE, icon: Landmark, group: 'CIRCUIT DE FINANCEMENT' },
  { key: 'imputation', label: 'Imputation aux agences', path: ROUTES.IMPUTATION, icon: MapPin, group: 'CIRCUIT DE FINANCEMENT' },
  { key: 'plans_dec', label: 'Plans de décaissement', path: ROUTES.PLANS_DECAISSEMENT, icon: Wallet, group: 'CIRCUIT DE FINANCEMENT' },
  { key: 'recouvrement', label: 'Recouvrement & garanties', path: ROUTES.RECOUVREMENT, icon: RefreshCcw, group: 'CIRCUIT DE FINANCEMENT' },
  // OPÉRATIONS
  { key: 'jeunes', label: 'Promoteurs (porteurs)', path: ROUTES.JEUNES, icon: Users, group: 'OPÉRATIONS' },
  { key: 'projets', label: 'Micro-projets', path: ROUTES.PROJETS, icon: FolderOpen, group: 'OPÉRATIONS' },
  { key: 'financements', label: 'Financements', path: ROUTES.FINANCEMENTS, icon: Banknote, group: 'OPÉRATIONS' },
  { key: 'remboursements', label: 'Remboursements', path: ROUTES.REMBOURSEMENTS, icon: RefreshCcw, group: 'OPÉRATIONS' },
  { key: 'indicateurs', label: 'Indicateurs & suivi', path: ROUTES.INDICATEURS, icon: BarChart3, group: 'OPÉRATIONS' },
  // SUIVI & ÉVALUATION
  { key: 'suivi', label: 'Suivi & exploitation', path: ROUTES.SUIVI, icon: Eye, group: 'SUIVI & ÉVALUATION' },
  { key: 'rapports', label: 'Rapports', path: ROUTES.RAPPORTS, icon: FileText, group: 'SUIVI & ÉVALUATION' },
  // ADMINISTRATION
  { key: 'admin_profils', label: 'Profils & permissions', path: ROUTES.ADMIN_PROFILS, icon: Shield, group: 'ADMINISTRATION' },
  { key: 'admin_utilisateurs', label: 'Utilisateurs', path: ROUTES.ADMIN_UTILISATEURS, icon: Users, group: 'ADMINISTRATION' },
  { key: 'admin_localites', label: 'Localités', path: ROUTES.ADMIN_LOCALITES, icon: Globe, group: 'ADMINISTRATION' },
  { key: 'admin_unites', label: 'Unités de gestion', path: ROUTES.ADMIN_UNITES, icon: Boxes, group: 'ADMINISTRATION' },
  { key: 'admin_partenaires', label: 'Partenaires financiers', path: ROUTES.ADMIN_PARTENAIRES, icon: Landmark, group: 'ADMINISTRATION' },
  { key: 'admin_referentiels', label: 'Référentiels métier', path: ROUTES.ADMIN_REFERENTIELS, icon: Tags, group: 'ADMINISTRATION' },
  { key: 'admin_workflows', label: 'Paramétrage des workflows', path: ROUTES.ADMIN_WORKFLOWS, icon: Workflow, group: 'ADMINISTRATION' },
  { key: 'admin_parametres', label: 'Paramètres système', path: ROUTES.ADMIN_PARAMETRES, icon: Settings, group: 'ADMINISTRATION' },
]

export const BENEF_NAV_ITEMS: NavItem[] = [
  { key: 'benef_dashboard', label: 'Mon tableau de bord', path: ROUTES.BENEF_DASHBOARD, icon: LayoutDashboard, group: 'BENEF' },
  { key: 'mes_projets', label: 'Mes projets', path: ROUTES.BENEF_PROJETS, icon: FolderOpen, group: 'BENEF' },
  { key: 'mes_remboursements', label: 'Mes remboursements', path: ROUTES.BENEF_REMBOURSEMENTS, icon: RefreshCcw, group: 'BENEF' },
  { key: 'mes_pieces', label: 'Mes pièces', path: ROUTES.BENEF_PIECES, icon: FileText, group: 'BENEF' },
]

// Groupes de navigation dans l'ordre d'affichage
export const AGENT_NAV_GROUPS = [
  'PILOTAGE',
  'CIRCUIT DE FINANCEMENT',
  'OPÉRATIONS',
  'SUIVI & ÉVALUATION',
  'ADMINISTRATION',
] as const

export const PAGE_TITLES: Partial<Record<AppRoute, string>> = {
  [ROUTES.LOGIN]: 'Connexion',
  [ROUTES.DASHBOARD]: 'Tableau de bord',
  [ROUTES.DISPOSITIFS]: 'Procédures',
  [ROUTES.TRANSMISSION]: 'Transmission par lot',
  [ROUTES.PF_ESPACE]: 'Espace partenaire financier',
  [ROUTES.IMPUTATION]: 'Imputation aux agences',
  [ROUTES.PLANS_DECAISSEMENT]: 'Plans de décaissement',
  [ROUTES.RECOUVREMENT]: 'Recouvrement & garanties',
  [ROUTES.JEUNES]: 'Promoteurs (porteurs)',
  [ROUTES.PROJETS]: 'Micro-projets',
  [ROUTES.FINANCEMENTS]: 'Financements',
  [ROUTES.REMBOURSEMENTS]: 'Remboursements',
  [ROUTES.INDICATEURS]: 'Indicateurs & suivi',
  [ROUTES.SUIVI]: 'Suivi & exploitation',
  [ROUTES.RAPPORTS]: 'Rapports',
  [ROUTES.ADMIN_PROFILS]: 'Profils & permissions',
  [ROUTES.ADMIN_UTILISATEURS]: 'Utilisateurs',
  [ROUTES.ADMIN_LOCALITES]: 'Localités',
  [ROUTES.ADMIN_UNITES]: 'Unités de gestion',
  [ROUTES.ADMIN_PARTENAIRES]: 'Partenaires financiers',
  [ROUTES.ADMIN_REFERENTIELS]: 'Référentiels métier',
  [ROUTES.ADMIN_WORKFLOWS]: 'Paramétrage des workflows',
  [ROUTES.ADMIN_PARAMETRES]: 'Paramètres système',
  
  [ROUTES.BENEF_PROJETS]: 'Mes projets',
  [ROUTES.BENEF_REMBOURSEMENTS]: 'Mes remboursements',
  [ROUTES.BENEF_PIECES]: 'Mes pièces',
}
