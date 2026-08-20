

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
 */
export interface CHANGE_PASSWORD_T {
  mot_de_passe_actuel: string
  mot_de_passe: string
  mot_de_passe_confirmation: string
}
