import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useProjetsStore } from '@/store/useProjetsStore'
import { decaissementSchema, type DecaissementFormValues } from '@/schema/decaissements/decaissementSchema'
import { decaissementServices } from '@/services/decaissements.services'
import { useUploadDocumentMutation } from '@/services/documents.services'
import { useAdvanceWorkflow } from '../../useAdvanceWorkflow'

function generateRef() {
  return `VIR-${Math.floor(Math.random() * 90000 + 10000)}`
}

export function useDecaissementModal() {
  const { decaissementModalProjet: projet, setDecaissementModalProjet } = useProjetsStore()

  const createDecaissement = decaissementServices.useCreate()
  const uploadDocument = useUploadDocumentMutation()
  const { advance, isAdvancing } = useAdvanceWorkflow()

  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const planId = projet?.plan_decaissement?.id

  // Historique des décaissements du plan en cours (query désactivée si pas de plan)
  const { data: decaissements = [], isLoading: isLoadingHistorique } = decaissementServices.useGetAll(
    { plan_decaissement_id: planId },
    !!planId,
  )

  const form = useForm<DecaissementFormValues>({
    resolver: zodResolver(decaissementSchema),
    defaultValues: {
      plan_decaissement_id: 0,
      agence_id: undefined,
      numero_decaissement: generateRef(),
      reference_banque: '',
      date_decaissement: new Date().toISOString().slice(0, 10),
      montant_decaisse: 0,
      statut: 'VALIDE',
      observations: '',
    },
  })

  // Sync les valeurs contextuelles à chaque ouverture
  useEffect(() => {
    if (!projet) return
    form.setValue('plan_decaissement_id', planId ?? 0)
    if (projet.agence_id) form.setValue('agence_id', projet.agence_id)
    form.setValue('numero_decaissement', generateRef())
  }, [projet, planId, form])

  const handleClose = () => {
    setDecaissementModalProjet(null)
    setFile(null)
    form.reset()
  }

  const onSubmit = form.handleSubmit(async (data: DecaissementFormValues) => {
    if (!projet) return

    if (!planId) {
      toast.error('Ce projet ne possède pas encore de plan de décaissement.')
      return
    }

    try {
      // 1. Upload du justificatif si un fichier est sélectionné
      let justificatif_path: string | null = null
      if (file) {
        setIsUploading(true)
        const uploadRes = await uploadDocument.mutateAsync({
          file,
          folder: 'Decaissements',
          micro_projet_id: projet.id.toString(),
        })
        setIsUploading(false)
        // L'API retourne { path: "Dossier/xxx.pdf", ... }
        justificatif_path = uploadRes?.path ?? null
      }

      // 2. Création du décaissement
      await createDecaissement.mutateAsync({ ...data, justificatif_path } as any)

      // 3. Avancement de workflow uniquement pour le 1er décaissement
      if (decaissements.length === 0) {
        await advance({
          projet,
          action: 'DECAISSER',
          comment: `Premier décaissement : ${data.montant_decaisse} F`,
        })
      }

      handleClose()
    } catch {
      setIsUploading(false)
    }
  })

  // Calculs financiers exposés à la modale
  const budgetMontant = Number(projet?.budget?.montant_accorde) || 0
  const dejaDecaisse = decaissements.reduce((acc, d) => acc + (Number(d.montant_decaisse) || 0), 0)
  const resteADecaisser = Math.max(0, budgetMontant - dejaDecaisse)

  return {
    projet,
    isOpen: !!projet,
    hasPlan: !!planId,
    form,
    file,
    setFile,
    decaissements,
    isLoadingHistorique,
    budgetMontant,
    dejaDecaisse,
    resteADecaisser,
    isSubmitting: createDecaissement.isPending || isAdvancing || isUploading,
    handleClose,
    onSubmit,
  }
}
