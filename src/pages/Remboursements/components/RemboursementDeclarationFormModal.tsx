import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRemboursementDeclarationForm } from '../hooks/useRemboursementDeclarationForm'
import { PromoteurCombobox } from '@/components/generics/PromoteurCombobox'
import { BudgetCombobox } from '@/components/generics/BudgetCombobox'
import { DocumentUploadOrPicker } from '@/components/generics/DocumentUploadOrPicker'
import { STATUT_LABELS } from '@/constants/DECLARATION_STATUSES'
import type { REMBOURSEMENT_DECLARATION_T } from '@/types'

interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: REMBOURSEMENT_DECLARATION_T | null
}

export function RemboursementDeclarationFormModal({ children, open: controlledOpen, onOpenChange, initialData }: Props) {
  const {
    form,
    onSubmit,
    isPending,
    isEdit,
    open,
    setOpen,
    portal,
    setPortal,
    promoteurId,
    microProjetId,
    handleBudgetChange,
  } = useRemboursementDeclarationForm(
    initialData ?? null,
    controlledOpen,
    onOpenChange,
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent ref={setPortal} className="sm:max-w-[760px] max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{isEdit ? 'Modifier la' : 'Nouvelle'} déclaration de paiement</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="promoteur_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promoteur</FormLabel>
                    <FormControl>
                      <PromoteurCombobox
                        value={field.value}
                        onChange={field.onChange}
                        promoteurInitial={initialData?.promoteur ?? null}
                        container={portal}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <BudgetCombobox
                        value={field.value}
                        onChange={(bId, budget) => handleBudgetChange(bId, budget, field.onChange)}
                        budgetInitial={initialData?.budget ?? null}
                        promoteurId={promoteurId}
                        container={portal}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="montant_declare" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>Montant déclaré</FormLabel><FormControl><Input type="number" step="5" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="date_declaree" render={({ field }) => (
                <FormItem><FormLabel>Date déclarée</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="reference_banque" render={({ field }) => (
                <FormItem><FormLabel>Référence bancaire</FormLabel><FormControl><Input placeholder="Optionnel" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField
                control={form.control}
                name="justificatif_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Justificatif</FormLabel>
                    <FormControl>
                      <DocumentUploadOrPicker
                        value={field.value}
                        onChange={(path) => field.onChange(path)}
                        microProjetId={microProjetId}
                        folder="Remboursements"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField control={form.control} name="statut" render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    {Object.entries(STATUT_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="observations" render={({ field }) => (
              <FormItem><FormLabel>Observations</FormLabel><FormControl><Textarea placeholder="Optionnel" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <DialogFooter className="mt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
              <Button
                type="submit"
                className="bg-[#E7722B] text-white hover:bg-[#d6621a]"
                disabled={isPending}
              >
                {isPending ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

