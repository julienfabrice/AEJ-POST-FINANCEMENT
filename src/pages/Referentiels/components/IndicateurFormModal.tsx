import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useIndicateurForm } from '../hooks/indicateurs/useIndicateurForm'

interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: any | null
}

export function IndicateurFormModal({ children, open: controlledOpen, onOpenChange, initialData }: Props) {
  const { form, onSubmit, isPending, isEdit, open, setOpen } = useIndicateurForm(initialData, controlledOpen, onOpenChange)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>{isEdit ? "Modifier l'indicateur" : "Nouvel indicateur"}</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="grid gap-4 py-4">
            <FormField control={form.control as any} name="nom" render={({ field }) => (
              <FormItem><FormLabel>Nom de l'indicateur</FormLabel><FormControl><Input placeholder="Ex. Taux d'insertion" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control as any} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description (optionnel)</FormLabel><FormControl><Textarea placeholder="Brève description..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control as any} name="type_valeur" render={({ field }) => (
                <FormItem><FormLabel>Type de valeur</FormLabel><FormControl><Input placeholder="Ex. pourcentage, monétaire..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control as any} name="unite" render={({ field }) => (
                <FormItem><FormLabel>Unité</FormLabel><FormControl><Input placeholder="Ex. %, FCFA" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control as any} name="statut" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-2 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Indicateur actif</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} />
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
