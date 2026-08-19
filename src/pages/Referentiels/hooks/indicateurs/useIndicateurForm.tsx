import { indicateurServices } from '@/services/indicateurs.services'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { indicateurSchema, type IndicateurFormValues } from '@/schema/indicateurs/indicateurSchema'

export function useIndicateurForm(initialData: any | null, controlledOpen?: boolean, onOpenChange?: (open: boolean) => void) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }

  const { mutate: createMutation, isPending: isCreating } = indicateurServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = indicateurServices.useUpdate()
  
  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<IndicateurFormValues>({
    resolver: zodResolver(indicateurSchema) as any,
    defaultValues: { nom: '', description: '', type_valeur: '', unite: '', statut: true },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          nom: initialData.nom || '',
          description: initialData.description || '',
          type_valeur: initialData.type_valeur || '',
          unite: initialData.unite || '',
          statut: initialData.statut !== false
        })
      }
      else form.reset({ nom: '', description: '', type_valeur: '', unite: '', statut: true })
    }
  }, [open, initialData, form])

  const onSubmit = (values: IndicateurFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
