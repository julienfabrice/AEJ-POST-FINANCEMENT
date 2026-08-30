/**
 * FormatMoney — affiche un montant en francs CFA
 */
export function money(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' F'
}
