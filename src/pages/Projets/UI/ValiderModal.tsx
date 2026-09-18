import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Check } from 'lucide-react'
import { useValiderAction } from '../hooks/actions/useValiderAction'

export function ValiderModal() {
  const {
    projet,
    isOpen,
    handleClose,
    onSubmit,
    form,
    isSubmitting,
  } = useValiderAction()

  if (!projet) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Validation — {projet.code}</DialogTitle>
          <p className="text-sm text-slate-500 mt-1">
            {projet.intitule} — {projet.promoteur?.nom} {projet.promoteur?.prenom} 
            {projet.agence?.nom && ` · ${projet.agence.nom}`}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observation (facultatif)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Remarques éventuelles…"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Check className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Validation...' : 'Valider et transmettre'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
