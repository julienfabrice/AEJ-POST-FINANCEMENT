/*
 
 * POUR RÉTABLIR L'AUTHENTIFICATION  :Passer `AUTH_DISABLED` à `false` ci-dessous.
 * ou le retirer avec 
 *  
 *        src/routes/_authenticated.tsx  → garde de session
 *        src/store/useAuthStore.ts      → `can()` permissif
 *         src/constants/axiosInstance.ts → pas de déconnexion sur 401
 *      Retirer les blocs marqués, puis supprimer ce fichier.
 */


export const AUTH_DISABLED = true


if (AUTH_DISABLED && typeof console !== 'undefined') {
  console.warn(
    '[AUTH-OFF] Authentification DÉSACTIVÉE (src/constants/devFlags.ts). ' +
      'Mode de test uniquement — à repasser à `false` avant toute mise en ligne.',
  )
}
