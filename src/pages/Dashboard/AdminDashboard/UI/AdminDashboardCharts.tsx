import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MOCK_ETAPES_BARS, MOCK_REGIONS_HBARS, MOCK_AGENCES_HBARS, MOCK_SUIVI_TERRAIN } from '@/mock/dashboard'

export function AdminDashboardCharts() {
  const maxEtape = Math.max(...MOCK_ETAPES_BARS.map(s => s.value))
  const maxRegion = Math.max(...MOCK_REGIONS_HBARS.map(s => parseInt(s.montant)))
  const maxAgence = Math.max(...MOCK_AGENCES_HBARS.map(s => parseInt(s.montant)))

  return (
    <div className="flex flex-col gap-6">
      {/* Ligne 1 : Etapes et Régions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-[#E5EAF1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-[7px]">
          <CardHeader className="border-b border-[#EEF2F7] py-3 px-4">
            <CardTitle className="text-[14px] font-bold text-[#131C29]">Micro-projets par étape du parcours</CardTitle>
          </CardHeader>
          <CardContent className="p-4 overflow-x-auto">
            <div className="flex items-end gap-[10px] h-[170px] pt-[10px] min-w-[500px]">
              {MOCK_ETAPES_BARS.map((item, idx) => {
                const height = 8 + (item.value / maxEtape) * 88
                const isGreen = ['SUIVI', 'REMBOURSEMENT'].includes(item.label)
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-[7px] h-full justify-end group">
                    <span className="text-[11px] font-bold text-[#131C29]">{item.value}</span>
                    <div 
                      className="w-full max-w-[38px] rounded-t-[6px] transition-all group-hover:opacity-80" 
                      style={{ 
                        height: `${height}%`,
                        background: isGreen ? 'linear-gradient(#20A83A, #178A2E)' : 'linear-gradient(#E7722B, #C85E18)'
                      }}
                    />
                    <span className="text-[11px] text-[#5A6B80] text-center leading-[1.2] w-full break-words">
                      {item.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5EAF1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-[7px]">
          <CardHeader className="border-b border-[#EEF2F7] py-3 px-4">
            <CardTitle className="text-[14px] font-bold text-[#131C29]">Projets financés par région</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col gap-[11px]">
              {MOCK_REGIONS_HBARS.map((item, idx) => {
                const width = (parseInt(item.montant) / maxRegion) * 100
                return (
                  <div key={idx} className="grid grid-cols-[130px_1fr_60px] items-center gap-[12px] text-[12.5px]">
                    <span className="truncate font-medium text-[#5A6B80]">{item.label}</span>
                    <div className="bg-[#eef1f6] rounded-[20px] h-[11px] overflow-hidden">
                      <div className="h-full rounded-[20px] transition-all" style={{ width: `${width}%`, background: 'linear-gradient(90deg, #E7722B, #20A83A)' }} />
                    </div>
                    <span className="text-right font-bold font-mono text-[#131C29]">
                      {item.nb} · {item.montant}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ligne 2 : Agences et Suivi Terrain */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-[#E5EAF1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-[7px]">
          <CardHeader className="border-b border-[#EEF2F7] py-3 px-4">
            <CardTitle className="text-[14px] font-bold text-[#131C29]">Projets financés par agence</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col gap-[11px]">
              {MOCK_AGENCES_HBARS.map((item, idx) => {
                const width = (parseInt(item.montant) / maxAgence) * 100
                return (
                  <div key={idx} className="grid grid-cols-[130px_1fr_60px] items-center gap-[12px] text-[12.5px]">
                    <span className="truncate font-medium text-[#5A6B80]">{item.label}</span>
                    <div className="bg-[#eef1f6] rounded-[20px] h-[11px] overflow-hidden">
                      <div className="h-full rounded-[20px] transition-all" style={{ width: `${width}%`, background: 'linear-gradient(90deg, #E7722B, #20A83A)' }} />
                    </div>
                    <span className="text-right font-bold font-mono text-[#131C29]">
                      {item.nb} · {item.montant}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5EAF1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-[7px]">
          <CardHeader className="border-b border-[#EEF2F7] py-3 px-4">
            <CardTitle className="text-[14px] font-bold text-[#131C29]">Situation du suivi terrain</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px]">
              <div className="bg-white border border-[#E5EAF1] rounded-[7px] py-4 px-[17px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="text-[12px] text-[#5A6B80] font-medium leading-tight">En bonne voie</div>
                <div className="font-extrabold text-[26px] tracking-[-0.02em] text-[#20A83A] mt-[2px] leading-tight">{MOCK_SUIVI_TERRAIN.bonneVoie}</div>
              </div>
              <div className="bg-white border border-[#E5EAF1] rounded-[7px] py-4 px-[17px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="text-[12px] text-[#5A6B80] font-medium leading-tight">En difficulté</div>
                <div className="font-extrabold text-[26px] tracking-[-0.02em] text-[#D6453B] mt-[2px] leading-tight">{MOCK_SUIVI_TERRAIN.difficulte}</div>
              </div>
              <div className="bg-white border border-[#E5EAF1] rounded-[7px] py-4 px-[17px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="text-[12px] text-[#5A6B80] font-medium leading-tight">Non visités</div>
                <div className="font-extrabold text-[26px] tracking-[-0.02em] text-[#5A6B80] mt-[2px] leading-tight">{MOCK_SUIVI_TERRAIN.nonVisites}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
