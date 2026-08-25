import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePlanDecaissementForm } from '../hooks/usePlanDecaissementForm'
import type { PLAN_DECAISSEMENT_T } from '@/types'

interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: PLAN_DECAISSEMENT_T | null
}

export function PlanDecaissementFormModal({ children, open: controlledOpen, onOpenChange, initialData }: Props) {
  const { form, fields, addLigne, removeLigne, onSubmit, isPending, isEdit, open, setOpen } = usePlanDecaissementForm(
    initialData ?? null,
    controlledOpen,
    onOpenChange,
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{isEdit ? 'Modifier le' : 'Nouveau'} plan de décaissement</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="micro_projet_id" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>ID Micro-projet</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="budget_id" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>ID Budget</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || undefined)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="montant_planifie" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>Montant planifié</FormLabel><FormControl><Input type="number" step="0.01" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="date_prevue" render={({ field }) => (
              <FormItem className="max-w-[220px]"><FormLabel>Date prévue</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <Separator />
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[#131C29]">Lignes par prestataire</p>
              <Button type="button" size="sm" variant="outline" onClick={addLigne}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Ajouter une ligne
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="rounded-lg border border-slate-200 p-4 space-y-3 relative">
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLigne(index)}
                      className="absolute top-3 right-3 text-red-500 hover:bg-red-50 rounded p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <p className="text-xs font-semibold text-slate-500">Ligne {index + 1}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name={`lignes.${index}.intitule_prestataire`} render={({ field }) => (
                      <FormItem><FormLabel>Prestataire</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`lignes.${index}.object_ligne`} render={({ field }) => (
                      <FormItem><FormLabel>Objet</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`lignes.${index}.montant_ligne`} render={({ field: { onChange, ...field } }) => (
                      <FormItem><FormLabel>Montant</FormLabel><FormControl><Input type="number" step="0.01" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`lignes.${index}.mode_decaisse`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mode</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="VIREMENT">Virement</SelectItem>
                            <SelectItem value="CHEQUE">Chèque</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`lignes.${index}.numero_compte`} render={({ field }) => (
                      <FormItem><FormLabel>N° compte</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`lignes.${index}.contact`} render={({ field }) => (
                      <FormItem><FormLabel>Contact</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`lignes.${index}.date_prevue`} render={({ field }) => (
                      <FormItem><FormLabel>Date prévue</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`lignes.${index}.statut`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statut</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="VALIDE">Validé</SelectItem>
                            <SelectItem value="NON_VALIDE">Non validé</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
              <Button type="submit" className="bg-[#E7722B] text-white hover:bg-[#d6621a]" disabled={isPending}>
                {isPending ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
