import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { DataGrid } from '@/components/ui/DataGrid'
import type { ColDef } from 'ag-grid-community'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UploadCloud, Info } from 'lucide-react'
import { money } from '@/helpers/money'
import { useConfigStore } from '@/store/useConfigStore'
import { useTraiterModal } from '../hooks/actions/traiter/useTraiterModal'
import { DeliverableUploadSection } from './DeliverableUploadSection'

export function TraiterModal() {
  const {
    projet,
    isOpen,
    form,
    watchDecision,
    handleClose,
    onSubmit,
    excelFile,
    handleExcelUpload,
    isParsingExcel,
    lignesAmortissement,
    etapeDeliverables,
    isLoadingConfig,
    sources,
    setDeliverableFile,
    setExistingDocument,
    isSubmitting,
  } = useTraiterModal()

  const sigle_monnaie_pays = useConfigStore(s => s.sigle_monnaie_pays)

  if (!projet) return null

  const isRejete = watchDecision === 'REJETE'

  const columnDefs: ColDef[] = [
    { field: 'numero', headerName: 'N°', width: 70, pinned: 'left' },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'capital_debut', headerName: 'Capital Début', valueFormatter: (p) => money(p.value), flex: 1, minWidth: 120 },
    { field: 'interet', headerName: 'Intérêt', valueFormatter: (p) => money(p.value), flex: 1, minWidth: 100 },
    { field: 'amortissement', headerName: 'Amortissement', valueFormatter: (p) => money(p.value), flex: 1, minWidth: 120 },
    { field: 'mensualite', headerName: 'Mensualité', valueFormatter: (p) => money(p.value), flex: 1, minWidth: 120 },
    { field: 'capital_restant', headerName: 'Reste dû', valueFormatter: (p) => money(p.value), flex: 1, minWidth: 120 },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && handleClose()}>
      {/* On élargit la modale car on a un tableau à afficher */}
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="text-xl">
            Traitement du dossier — {projet.code}
          </DialogTitle>
          <p className="text-sm text-slate-500 mt-1">
            {projet.intitule} — {projet.promoteur?.nom} {projet.promoteur?.prenom} · Montant sollicité:{' '}
            <b className="font-mono">{money(Number(projet.montant_total || 0))}</b>
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6">
            <Form {...form}>
              <form id="traiter-form" onSubmit={onSubmit} className="space-y-6">
                
                {/* 1. SECTION DECISION */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date_ouverture_compte"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date d'ouverture du compte</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="decision"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Décision <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                            <SelectItem value="APPROUVE">Approuvé</SelectItem>
                            <SelectItem value="REJETE">Rejeté</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {isRejete && (
                  <FormField
                    control={form.control}
                    name="motif_rejet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motif du rejet</FormLabel>
                        <FormControl>
                          <Textarea rows={3} placeholder="Expliquez la raison du rejet..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* 2. SECTION CONDITIONS FINANCIERES (Visible si Approuvé ou En Attente) */}
                {!isRejete && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold border-b pb-1">Conditions de crédit</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="montant_credit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Montant du crédit ({sigle_monnaie_pays})</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(e.target.valueAsNumber || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="taux_interet"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Taux d'intérêt (%)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.valueAsNumber || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="duree_pret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Durée du prêt (mois)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(e.target.valueAsNumber || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="duree_remboursement"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Durée du remboursement (mois)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(e.target.valueAsNumber || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* IMPORT DU PLAN D'AMORTISSEMENT EXCEL */}
                    <div className="pt-4 space-y-3">
                      <h4 className="text-sm font-semibold border-b pb-1">Tableau d'amortissement</h4>
                      <Alert className="bg-slate-50">
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Veuillez importer le fichier Excel du plan de remboursement fourni par la banque.
                          Le système va extraire automatiquement les échéances.
                        </AlertDescription>
                      </Alert>

                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleExcelUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Button type="button" variant="outline" disabled={isParsingExcel}>
                            <UploadCloud className="mr-2 h-4 w-4" />
                            {isParsingExcel ? 'Analyse...' : 'Importer Excel'}
                          </Button>
                        </div>
                        {excelFile && <span className="text-sm text-slate-600 font-medium">{excelFile.name}</span>}
                      </div>

                      {/* PREVISUALISATION DU TABLEAU D'AMORTISSEMENT */}
                      {lignesAmortissement.length > 0 && (
                        <div className="h-[350px] w-full mt-4">
                          <DataGrid
                            rowData={lignesAmortissement}
                            columnDefs={columnDefs}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. SECTION LIVRABLES WORKFLOW (ex: Convention de prêt en PDF) */}
                <div className="pt-4">
                  <h4 className="text-sm font-semibold border-b pb-1 mb-3">Autres documents de l'étape</h4>
                  <DeliverableUploadSection
                    etapeDeliverables={etapeDeliverables}
                    isLoadingConfig={isLoadingConfig}
                    sources={sources}
                    setFile={setDeliverableFile}
                    setExistingDocument={setExistingDocument}
                    microProjetId={projet.id}
                  />
                </div>

              </form>
            </Form>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3 rounded-b-lg shrink-0">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Annuler
          </Button>
          <Button type="submit" form="traiter-form" disabled={isSubmitting}>
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer le traitement'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
