import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calculator, Save } from 'lucide-react'
import { useEcheancierGenerator } from '../hooks/useEcheancierGenerator'

const formatMontant = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function EcheancierGenerator() {
  const { form, preview, onGenerate, onSave, isSaving } = useEcheancierGenerator()

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
        <p className="text-sm font-bold text-[#131C29] mb-4">Paramètres de l'échéancier</p>
        <Form {...form}>
          <form onSubmit={onGenerate} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <FormField control={form.control} name="micro_projet_id" render={({ field: { onChange, ...field } }) => (
              <FormItem><FormLabel>ID Micro-projet</FormLabel><FormControl><Input className="bg-white border-slate-300" type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="budget_id" render={({ field: { onChange, ...field } }) => (
              <FormItem><FormLabel>ID Budget</FormLabel><FormControl><Input className="bg-white border-slate-300" type="number" onChange={(e) => onChange(e.target.valueAsNumber || undefined)} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="capital" render={({ field: { onChange, ...field } }) => (
              <FormItem><FormLabel>Capital</FormLabel><FormControl><Input className="bg-white border-slate-300" type="number" step="0.01" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="taux_annuel" render={({ field: { onChange, ...field } }) => (
              <FormItem><FormLabel>Taux annuel (%)</FormLabel><FormControl><Input className="bg-white border-slate-300" type="number" step="0.01" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="duree_mois" render={({ field: { onChange, ...field } }) => (
              <FormItem><FormLabel>Durée (mois)</FormLabel><FormControl><Input className="bg-white border-slate-300" type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="differe_mois" render={({ field: { onChange, ...field } }) => (
              <FormItem><FormLabel>Différé (mois)</FormLabel><FormControl><Input className="bg-white border-slate-300" type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="date_debut" render={({ field }) => (
              <FormItem><FormLabel>1ère échéance</FormLabel><FormControl><Input className="bg-white border-slate-300" type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Générer
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {preview.length > 0 && (
        <Card className="p-0 overflow-hidden border-slate-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-[#fafbfd]">
            <p className="text-sm font-bold text-[#131C29]">Aperçu — {preview.length} échéance(s)</p>
            <Button size="sm" onClick={onSave} disabled={isSaving} className="bg-[#E7722B] hover:bg-[#C85E18] text-white">
              <Save className="w-3.5 h-3.5 mr-2" />
              {isSaving ? 'Enregistrement...' : "Enregistrer l'échéancier"}
            </Button>
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#fafbfd] sticky top-0">
                <tr className="text-left text-slate-500 text-xs">
                  <th className="px-4 py-2 font-medium">#</th>
                  <th className="px-4 py-2 font-medium">Date échéance</th>
                  <th className="px-4 py-2 font-medium text-right">Amortissement</th>
                  <th className="px-4 py-2 font-medium text-right">Intérêts</th>
                  <th className="px-4 py-2 font-medium text-right">Montant échéance</th>
                  <th className="px-4 py-2 font-medium text-right">Capital remboursé</th>
                  <th className="px-4 py-2 font-medium text-right">Capital restant</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((row) => (
                  <tr key={row.periode} className="border-t border-slate-100">
                    <td className="px-4 py-2 text-slate-500">{row.periode}</td>
                    <td className="px-4 py-2">{row.echeance_mensuelle}</td>
                    <td className="px-4 py-2 text-right">{formatMontant(row.amortissement_capital)}</td>
                    <td className="px-4 py-2 text-right">{formatMontant(row.interets)}</td>
                    <td className="px-4 py-2 text-right font-semibold">{formatMontant(row.montant_echeance)}</td>
                    <td className="px-4 py-2 text-right">{formatMontant(row.capital_rembourse)}</td>
                    <td className="px-4 py-2 text-right">{formatMontant(row.capital_restant)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
