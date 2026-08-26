import { remboursementServices } from '@/services/remboursements.services'

const formatMontant = (n: number) => n.toLocaleString('fr-FR')

export function RemboursementsKpiCards() {
  const { data: remboursements = [] } = remboursementServices.useGetAll()

  const du = remboursements.reduce((a, r) => a + r.montant_echu, 0)
  const paye = remboursements.reduce((a, r) => a + r.montant_paye, 0)
  const taux = du ? Math.round((paye / du) * 100) : 0
  const impayees = remboursements.filter((r) => r.statut === 'NON_PAYE').length

  const cards = [
    { label: 'Total dû', value: `${formatMontant(du)} F` },
    { label: 'Total encaissé', value: `${formatMontant(paye)} F`, color: 'text-emerald-600' },
    { label: 'Taux de recouvrement', value: `${taux}%` },
    { label: 'Échéances impayées', value: `${impayees}`, color: 'text-red-600' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white border border-[#E5EAF1] rounded-[11px] p-4">
          <div className="text-xs text-[#8595A8] mb-1">{c.label}</div>
          <div className={`text-2xl font-bold text-[#131C29] ${c.color ?? ''}`}>{c.value}</div>
        </div>
      ))}
    </div>
  )
}
