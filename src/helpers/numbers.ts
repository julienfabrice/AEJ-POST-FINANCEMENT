const GROUP_SEP = ' ';

/** Reduce any string/number to a bare numeric string: digits + one `.` decimal. */
export function parseNumberInput(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  // Comma → dot, then keep only digits and dots.
  const cleaned = String(value).replace(/,/g, '.').replace(/[^\d.]/g, '');
  const firstDot = cleaned.indexOf('.');
  if (firstDot === -1) return cleaned;
  // Keep only the first dot (drop any extra ones).
  return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '');
}

/** Numeric value from a formatted/raw string, or `null` when empty/invalid. */
export function toNumber(value: string | number | null | undefined): number | null {
  const bare = parseNumberInput(value);
  if (bare === '' || bare === '.') return null;
  const n = Number(bare);
  return Number.isFinite(n) ? n : null;
}

/** Group an integer-digits string into thousands, e.g. "1000000" → "1 000 000". */
function groupThousands(intDigits: string): string {
  return intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, GROUP_SEP);
}


export function formatNumber(value: string | number | null | undefined): string {
  const bare = parseNumberInput(value);
  if (bare === '') return '';
  const [int, dec] = bare.split('.');
  const grouped = groupThousands(int || '0');
  return dec !== undefined ? `${grouped},${dec}` : grouped;
}


// Utilisble pour l'affichage de montnts
export const formatMontant = (montant: string | null , devise : string | null) => {
  if (!montant) return null
  const value = Number(montant)
  if (Number.isNaN(value)) return montant
  return `${formatNumber(value)} ${devise ?? 'FCFA'}`
}