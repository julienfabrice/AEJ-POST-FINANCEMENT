import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { money } from "@/helpers/money"
import { organismeServices } from '@/services/organismes.services'
import { Upload, FileSpreadsheet } from 'lucide-react'
import { ImportRepartitionDialog } from './ImportRepartitionDialog'
import { useComposerLotTab } from '../hooks/useComposerLotTab'
import { DocumentUploadOrPicker } from '@/components/generics/DocumentUploadOrPicker'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import type { DISPOSITIF_T } from '@/types'

interface ComposerLotTabProps {
  selectedGuichet: string
  setSelectedGuichet: (val: string) => void
  selectedDossiers: Set<string>
  toggleDossier: (id: string) => void
  handleSelectAll: () => void
  projetsEligibles: MICRO_PROJET_T[]
  isLoadingProjets: boolean
  dispositifs: DISPOSITIF_T[]
  isLoadingDispositifs: boolean
  handleSubmit: (payload: any) => void
  isSubmitting: boolean
}

export function ComposerLotTab({
  selectedGuichet,
  setSelectedGuichet,
  selectedDossiers,
  toggleDossier,
  handleSelectAll,
  projetsEligibles,
  isLoadingProjets,
  dispositifs,
  isLoadingDispositifs,
  handleSubmit,
  isSubmitting,
}: ComposerLotTabProps) {
  const { data: organismes = [], isLoading: isLoadingOrganismes } = organismeServices.useGetAll()

  const {
    form,
    importOpen,
    setImportOpen,
    onSubmit,
    handleImported,
    downloadCanvas,
  } = useComposerLotTab(
    selectedGuichet,
    dispositifs,
    projetsEligibles,
    selectedDossiers,
    toggleDossier,
    handleSubmit
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">
      <Card className="flex flex-col border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05)] lg:h-[calc(100vh-220px)] h-auto min-h-[500px]">
        <div className="flex flex-col gap-4 p-4 border-b border-[#EEF2F7]">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#131C29]">Dossiers à répartir</h3>
            <span className="bg-[#FEF5E6] text-[#E7722B] px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold">
              {projetsEligibles.length} éligible(s)
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[12px] text-[#5A6B80]">Guichet</Label>
            <Select value={selectedGuichet} onValueChange={setSelectedGuichet} disabled={isLoadingDispositifs}>
              <SelectTrigger className="h-9 text-[13px]">
                <SelectValue placeholder={isLoadingDispositifs ? "Chargement..." : "Sélectionner un guichet"} />
              </SelectTrigger>
              <SelectContent>
                {dispositifs.map(d => (
                  <SelectItem key={d.id} value={d.id.toString()} className="text-[13px]">
                    {d.intitule || d.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8 text-[12px] gap-1.5 bg-[#fafbfd]" onClick={() => setImportOpen(true)}>
              <Upload className="w-3.5 h-3.5" />
              Importer la répartition
            </Button>
            <Button variant="outline" className="h-8 text-[12px] gap-1.5 bg-[#fafbfd]" onClick={() => downloadCanvas()}>
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Télécharger le modèle
            </Button>
            <Button variant="outline" className="h-8 text-[12px]" onClick={handleSelectAll}>
              Tout sélectionner
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-0">
          {isLoadingProjets ? (
            <div className="p-4 text-center text-slate-500 text-[13px]">Chargement des dossiers...</div>
          ) : projetsEligibles.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-[13px]">Aucun dossier en attente pour ce guichet.</div>
          ) : (
            projetsEligibles.map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-3 p-3 border-b border-[#EEF2F7] hover:bg-[#fafbfe] cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={selectedDossiers.has(p.id.toString())}
                  onCheckedChange={() => toggleDossier(p.id.toString())}
                  className="data-[state=checked]:bg-[#2D6BD4] data-[state=checked]:border-[#2D6BD4]"
                />
                <div className="flex-1 min-w-0">
                  <b className="block text-[13px] text-[#131C29] truncate">
                    {p.code} — {p.intitule}
                  </b>
                  <span className="block text-[12px] text-[#5A6B80] truncate mt-0.5">
                    {p.promoteur?.nom} {p.promoteur?.prenom} · {p.agence?.nom}
                  </span>
                </div>
                <span className="text-[13.5px] font-mono font-semibold text-[#131C29] shrink-0">
                  {money(Number(p.montant_total) || 0)}
                </span>
              </label>
            ))
          )}
        </div>
      </Card>

      <Card className="flex flex-col border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05)] p-5">
        <h3 className="text-[14px] font-bold text-[#131C29] mb-5">Courrier de transmission</h3>

        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="organisme_id"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[12px] text-[#5A6B80]">Partenaire financier *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-[13px]">
                        <SelectValue placeholder={isLoadingOrganismes ? "Chargement..." : "Sélectionner..."} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organismes.map(o => (
                        <SelectItem key={o.id} value={o.id.toString()} className="text-[13px]">
                          {o.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[12px] text-[#5A6B80]">Référence du lot</FormLabel>
                  <FormControl>
                    <Input className="h-9 text-[13px]" {...field} />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fichier_repartition"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[12px] text-[#5A6B80]">Fichier Excel de répartition</FormLabel>
                  <FormControl>
                    <DocumentUploadOrPicker
                      value={field.value}
                      onChange={field.onChange}
                      folder="Répartition"
                      accept=".xlsx,.xls"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courrier_fichier"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[12px] text-[#5A6B80]">Courrier (pièce jointe)</FormLabel>
                  <FormControl>
                    <DocumentUploadOrPicker
                      value={field.value}
                      onChange={field.onChange}
                      folder="Courriers"
                      accept=".pdf,.doc,.docx"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="courrier_reference"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[12px] text-[#5A6B80]">Réf. du courrier *</FormLabel>
                    <FormControl>
                      <Input className="h-9 text-[13px]" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_transmission"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[12px] text-[#5A6B80]">Date de transmission</FormLabel>
                    <FormControl>
                      <Input type="date" className="h-9 text-[13px]" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="titre_courrier"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[12px] text-[#5A6B80]">Titre du courrier</FormLabel>
                  <FormControl>
                    <Input className="h-9 text-[13px]" {...field} />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="taux_couverture"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[12px] text-[#5A6B80]">Taux couverture (%)</FormLabel>
                    <FormControl>
                      <Input type="number" className="h-9 text-[13px]" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duree_differe"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[12px] text-[#5A6B80]">Différé (mois)</FormLabel>
                    <FormControl>
                      <Input type="number" className="h-9 text-[13px]" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="duree_remboursement"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[12px] text-[#5A6B80]">Durée rembt. (mois)</FormLabel>
                    <FormControl>
                      <Input type="number" className="h-9 text-[13px]" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reference_convention"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[12px] text-[#5A6B80]">Réf. convention</FormLabel>
                    <FormControl>
                      <Input className="h-9 text-[13px]" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit"
              className="w-full mt-2 bg-[#131C29] hover:bg-[#2D6BD4] transition-colors gap-2 text-[13px] font-semibold h-10 text-white"
              disabled={isSubmitting}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              {isSubmitting ? 'Transmission en cours...' : 'Transmettre le lot au partenaire'}
            </Button>
          </form>
        </Form>
      </Card>

      <ImportRepartitionDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        projetsEligibles={projetsEligibles}
        onImported={handleImported}
      />
    </div>
  )
}
