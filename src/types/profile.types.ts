

/** Corps de `PUT /personnels/{id}` — identité modifiable par l'utilisateur. */
export interface UPDATE_PROFILE_T {
  nom: string
  prenom: string
  email: string
  telephone?: string | null
  adresse?: string | null
}

/**
 * Corps de `POST /password/change` — changement authentifié (ancien → nouveau).
 *
 * Le backend n'attend PAS de confirmation : celle du formulaire ne sert qu'à la
 * validation côté client et ne part jamais sur le réseau.
 */
export interface CHANGE_PASSWORD_T {
  password_old: string
  password_new: string
}
