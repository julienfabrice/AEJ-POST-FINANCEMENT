export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const PAGE_TITLES = {
  [ROUTES.HOME]: 'Accueil',
  [ROUTES.LOGIN]: 'Connexion',
  [ROUTES.DASHBOARD]: 'Tableau de bord',
  [ROUTES.PROJECTS]: 'Projets Post-Financement',
  [ROUTES.PROFILE]: 'Mon Profil',
  [ROUTES.SETTINGS]: 'Paramètres',
} as const;

// Typage pour récupérer les valeurs des routes
export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
