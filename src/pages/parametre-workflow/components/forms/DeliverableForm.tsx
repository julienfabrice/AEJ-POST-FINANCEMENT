import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useDeliverableForm } from '../../hooks/forms/useDeliverableForm'

interface DeliverableFormProps {
  etapeCode: string
  onCancel: () => void
  onSuccess?: () => void
}

export function DeliverableForm({ etapeCode, onCancel, onSuccess }: DeliverableFormProps) {
  const { form, onSubmit, isSubmitting } = useDeliverableForm(etapeCode, () => {
    onCancel()
    onSuccess?.()
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>Ajouter un document attendu</DialogTitle>
        </DialogHeader>
        
        <FormField
          control={form.control}
          name="deliverable_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code du document</FormLabel>
              <FormControl>
                <Input placeholder="Ex: PLAN_AFFAIRES" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="is_required"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Document obligatoire
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <DialogFooter className="mt-6">
          <Button variant="outline" type="button" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-[#E7722B] hover:bg-[#C85E18] text-white">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ajouter
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
