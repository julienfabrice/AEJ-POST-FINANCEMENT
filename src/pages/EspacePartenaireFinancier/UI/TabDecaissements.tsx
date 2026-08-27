import { Banknote } from 'lucide-react'
import { MOCK_DECAISSEMENTS } from '@/mock/espacePartenaireFinancier.mock'

export function TabDecaissements() {
  if (MOCK_DECAISSEMENTS.length === 0) {
    return (
      <div className="text-center py-14 text-[#5A6B80]">
        <Banknote size={40} className="mx-auto mb-3 opacity-30" />
        <b className="block text-[#131C29] text-[15px] mb-1 font-['Archivo']">
          Aucun décaissement enregistré
        </b>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#E5EAF1] rounded-[11px] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)] overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {['Dossier', 'Agence', 'Numéro', 'Libellé', 'Montant', 'Date', 'Référence'].map((h) => (
              <th
                key={h}
                className="text-left text-[11px] uppercase tracking-[.05em] text-[#8595A8] font-bold px-[14px] py-[11px] border-b border-[#E5EAF1] bg-[#fafbfd] whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MOCK_DECAISSEMENTS.map((d) => (
            <tr key={d.id} className="hover:bg-[#fafbfe] transition-colors">
              <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px]">
                <b className="font-semibold text-[#131C29]">{d.code}</b>
                <span className="block text-[12px] text-[#5A6B80]">{d.promoteur}</span>
              </td>
              <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                {d.agence}
              </td>
              <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                <span className="w-[26px] h-[26px] rounded-[8px] bg-[#20A83A] text-white grid place-items-center text-[12px] font-bold inline-grid">
                  {d.num}
                </span>
              </td>
              <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#131C29] max-w-[200px] truncate">
                {d.libelle}
              </td>
              <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono font-semibold text-[#131C29]">
                {new Intl.NumberFormat('fr-FR').format(d.montant)} F
              </td>
              <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                {d.date}
              </td>
              <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono text-[#5A6B80]">
                {d.reference}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
