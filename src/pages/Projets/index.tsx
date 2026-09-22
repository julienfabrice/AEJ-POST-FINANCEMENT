import { useEffect } from 'react'
import { useSearch } from '@tanstack/react-router'
import { ProjetsHeader } from './UI/ProjetsHeader'
import { ProjetsFilters } from './UI/ProjetsFilters'
import { ListZone } from './UI/ListZone'
import { ProjetDetailsSheet } from './UI/ProjetDetailsSheet'
import { JoindrePlanModal } from './UI/JoindrePlanModal'
import { DecaissementModal } from './UI/DecaissementModal'
import { ValiderModal } from './UI/ValiderModal'
import { TraiterModal } from './UI/TraiterModal'
import { RemboursementsModal } from './UI/remboursements/RemboursementsModal'
import { ImputerAlertModal } from './UI/ImputerAlertModal'
import { ExaminerModal } from './UI/ExaminerModal'
import { VisiteSuiviFormModal } from '@/components/generics/VisiteSuiviFormModal'
import { PlanDecaissementFormModal } from '@/components/generics/PlanDecaissementFormModal'
import { useProjetsStore } from '@/store/useProjetsStore'
import { useAdvanceWorkflow } from '@/pages/Projets/hooks/useAdvanceWorkflow'

export function ProjetsPage() {
  const { guichet_id } = useSearch({ from: '/_authenticated/_agent/projets' })
  const { setFilters } = useProjetsStore()

  const visiteSuiviProjet = useProjetsStore(s => s.visiteSuiviModalProjet)
  const setVisiteSuiviProjet = useProjetsStore(s => s.setVisiteSuiviModalProjet)

  const planDecaissementProjet = useProjetsStore(s => s.planDecaissementModalProjet)
  const setPlanDecaissementProjet = useProjetsStore(s => s.setPlanDecaissementModalProjet)

  const corrigerModalProjet = useProjetsStore(s => s.corrigerModalProjet)
  const setCorrigerModalProjet = useProjetsStore(s => s.setCorrigerModalProjet)

  const { advance } = useAdvanceWorkflow()

  // Synchronise le guichet_id de l'URL dans les filtres du store au montage
  useEffect(() => {
    if (guichet_id) {
      setFilters({ guichet_id })
    } else {
      // Quand on arrive sans guichet_id (via sidebar), on retire le filtre guichet
      setFilters({ guichet_id: undefined })
    }
  }, [guichet_id, setFilters])

  return (
    <div className="space-y-6">
      <ProjetsHeader />

      <ProjetsFilters />

      <ListZone />

      {/* Drawer d'informations détaillées */}
      <ProjetDetailsSheet />

      {/* Modals pour les actions sur les projets */}
      <JoindrePlanModal />
      <DecaissementModal />
      <ValiderModal />
      <TraiterModal />
      <RemboursementsModal />
      <ImputerAlertModal />
      <ExaminerModal />
      
      <VisiteSuiviFormModal
        open={!!visiteSuiviProjet}
        onOpenChange={(val) => !val && setVisiteSuiviProjet(null)}
        projetFixed={visiteSuiviProjet}
      />

      <PlanDecaissementFormModal
        open={!!planDecaissementProjet}
        onOpenChange={(val) => !val && setPlanDecaissementProjet(null)}
        lockedMicroProjetId={planDecaissementProjet?.id}
        onSuccess={() => {
          if (planDecaissementProjet) {
            advance({ 
              projet: planDecaissementProjet,
              action: 'PLAN_DECAISSEMENT',
              comment: 'Plan de décaissement enregistré'
            })
          }
        }}
      />

      {/* Modal Correction : pré-rempli avec le plan ajourné du projet */}
      <PlanDecaissementFormModal
        open={!!corrigerModalProjet}
        onOpenChange={(val) => !val && setCorrigerModalProjet(null)}
        lockedMicroProjetId={corrigerModalProjet?.id}
        initialData={corrigerModalProjet?.plan_decaissement ?? null}
        onSuccess={() => {
          if (corrigerModalProjet) {
            advance({
              projet: corrigerModalProjet,
              action: 'CORRIGER',
            })
            setCorrigerModalProjet(null)
          }
        }}
      />
    </div>
  )
}
