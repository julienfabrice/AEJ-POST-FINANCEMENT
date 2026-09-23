import { useConfigStore } from '@/store/useConfigStore'

/**
 * FormatMoney — affiche un montant avec la devise configurée
 */
export function money(amount: number): string {
  const currency = useConfigStore.getState().sigle_monnaie_pays
  return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + currency
}
