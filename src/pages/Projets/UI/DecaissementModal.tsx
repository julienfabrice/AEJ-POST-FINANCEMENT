import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'
import { money } from '@/helpers/money'
import { useDecaissementModal } from '../hooks/actions/decaissement/useDecaissementModal'

export function DecaissementModal() {
  const {
    projet,
    isOpen,
    hasPlan,
    form,
    file,
    setFile,
    decaissements,
    isLoadingHistorique,
    budgetMontant,
    dejaDecaisse,
    resteADecaisser,
    isSubmitting,
    handleClose,
    onSubmit,
  } = useDecaissementModal()

  // Tous les hooks sont appelés avant tout return conditionnel
  if (!projet) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Décaissement — {projet.code}</DialogTitle>
          <p className="text-sm text-slate-500 mt-1">
            {projet.intitule} — {projet.promoteur?.nom} {projet.promoteur?.prenom}
          </p>
        </DialogHeader>

        {/* Avertissement si pas de plan de décaissement */}
        {!hasPlan && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Ce projet ne possède pas encore de plan de décaissement. Veuillez d'abord créer un plan avant de saisir un décaissement.
            </AlertDescription>
          </Alert>
        )}

        {/* KPIs Financiers */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">Crédit accordé</div>
            <div className="font-semibold text-sm">{money(budgetMontant)}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <div className="text-xs text-green-600 mb-1">Déjà décaissé</div>
            <div className="font-semibold text-sm text-green-700">{money(dejaDecaisse)}</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
            <div className="text-xs text-orange-600 mb-1">Reste à décaisser</div>
            <div className="font-semibold text-sm text-orange-700">{money(resteADecaisser)}</div>
          </div>
        </div>

        {/* Historique */}
        {!isLoadingHistorique && decaissements.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 border-b pb-1">Décaissements déjà effectués</h4>
            <div className="grid grid-cols-2 gap-2">
              {decaissements.map((d, index) => (
                <div key={d.id} className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-200 text-slate-700 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-medium">{d.numero_decaissement || d.reference_banque || '—'}</div>
                      <div className="text-xs text-slate-500">
                        {d.date_decaissement
                          ? dayjs(d.date_decaissement).locale('fr').format('DD MMMM YYYY')
                          : '—'}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold">{money(Number(d.montant_decaisse))}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulaire nouveau décaissement */}
        <div>
          <h4 className="text-sm font-semibold mb-3 border-b pb-1">Nouveau décaissement</h4>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numero_decaissement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>N° de décaissement *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date_decaissement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="montant_decaisse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant (F) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={resteADecaisser > 0 ? resteADecaisser : undefined}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reference_banque"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Réf. bancaire *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <FormLabel>Justificatif (facultatif)</FormLabel>
                <Input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                {file && (
                  <p className="text-xs text-slate-500">{file.name}</p>
                )}
              </div>

              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observations</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !hasPlan || resteADecaisser <= 0}
                >
                  {isSubmitting ? 'Enregistrement…' : 'Enregistrer le décaissement'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
