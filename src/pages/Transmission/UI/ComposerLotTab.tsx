import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { money } from "@/helpers/money"
import {
  MOCK_PROJETS_A_REPARTIR,
  MOCK_PARTENAIRES_OPTS,
  MOCK_DISPOSITIFS_OPTS,
} from '@/mock/transmission.mock'

interface ComposerLotTabProps {
  selectedGuichet: string
  setSelectedGuichet: (val: string) => void
  selectedDossiers: Set<string>
  toggleDossier: (id: string) => void
  handleSelectAll: () => void
}

export function ComposerLotTab({
  selectedGuichet,
  setSelectedGuichet,
  selectedDossiers,
  toggleDossier,
  handleSelectAll,
}: ComposerLotTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">
      <Card className="flex flex-col border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05)] lg:h-[calc(100vh-220px)] h-auto min-h-[500px]">
        <div className="flex flex-col gap-4 p-4 border-b border-[#EEF2F7]">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#131C29]">Dossiers à répartir</h3>
            <span className="bg-[#FEF5E6] text-[#E7722B] px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold">
              {MOCK_PROJETS_A_REPARTIR.length} éligible(s)
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[12px] text-[#5A6B80]">Guichet</Label>
            <Select value={selectedGuichet} onValueChange={setSelectedGuichet}>
              <SelectTrigger className="h-9 text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOCK_DISPOSITIFS_OPTS.map(d => (
                  <SelectItem key={d.value} value={d.value} className="text-[13px]">{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8 text-[12px] gap-1.5 bg-[#fafbfd]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Importer la répartition
            </Button>
            <Button variant="outline" className="h-8 text-[12px]" onClick={handleSelectAll}>
              Tout sélectionner
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-0">
          {MOCK_PROJETS_A_REPARTIR.map((p) => (
            <label
              key={p.id}
              className="flex items-center gap-3 p-3 border-b border-[#EEF2F7] hover:bg-[#fafbfe] cursor-pointer transition-colors"
            >
              <Checkbox
                checked={selectedDossiers.has(p.id)}
                onCheckedChange={() => toggleDossier(p.id)}
                className="data-[state=checked]:bg-[#2D6BD4] data-[state=checked]:border-[#2D6BD4]"
              />
              <div className="flex-1 min-w-0">
                <b className="block text-[13px] text-[#131C29] truncate">
                  {p.code} — {p.titre}
                </b>
                <span className="block text-[12px] text-[#5A6B80] truncate mt-0.5">
                  {p.jeune_nom} · {p.agence}
                  {selectedGuichet === 'wf-agr' && (
                    <span>
                      {' · '}
                      {p.plan_affaires ? 'plan d\'affaires joint' : 'plan d\'affaires manquant'}
                    </span>
                  )}
                </span>
              </div>
              <span className="text-[13.5px] font-mono font-semibold text-[#131C29] shrink-0">
                {money(p.montant)}
              </span>
            </label>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05)] p-5">
        <h3 className="text-[14px] font-bold text-[#131C29] mb-5">Courrier de transmission</h3>

        <div className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label className="text-[12px] text-[#5A6B80]">Partenaire financier *</Label>
            <Select defaultValue={MOCK_PARTENAIRES_OPTS[0].value}>
              <SelectTrigger className="h-9 text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOCK_PARTENAIRES_OPTS.map(o => (
                  <SelectItem key={o.value} value={o.value} className="text-[13px]">{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px] text-[#5A6B80]">Référence du lot</Label>
            <Input className="h-9 text-[13px]" defaultValue={`LOT-${MOCK_DISPOSITIFS_OPTS.find(d => d.value === selectedGuichet)?.code}-2024-001`} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px] text-[#5A6B80]">Fichier Excel de répartition</Label>
            <Input className="h-9 text-[13px]" defaultValue={`repartition_${MOCK_DISPOSITIFS_OPTS.find(d => d.value === selectedGuichet)?.code?.toLowerCase()}.xlsx`} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px] text-[#5A6B80]">Courrier (pièce jointe)</Label>
            <Input className="h-9 text-[13px]" defaultValue="courrier_transmission.pdf" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[12px] text-[#5A6B80]">Réf. du courrier *</Label>
              <Input className="h-9 text-[13px]" defaultValue="CRT-2024-0150" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] text-[#5A6B80]">Date de transmission</Label>
              <Input type="date" className="h-9 text-[13px]" defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px] text-[#5A6B80]">Titre du courrier</Label>
            <Input className="h-9 text-[13px]" defaultValue={`Transmission lot ${MOCK_DISPOSITIFS_OPTS.find(d => d.value === selectedGuichet)?.code}`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[12px] text-[#5A6B80]">Taux couverture (%)</Label>
              <Input type="number" className="h-9 text-[13px]" defaultValue={80} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] text-[#5A6B80]">Différé (mois)</Label>
              <Input type="number" className="h-9 text-[13px]" defaultValue={3} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[12px] text-[#5A6B80]">Durée rembt. (mois)</Label>
              <Input type="number" className="h-9 text-[13px]" defaultValue={24} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] text-[#5A6B80]">Réf. convention</Label>
              <Input className="h-9 text-[13px]" defaultValue="CONV-2024-0075" />
            </div>
          </div>

          <div className="bg-[#fafbfd] border border-dashed border-[#D0D7E2] rounded p-3 text-[12px] text-[#5A6B80] flex gap-2 items-start mt-2">
            <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span>Modèles « courrier de transmission » et « fichier Excel de répartition » <em>— à fournir par l'AEJ</em></span>
          </div>

          <Button className="w-full mt-2 bg-[#131C29] hover:bg-[#2D6BD4] transition-colors gap-2 text-[13px] font-semibold h-10 text-white">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Transmettre le lot au partenaire
          </Button>
        </div>
      </Card>
    </div>
  )
}
