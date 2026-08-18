const AVATAR_COLORS = [
  '#E7722B',
  '#20A83A',
  '#2D6BD4',
  '#E0A106',
  '#D6453B',
  '#8B5CF6',
]

/**
 * Retourne une couleur aléatoire pour un avatar.
 */
export function getRandomAvatarColor() {
  const randomIndex = Math.floor(Math.random() * AVATAR_COLORS.length)
  return AVATAR_COLORS[randomIndex]
}
