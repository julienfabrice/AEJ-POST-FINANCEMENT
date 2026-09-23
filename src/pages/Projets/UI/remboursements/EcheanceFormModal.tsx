import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Check, X } from 'lucide-react'

// On s'attend à ce que le hook entier (retour de useEcheanceForm) soit passé en props
// car il gère l'état d'ouverture lui-même
export function EcheanceFormModal({ formHook }: { formHook: any }) {
  const { form, onSubmit, isPending, isEdit, open, setOpen } = formHook

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier' : 'Ajouter'} une échéance</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="periode"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Période</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_echeance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date échéance</FormLabel>
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
                name="montant_echeance"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Montant échéance</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="statut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NON_PAYE">Non Payé</SelectItem>
                        <SelectItem value="PARTIEL">Partiel</SelectItem>
                        <SelectItem value="PAYE">Payé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="capital_rembourse"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Capital remboursé</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interets"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Intérêts</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capital_restant"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Capital restant</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#EEF2F7]">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button type="submit" className="bg-[#E7722B] hover:bg-[#d66827] text-white" disabled={isPending}>
                <Check className="w-4 h-4 mr-2" />
                {isEdit ? 'Modifier' : 'Ajouter'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
