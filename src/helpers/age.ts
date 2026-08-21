import dayjs from 'dayjs'

/**
 * Âge révolu à partir d'une date de naissance.
 */
export function getAge(birthdate?: string | null): number | null {
  if (!birthdate) return null

  const date = dayjs(birthdate)
  if (!date.isValid()) return null

  // `diff` en années tronque déjà : l'anniversaire non atteint n'est pas compté.
  const age = dayjs().diff(date, 'year')

  return age < 0 ? null : age
}

/** Âge prêt à afficher : `« 32 »`, ou `« — »` si non calculable. */
export function formatAge(birthdate?: string | null): string {
  const age = getAge(birthdate)
  if (age === null) return '—'
  return `${age}`
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
