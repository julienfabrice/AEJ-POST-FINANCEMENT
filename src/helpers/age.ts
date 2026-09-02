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

/**
 * Date → « AAAA-MM-JJ » (partie calendaire seule), ou `null`.
 *
 * Deux origines possibles pour la valeur : un `<input type="date">`
 * (« 2025-06-30 ») et la relecture d'une ligne, que Laravel sérialise en ISO
 * complet (« 2025-06-30T00:00:00.000000Z »). On tronque à la partie
 * signifiante ; la chaîne vide devient `null`, car `""` n'est pas une date
 * valide pour Laravel (« must be a valid date »).
 *
 * Placé ici, aux côtés de `formatDate` — le dépôt n'a pas d'autre module de
 * dates et en créer un second éparpillerait les deux moitiés du même sujet.
 * C'est la MÊME fonction qui était écrite trois fois : `versChampDate`
 * (useExploitationForm), `toDateOnly` (exploitations.services) et sa copie
 * dans visitePhotos.services.
 */
export function toDateOnly(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, 10);
}
