import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'
import { MOCK_ANNEE_REGION } from '@/mock/dashboard'
import { MOCK_PROJETS } from '@/mock'

export function AdminDashboardBottom() {
  const getStatusStyle = (statut: string) => {
    switch (statut) {
      case 'SOUMISSION': return 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-0'
      case 'ANALYSE': return 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-0'
      case 'CERTIFICATION': return 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-0'
      case 'FINANCEMENT': return 'bg-[#FBEADE] text-[#C85E18] hover:bg-[#FBEADE] border-0'
      case 'DECAISSEMENT': return 'bg-[#E3F6E7] text-[#178A2E] hover:bg-[#E3F6E7] border-0'
      case 'SUIVI': return 'bg-blue-50 text-blue-600 hover:bg-blue-50 border-0'
      case 'REMBOURSEMENT': return 'bg-green-50 text-green-700 hover:bg-green-50 border-0'
      default: return 'bg-slate-100 text-slate-700 border-0'
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-[#E5EAF1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-[7px]">
        <CardHeader className="border-b border-[#EEF2F7] py-3 px-4">
          <CardTitle className="text-[14px] font-bold text-[#131C29]">Montant financé par année et par région</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead className="bg-[#f8fafc] text-[#5A6B80]">
              <tr>
                <th className="py-2 px-4 font-semibold border-b border-[#EEF2F7]">Année</th>
                <th className="py-2 px-4 font-semibold border-b border-[#EEF2F7]">Région</th>
                <th className="py-2 px-4 font-semibold border-b border-[#EEF2F7]">Montant financé</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ANNEE_REGION.map((row, i) => (
                <tr key={i} className="border-b border-[#EEF2F7] hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-4 font-mono text-[#5A6B80]">{row.annee}</td>
                  <td className="py-2.5 px-4 font-bold text-[#E7722B]">{row.region}</td>
                  <td className="py-2.5 px-4 font-mono text-[#131C29]">{row.montant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="border-[#E5EAF1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-[7px]">
        <CardHeader className="border-b border-[#EEF2F7] py-3 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-[14px] font-bold text-[#131C29]">Dossiers récents</CardTitle>
          <a href="#" className="flex items-center text-xs font-semibold text-[#5A6B80] hover:text-[#131C29] transition-colors">
            Tout voir
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead className="bg-[#f8fafc] text-[#5A6B80]">
              <tr>
                <th className="py-2 px-4 font-semibold border-b border-[#EEF2F7]">Projet</th>
                <th className="py-2 px-4 font-semibold border-b border-[#EEF2F7]">Porteur</th>
                <th className="py-2 px-4 font-semibold border-b border-[#EEF2F7]">Montant</th>
                <th className="py-2 px-4 font-semibold border-b border-[#EEF2F7]">Statut</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PROJETS.slice(0, 5).map((p, i) => (
                <tr key={i} className="border-b border-[#EEF2F7] hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="py-2.5 px-4">
                    <b className="text-[#131C29] block mb-0.5">{p.titre}</b>
                    <div className="font-mono text-[11px] text-[#5A6B80]">{p.dispositif}</div>
                  </td>
                  <td className="py-2.5 px-4 text-[#5A6B80]">{p.promoteur}</td>
                  <td className="py-2.5 px-4 font-mono text-[#131C29]">{p.montant} F</td>
                  <td className="py-2.5 px-4">
                    <Badge className={getStatusStyle(p.statut)}>{p.statut}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
