import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
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
import { MicroProjetCombobox } from '@/components/generics/MicroProjetCombobox'
import type { TRANSACTION_T } from '@/types'
import { useTransactionFormModal } from './useTransactionFormModal'

interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: TRANSACTION_T | null
}

export function TransactionFormModal({ children, open: controlledOpen, onOpenChange, initialData }: Props) {
  const {
    open,
    setOpen,
    portal,
    setPortal,
    categories,
    isLoadingCategories,
    form,
    onSubmit,
    isPending,
    isEdit,
  } = useTransactionFormModal({
    open: controlledOpen,
    onOpenChange,
    initialData,
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent ref={setPortal} className="sm:max-w-[480px]">
        <DialogHeader><DialogTitle>{isEdit ? 'Modifier la' : 'Nouvelle'} dépense</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="micro_projet_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Micro-projet</FormLabel>
                    <FormControl>
                      <MicroProjetCombobox
                        value={field.value}
                        onChange={field.onChange}
                        projetInitial={initialData?.micro_projet ?? null}
                        container={portal}
                        placeholder="Rechercher..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categorie_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select
                      disabled={isLoadingCategories}
                      value={field.value ? String(field.value) : ''}
                      onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              isLoadingCategories
                                ? 'Chargement...'
                                : 'Sélectionner une catégorie'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.libelle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="libelle" render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Intitulé</FormLabel><FormControl><Input placeholder="Ex. Frais de transport" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="montant" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>Montant</FormLabel><FormControl><Input type="number" step="5" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="mode_paiement" render={({ field }) => (
                <FormItem><FormLabel>Mode de paiement</FormLabel><FormControl><Input placeholder="Ex. BANQUE" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="reference" render={({ field }) => (
                <FormItem><FormLabel>Référence</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="statut" render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="BROUILLON">Brouillon</SelectItem>
                      <SelectItem value="SOUMIS">Soumis</SelectItem>
                      <SelectItem value="VALIDE">Validé</SelectItem>
                      <SelectItem value="REJETE">Rejeté</SelectItem>
                      <SelectItem value="ANNULE">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="observations" render={({ field }) => (
              <FormItem><FormLabel>Observations</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
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
