/**
 * Permissions du compte connecté, telles qu'embarquées dans `GET /auth/me`.
 * Elles sont DÉJÀ portées au rôle de l'utilisateur par le backend : le frontend
 * ne raisonne jamais sur un rôle, seulement sur ces lignes.
 *
 * Forme backend conservée telle quelle (`snake_case`, `autorise`/`acces` en
 * entier ou en chaîne) — aucun renommage, conformément à CLAUDE.md.
 */
export interface PERMISSION_T {
  id: number
  role_id: number
  module: string
  autorise: number
  acces: string
  full_access: number
  created_at?: string
  updated_at?: string
}

/**
 * Modèle de capacité volontairement grossier — deux niveaux par module :
 *  - `access` : le module est consultable ;
 *  - `full`   : CRUD complet ; sinon lecture seule.
 */
export type ModuleAccess = { access: boolean; full: boolean }

/** Index `module → capacités`, dérivé une fois par session. */
export type PermissionIndex = Map<string, ModuleAccess>
