import { useState } from 'react'
import { useProjetsStore } from '@/store/useProjetsStore'
import { useDeliverableUploads } from '../../useDeliverableUploads'
import { useAmortissementExcelUpload } from './useAmortissementExcelUpload'
import { useTraiterForm } from './useTraiterForm'
import { toast } from 'sonner'
import type { TraiterFormValues } from '@/schema/workflowActions/traiterSchema'
import { planRemboursementServices } from '@/services/planRemboursements.services'
import { tableauAmortissementServices } from '@/services/tableauAmortissements.services'
import { useAdvanceWorkflow } from '../../useAdvanceWorkflow'

export function useTraiterModal() {
  const { traiterModalProjet: projet, setTraiterModalProjet } = useProjetsStore()

  const currentEtapeCode = projet?.workflow_instance?.current_etape_code
  const deliverableUploads = useDeliverableUploads(currentEtapeCode)

  const excelUpload = useAmortissementExcelUpload()
  const { form, watchDecision } = useTraiterForm(projet, excelUpload.resetAmortissement)

  const planRemboursementCreate = planRemboursementServices.useCreate()
  const tableauAmortissementSave = tableauAmortissementServices.useSaveEcheancier()
  const { advance } = useAdvanceWorkflow()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    setTraiterModalProjet(null)
    excelUpload.resetAmortissement()
    form.reset()
    deliverableUploads.reset()
  }

  const onSubmit = form.handleSubmit(async (data: TraiterFormValues) => {
    if (!projet) return
    setIsSubmitting(true)

    try {
      const decisionMap: Record<string, 'EN_ATTENTE'|'APPROUVE'|'NON_APPROUVE'> = {
        'EN_ATTENTE': 'EN_ATTENTE',
        'APPROUVE': 'APPROUVE',
        'REJETE': 'NON_APPROUVE'
      }

      // 1. Créer le plan de remboursement (header)
      const planRes = await planRemboursementCreate.mutateAsync({
        micro_projet_id: projet.id,
        budget_id: projet.budget?.id || 1, // Fallback si le projet n'a pas encore de budget
        date_ouverture: data.date_ouverture_compte || new Date().toISOString().slice(0, 10),
        montant_credit: data.montant_credit,
        decision: decisionMap[data.decision],
        interets: data.taux_interet,
        duree_pret: data.duree_pret,
        duree_remboursement: data.duree_remboursement,
        fichier_amortissement: "",
        fichier_convention: "",
      })

      const planId = planRes?.id || planRes?.data?.id

      // 3. Créer les échéances si un tableau a été importé et un plan créé
      if (planId && excelUpload.lignesAmortissement.length > 0) {
        const payloadRows = excelUpload.lignesAmortissement.map(row => ({
          plan_remboursement_id: planId,
          periode: row.periode,
          date_echeance: row.date,
          montant_echeance: row.mensualite,
          capital_rembourse: row.amortissement,
          capital_restant: row.capital_restant,
          interets: row.interet,
          amortissement_capital: row.amortissement,
          statut: 'NON_PAYE' as const // par défaut pour les nouvelles échéances
        }))
        
        await tableauAmortissementSave.mutateAsync(payloadRows)
      }

      // 4. Gérer les livrables du workflow (ex: si la convention de prêt est un livrable requis)
      await deliverableUploads.submitDeliverables(projet)

      // 5. Avancer le workflow
      await advance({ projet, action: 'TRAITER' })

      toast.success('Dossier traité avec succès !')
      handleClose()
    } catch (error) {
      console.error(error)
      toast.error('Une erreur est survenue lors du traitement.')
    } finally {
      setIsSubmitting(false)
    }
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
    isSubmitting
  }
}
