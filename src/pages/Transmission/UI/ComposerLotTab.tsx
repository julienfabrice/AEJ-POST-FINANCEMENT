import { useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { money } from "@/helpers/money"
import { useComposerLot } from '../hooks/useComposerLot'

export function ComposerLotTab() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    guichets,
    organismes,
    dossiers,
    selectedIds,
    toggleDossier,
    handleSelectAll,
    isImporting,
    handleImportExcel,
    form,
    setFormField,
    isSubmitting,
    handleTransmettre,
  } = useComposerLot()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImportExcel(file)
          e.target.value = ''
        }}
      />

      <Card className="flex flex-col border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05)] lg:h-[calc(100vh-220px)] h-auto min-h-[500px]">
        <div className="flex flex-col gap-4 p-4 border-b border-[#EEF2F7]">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#131C29]">Dossiers à répartir</h3>
            <span className="bg-[#FEF5E6] text-[#E7722B] px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold">
              {dossiers.length} éligible(s)
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[12px] text-[#5A6B80]">Guichet</Label>
            <Select value={form.guichet_id ? String(form.guichet_id) : undefined} onValueChange={(v) => setFormField('guichet_id', Number(v))}>
              <SelectTrigger className="h-9 text-[13px]">
                <SelectValue placeholder="Sélectionner un guichet" />
              </SelectTrigger>
              <SelectContent>
                {guichets.map((g) => (
                  <SelectItem key={g.id} value={String(g.id)} className="text-[13px]">{g.libelle}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 text-[12px] gap-1.5 bg-[#fafbfd]"
              disabled={isImporting}
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              {isImporting ? 'Import en cours…' : 'Importer la répartition'}
            </Button>
            <Button variant="outline" className="h-8 text-[12px]" onClick={handleSelectAll} disabled={dossiers.length === 0}>
              Tout sélectionner
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-0">
          {dossiers.length === 0 && !isImporting && (
            <p className="text-[13px] text-[#8595A8] p-4">
              Importe un fichier Excel de répartition pour lister les dossiers correspondants.
            </p>
          )}
          {dossiers.map((d) => (
            <label
              key={d.microProjetId}
              className="flex items-center gap-3 p-3 border-b border-[#EEF2F7] hover:bg-[#fafbfe] cursor-pointer transition-colors"
            >
              <Checkbox
                checked={selectedIds.has(d.microProjetId)}
                onCheckedChange={() => toggleDossier(d.microProjetId)}
                className="data-[state=checked]:bg-[#2D6BD4] data-[state=checked]:border-[#2D6BD4]"
              />
              <div className="flex-1 min-w-0">
                <b className="block text-[13px] text-[#131C29] truncate">
                  {d.code} — {d.titre}
                </b>
                <span className="block text-[12px] text-[#5A6B80] truncate mt-0.5">
                  {d.promoteurNom}
                </span>
              </div>
              <span className="text-[13.5px] font-mono font-semibold text-[#131C29] shrink-0">
                {money(d.montant)}
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
            <Select value={form.organisme_id ? String(form.organisme_id) : undefined} onValueChange={(v) => setFormField('organisme_id', Number(v))}>
              <SelectTrigger className="h-9 text-[13px]">
                <SelectValue placeholder="Sélectionner un partenaire" />
              </SelectTrigger>
              <SelectContent>
                {organismes.map((o) => (
                  <SelectItem key={o.id} value={String(o.id)} className="text-[13px]">{o.sigle || o.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px] text-[#5A6B80]">Code du lot *</Label>
            <Input className="h-9 text-[13px]" value={form.code} onChange={(e) => setFormField('code', e.target.value)} placeholder="Ex. LOT-AGR-2026-005" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px] text-[#5A6B80]">Titre du lot *</Label>
            <Input className="h-9 text-[13px]" value={form.titre} onChange={(e) => setFormField('titre', e.target.value)} placeholder="Ex. Transmission lot AGR Classique" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px] text-[#5A6B80]">Fichier Excel de répartition</Label>
            <Input className="h-9 text-[13px] bg-slate-50" value={form.fichier_repartition} readOnly placeholder="Importé automatiquement" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px] text-[#5A6B80]">Courrier (chemin du fichier)</Label>
            <Input className="h-9 text-[13px]" value={form.fichier_courrier} onChange={(e) => setFormField('fichier_courrier', e.target.value)} placeholder="/storage/courriers/courrier_transmission.pdf" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[12px] text-[#5A6B80]">Réf. du courrier</Label>
              <Input className="h-9 text-[13px]" value={form.reference_courrier} onChange={(e) => setFormField('reference_courrier', e.target.value)} placeholder="CRT-2026-0144" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] text-[#5A6B80]">Date de transmission</Label>
              <Input type="date" className="h-9 text-[13px]" value={form.date_transmission} onChange={(e) => setFormField('date_transmission', e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px] text-[#5A6B80]">Réf. convention</Label>
            <Input className="h-9 text-[13px]" value={form.reference_convention} onChange={(e) => setFormField('reference_convention', e.target.value)} placeholder="CONV-2026-0075" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[12px] text-[#5A6B80]">Taux couverture (%)</Label>
              <Input type="number" className="h-9 text-[13px]" value={form.taux_recouvrement} onChange={(e) => setFormField('taux_recouvrement', e.target.valueAsNumber || 0)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] text-[#5A6B80]">Différé (mois)</Label>
              <Input type="number" className="h-9 text-[13px]" value={form.duree_differee} onChange={(e) => setFormField('duree_differee', e.target.valueAsNumber || 0)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px] text-[#5A6B80]">Durée rembt. (mois)</Label>
            <Input type="number" className="h-9 text-[13px]" value={form.duree_remboursement} onChange={(e) => setFormField('duree_remboursement', e.target.valueAsNumber || 0)} />
          </div>

          <Button
            className="w-full mt-2 bg-[#131C29] hover:bg-[#2D6BD4] transition-colors gap-2 text-[13px] font-semibold h-10 text-white"
            disabled={isSubmitting || selectedIds.size === 0}
            onClick={handleTransmettre}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            {isSubmitting ? 'Transmission en cours…' : `Transmettre le lot (${selectedIds.size})`}
          </Button>
        </div>
      </Card>
    </div>
  )
}