import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { useEtapeForm } from '../../hooks/forms/useEtapeForm'
import type { WORKFLOW_ETAPE_T } from '@/types'

interface EtapeFormProps {
  etape: WORKFLOW_ETAPE_T
  onCancel: () => void
  onSuccess?: () => void
}

export function EtapeForm({ etape, onCancel, onSuccess }: EtapeFormProps) {
  const { form, onSubmit, isSubmitting } = useEtapeForm(etape, () => {
    onCancel()
    onSuccess?.()
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>Modifier l'étape</DialogTitle>
        </DialogHeader>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l'étape</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'étape" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter className="mt-6">
          <Button variant="outline" type="button" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-[#131C29] hover:bg-[#202d40] text-white">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
