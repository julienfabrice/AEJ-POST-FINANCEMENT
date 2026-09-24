import { useState } from 'react'
import { toast } from 'sonner'
import { useImportRepartition } from './useImportRepartition'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import type { DISPOSITIF_T } from '@/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transmissionFormSchema, type TransmissionFormValues } from '@/schema/transmission/transmission.schema'

export function useComposerLotTab(
  selectedGuichet: string,
  dispositifs: DISPOSITIF_T[],
  projetsEligibles: MICRO_PROJET_T[],
  selectedDossiers: Set<string>,
  toggleDossier: (id: string) => void,
  handleSubmit: (payload: any) => void
) {
  const currentDispo = dispositifs.find((d) => d.id.toString() === selectedGuichet)

  const form = useForm<TransmissionFormValues>({
    resolver: zodResolver(transmissionFormSchema) as any,
    defaultValues: {
      organisme_id: '',
      reference: `LOT-${currentDispo?.code || 'AGR'}-2024-001`,
      fichier_repartition: '',
      courrier_fichier: '',
      courrier_reference: 'CRT-2024-0150',
      date_transmission: new Date().toISOString().slice(0, 10),
      titre_courrier: `Transmission lot ${currentDispo?.code || 'AGR'}`,
      taux_couverture: 80,
      duree_differe: 3,
      duree_remboursement: 24,
      reference_convention: 'CONV-2024-0075',
    }
  })

  // Optional: update default values if selectedGuichet changes and form hasn't been heavily touched
  // (We'll leave that out if the user didn't request dynamic updating, but it's safe to keep the current behavior)

  const [importOpen, setImportOpen] = useState(false)
  const { downloadCanvas } = useImportRepartition(projetsEligibles)

  const onSubmit = form.handleSubmit((values) => {
    handleSubmit(values)
  })

  const handleImported = (ids: string[], source: string | File) => {
    ids.forEach((id) => {
      if (!selectedDossiers.has(id)) {
        toggleDossier(id)
      }
    })
    if (source) {
      form.setValue('fichier_repartition', source, { shouldValidate: true, shouldDirty: true })
    }
    toast.success(`${ids.length} dossier(s) rattaché(s) au lot`)
  }

  return {
    form,
    importOpen,
    setImportOpen,
    onSubmit,
    handleImported,
    downloadCanvas,
  }
}
