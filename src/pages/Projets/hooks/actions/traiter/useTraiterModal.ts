import { useProjetsStore } from '@/store/useProjetsStore'
import { useDeliverableUploads } from '../../useDeliverableUploads'
import { useAmortissementExcelUpload } from './useAmortissementExcelUpload'
import { useTraiterForm } from './useTraiterForm'
import { toast } from 'sonner'
import type { TraiterFormValues } from '@/schema/workflowActions/traiterSchema'

export function useTraiterModal() {
  const { traiterModalProjet: projet, setTraiterModalProjet } = useProjetsStore()

  const currentEtapeCode = projet?.workflow_instance?.current_etape_code
  const deliverableUploads = useDeliverableUploads(currentEtapeCode)

  const excelUpload = useAmortissementExcelUpload()
  const { form, watchDecision } = useTraiterForm(projet, excelUpload.resetAmortissement)

  const handleClose = () => {
    setTraiterModalProjet(null)
    excelUpload.resetAmortissement()
    form.reset()
    deliverableUploads.reset()
  }

  const onSubmit = form.handleSubmit(async (data: TraiterFormValues) => {
    if (!projet) return

    console.log("Données du formulaire Traiter :", data)
    console.log("Lignes d'amortissement trouvées :", excelUpload.lignesAmortissement.length)
    
    // Pour l'instant on bypass toute l'API
    toast.info("Validation du formulaire désactivée pour la démo.")
    
    handleClose()
  })

  return {
    projet,
    isOpen: !!projet,
    form,
    watchDecision,
    handleClose,
    onSubmit,
    
    // Upload Excel amortissement
    excelFile: excelUpload.excelFile,
    handleExcelUpload: excelUpload.handleExcelUpload,
    isParsingExcel: excelUpload.isParsingExcel,
    lignesAmortissement: excelUpload.lignesAmortissement,
    
    // Livrables standard du workflow (ex: convention pdf)
    etapeDeliverables: deliverableUploads.etapeDeliverables,
    isLoadingConfig: deliverableUploads.isLoadingConfig,
    sources: deliverableUploads.sources,
    setDeliverableFile: deliverableUploads.setFile,
    setExistingDocument: deliverableUploads.setExistingDocument,
    isSubmitting: false
  }
}
