/**
 * Vocabulaire CANONIQUE des modules — source unique.
 *
 * Ces chaînes doivent correspondre EXACTEMENT au champ `module` renvoyé par
 * `GET /auth/me`
 */
export const MODULES = {
  // Pilotage
  DASHBOARD: 'dashboard',
  GUICHETS: 'guichets_home',
  DISPOSITIFS: 'dispositifs',

  // Circuit de financement
  TRANSMISSION: 'transmission',
  PF_ESPACE: 'pf_espace',
  IMPUTATION: 'imputation',
  PLANS_DEC: 'plans_dec',
  RECOUVREMENT: 'recouvrement',

  // Opérations
  JEUNES: 'jeunes',
  PROJETS: 'projets',
  REMBOURSEMENTS: 'remboursements',
  INDICATEURS: 'indicateurs',
  ORGANISMES: 'organismes',
  ENTREPRISES: 'entreprises',

  // Suivi & évaluation
  SUIVI: 'suivi',
  RAPPORTS: 'rapports',

  // Administration
  PROFILS: 'profils',
  UTILISATEURS: 'utilisateurs',
  LOCALITES: 'localites',
  UNITES: 'unites',
  PARTENAIRES: 'partenaires',
  REFERENTIELS: 'referentiels',
  WORKFLOWS: 'workflows',
  PARAMETRES: 'parametres',
} as const

export type ModuleKey = (typeof MODULES)[keyof typeof MODULES]
