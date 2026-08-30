import { Download, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRapports, type ReportType } from './hooks/useRapports'
import { DonutChart } from './components/DonutChart'
import { HBarChart } from './components/HBarChart'
import { TrendBars } from './components/TrendBars'
import { money } from '@/helpers/money'
import { MOCK_REPORTS, CHART_COLORS } from '@/mock/rapports.mock'

export function RapportEtAnalysePage() {
  const { 
    filters, setters, reportData, rows, totalN, totalM, donutData, barData, trendData 
  } = useRapports()

  const handleExportCSV = () => {
    const csv = `${reportData.dim};Nb projets;Montant engage (FCFA)\n` + 
      rows.map(r => `${r.k};${r.n};${r.m}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rapport_${filters.type}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4 pb-12">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-[22px] font-extrabold text-[#131C29] m-0">Rapports & analyses</h1>
      </div>
      <p className="text-[14.5px] text-[#5A6B80] mb-6">
        Tableaux de bord analytiques adaptés à votre profil.
      </p>

      {/* FILTERS */}
      <Card className="mb-4 border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.04)] p-0 overflow-hidden">
        <div className="p-4 bg-white">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[220px]">
              <label className="block text-[11px] font-bold text-[#5A6B80] uppercase tracking-wide mb-1.5">Type de rapport</label>
              <select 
                className="w-full h-[38px] bg-[#f8fafc] border border-[#E5EAF1] rounded-[7px] px-3 text-[13px] font-medium text-[#131C29] outline-none focus:border-[#2D6BD4]"
                value={filters.type}
                onChange={(e) => setters.setType(e.target.value as ReportType)}
              >
                {Object.entries(MOCK_REPORTS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div className="min-w-[160px]">
              <label className="block text-[11px] font-bold text-[#5A6B80] uppercase tracking-wide mb-1.5">Guichet</label>
              <select 
                className="w-full h-[38px] bg-[#f8fafc] border border-[#E5EAF1] rounded-[7px] px-3 text-[13px] font-medium text-[#131C29] outline-none focus:border-[#2D6BD4]"
                value={filters.dispositif}
                onChange={(e) => setters.setDispositif(e.target.value)}
              >
                <option value="">Tous</option>
                <option value="agr">AGR</option>
                <option value="mpe">MPE</option>
              </select>
            </div>
            <div className="min-w-[160px]">
              <label className="block text-[11px] font-bold text-[#5A6B80] uppercase tracking-wide mb-1.5">Région</label>
              <select 
                className="w-full h-[38px] bg-[#f8fafc] border border-[#E5EAF1] rounded-[7px] px-3 text-[13px] font-medium text-[#131C29] outline-none focus:border-[#2D6BD4]"
                value={filters.region}
                onChange={(e) => setters.setRegion(e.target.value)}
              >
                <option value="">Toutes</option>
                <option value="abj">Abidjan</option>
                <option value="bou">Bouaké</option>
              </select>
            </div>
            <div className="min-w-[160px]">
              <label className="block text-[11px] font-bold text-[#5A6B80] uppercase tracking-wide mb-1.5">Statut</label>
              <select 
                className="w-full h-[38px] bg-[#f8fafc] border border-[#E5EAF1] rounded-[7px] px-3 text-[13px] font-medium text-[#131C29] outline-none focus:border-[#2D6BD4]"
                value={filters.statut}
                onChange={(e) => setters.setStatut(e.target.value)}
              >
                <option value="">Tous</option>
                <option value="EN_EXPLOITATION">En exploitation</option>
                <option value="SINISTRE">Sinistré</option>
              </select>
            </div>
            <div className="flex-1 min-w-[20px]" />
            <Button 
              variant="outline" 
              onClick={handleExportCSV}
              className="h-[38px] bg-white border border-[#E5EAF1] text-[#131C29] text-[13px] font-semibold gap-2 rounded-[7px] shadow-sm hover:bg-[#f8fafc]"
            >
              <Download size={15} className="text-[#5A6B80]" />
              Exporter CSV
            </Button>
            <Button className="h-[38px] bg-[#E7722B] hover:bg-[#C85E18] text-white shadow-[0_4px_12px_rgba(238,123,26,.28)] border-none text-[13px] font-semibold gap-2 rounded-[7px]">
              <FileText size={15} />
              Générer le rapport
            </Button>
          </div>
        </div>
      </Card>

      {/* TOP ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className="border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.04)] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#E5EAF1] bg-white">
            <h3 className="text-[14px] font-bold text-[#131C29] m-0">{reportData.label}</h3>
          </div>
          <div className="p-5 bg-white">
            <HBarChart data={barData} />
          </div>
        </Card>

        <Card className="border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.04)] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#E5EAF1] bg-white">
            <h3 className="text-[14px] font-bold text-[#131C29] m-0">Répartition (part du montant)</h3>
          </div>
          <div className="p-5 bg-white">
            <DonutChart data={donutData} total={totalM} />
          </div>
        </Card>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.04)] overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-[#E5EAF1] bg-white flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#131C29] m-0">Détail chiffré</h3>
            <span className="text-[12.5px] text-[#5A6B80]">{rows.length} lignes</span>
          </div>
          <div className="bg-white overflow-x-auto flex-1 rounded-b-xl">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="px-[14px] py-[11px] text-[11px] tracking-wide uppercase text-[#8595A8] font-bold border-b border-[#E5EAF1] bg-[#fafbfd] whitespace-nowrap">
                    {reportData.dim}
                  </th>
                  <th className="px-[14px] py-[11px] text-[11px] tracking-wide uppercase text-[#8595A8] font-bold border-b border-[#E5EAF1] bg-[#fafbfd] whitespace-nowrap">
                    Nb projets
                  </th>
                  <th className="px-[14px] py-[11px] text-[11px] tracking-wide uppercase text-[#8595A8] font-bold border-b border-[#E5EAF1] bg-[#fafbfd] whitespace-nowrap">
                    Montant engagé
                  </th>
                  <th className="px-[14px] py-[11px] text-[11px] tracking-wide uppercase text-[#8595A8] font-bold border-b border-[#E5EAF1] bg-[#fafbfd] whitespace-nowrap">
                    Part
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="hover:bg-[#fafbfe] transition-colors">
                    <td className="px-[14px] py-[12px] border-b border-[#E5EAF1] text-[13px] align-middle">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-[9px] h-[9px] rounded-[2px] inline-block flex-none"
                          style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                        <b className="font-semibold text-[#131C29]">{r.k}</b>
                      </div>
                    </td>
                    <td className="px-[14px] py-[12px] border-b border-[#E5EAF1] text-[13px] font-mono align-middle">
                      {r.n}
                    </td>
                    <td className="px-[14px] py-[12px] border-b border-[#E5EAF1] text-[13px] font-mono align-middle">
                      {money(r.m)}
                    </td>
                    <td className="px-[14px] py-[12px] border-b border-[#E5EAF1] text-[13px] font-mono text-[#5A6B80] align-middle">
                      {totalM ? Math.round((r.m / totalM) * 100) : 0}%
                    </td>
                  </tr>
                ))}
                <tr className="bg-[#fafbfd]">
                  <td className="px-[14px] py-[12px] border-b border-[#E5EAF1] text-[13px] align-middle font-bold text-[#131C29]">
                    Total général
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#E5EAF1] text-[13px] align-middle font-bold font-mono text-[#131C29]">
                    {totalN}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#E5EAF1] text-[13px] align-middle font-bold font-mono text-[#131C29]">
                    {money(totalM)}
                  </td>
                  <td className="px-[14px] py-[12px] border-b border-[#E5EAF1] text-[13px] align-middle font-mono text-[#131C29]">
                    100%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.04)] overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-[#E5EAF1] bg-white">
            <h3 className="text-[14px] font-bold text-[#131C29] m-0">Tendance des soumissions par mois</h3>
          </div>
          <div className="p-5 bg-white flex-1">
            <TrendBars data={trendData} />
          </div>
        </Card>
      </div>
    </div>
  )
}
