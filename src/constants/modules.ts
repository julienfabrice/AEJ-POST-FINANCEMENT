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
  /**
   * ⚠️ MODULE DÉCLARÉ MAIS PAS ENCORE UTILISÉ COMME GARDE.
   *
   * La page « Cadre de résultat » (`/cadre-resultat`) est gardée par
   * `MODULES.SUIVI`, PAS par cette clé — voir `AGENT_NAV_ITEMS` et
   * `src/routes/_authenticated/_agent/cadre-resultat.tsx`.
   *
   * Raison : `can()` ne connaît que les modules renvoyés par `GET /auth/me`.
   * Tant que le backend n'expose pas `cadre_resultat` dans les permissions,
   * `can('cadre_resultat', 'v')` répond `false` pour TOUT LE MONDE : la route
   * redirigerait vers le tableau de bord et l'entrée disparaîtrait du menu.
   * L'écran serait livré et inaccessible.
   *
   * La clé est néanmoins posée dès maintenant pour que la bascule soit un
   * changement d'UNE LIGNE à deux endroits (le `module:` de l'entrée de menu
   * et le `requireModule(...)` de la route) le jour où le backend le renverra.
   */
  CADRE_RESULTAT: 'cadre_resultat',
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
