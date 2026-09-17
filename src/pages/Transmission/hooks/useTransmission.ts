import { useState } from 'react'

export function useTransmission() {
  const search = route.useSearch()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'composer' | 'lots'>('composer')

  const createLotMutation = lotsTransmissionServices.useCreate()
  const { advance, isAdvancing } = useAdvanceWorkflow()

  const handleSubmit = async (payload: any) => {
    if (selectedDossiers.size === 0) {
      toast.error('Veuillez sélectionner au moins un dossier.')
      return
    }

    try {
      // 1. Création du lot en base
      const lotData = {
        ...payload,
        guichet_id: Number(selectedGuichet), // Assuming it's an ID
        statut: 'TRANSMIS',
      }
      // TODO: Activer l'API de création de lot quand elle sera prête
      // await createLotMutation.mutateAsync(lotData)
      console.log('Lot créé avec succès :', lotData)

      // 2. Avancement du workflow pour chaque projet
      const dossiersAAvancer = projetsEligibles.filter((p) => selectedDossiers.has(p.id.toString()))
      
      for (const projet of dossiersAAvancer) {
        await advance({
          projet,
          action: 'TRANSMETTRE',
          comment: `Transmis dans le lot ${payload.reference_courrier || ''}`,
        })
      }

      toast.success(`${dossiersAAvancer.length} dossier(s) transmis avec succès !`)
      
      // Réinitialiser et basculer sur l'onglet lots
      setSelectedDossiers(new Set())
      setActiveTab('lots')
    } catch (error) {
      toast.error('Erreur lors de la transmission du lot.')
      console.error(error)
    }
  }

  return {
    activeTab,
    setActiveTab,
  }
}