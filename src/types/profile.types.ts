/**
 * Écritures sur le compte de l'utilisateur CONNECTÉ.
 *
 * Les noms de champs reprennent exactement ceux du backend (`snake_case`) —
 * aucun mapper, conformément à CLAUDE.md.
 */

/** Corps de `PUT /personnels/{id}` — identité modifiable par l'utilisateur. */
export interface UPDATE_PROFILE_T {
  nom: string
  prenom: string
  email: string
  telephone?: string | null
  adresse?: string | null
}

/**
 * Changement de mot de passe authentifié (ancien → nouveau).
 *
 * ⚠️ À NE PAS confondre avec `SET_PASSWORD_PAYLOAD_T` (parcours par lien email,
 * non authentifié). Endpoint et noms de champs restent à confirmer — cf.
 * leftover #14.
 */
export interface CHANGE_PASSWORD_T {
  mot_de_passe_actuel: string
  mot_de_passe: string
  mot_de_passe_confirmation: string
}
