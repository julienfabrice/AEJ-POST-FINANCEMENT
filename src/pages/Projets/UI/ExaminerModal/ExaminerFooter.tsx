import { useProjetsStore } from '@/store/useProjetsStore'
import { Button } from '@/components/ui/button'
import { FolderOpen, X, Check } from 'lucide-react'
import { useDecision } from '../../hooks/actions/examiner/useDecision'
import { DecisionModal } from './DecisionModal'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

interface ExaminerFooterProps {
  handleClose: () => void
  projet: MICRO_PROJET_T
}

export function ExaminerFooter({ handleClose, projet }: ExaminerFooterProps) {
  const setSelectedProjet = useProjetsStore(s => s.setSelectedProjet)
  
  const {
    isOpen,
    decisionType,
    isSubmitting,
    openDecisionModal,
    closeDecisionModal,
    submitDecision
  } = useDecision(projet)

  return (
    <>
      <div className="shrink-0 border-t border-slate-100 bg-slate-50 px-5 py-3 flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={handleClose}>
          Fermer
        </Button>
        <Button variant="ghost" size="sm" className="text-slate-600" onClick={() => { handleClose(); setSelectedProjet(projet); }}>
          <FolderOpen className="w-4 h-4 mr-1.5" />
          Voir le dossier
        </Button>
        <div className="flex-1" />
        
        <Button
          size="sm"
          variant="destructive"
          className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-none"
          onClick={() => openDecisionModal('AJOURNE')}
        >
          <X className="w-4 h-4 mr-1" />
          Ajourner
        </Button>
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => openDecisionModal('VALIDE')}
        >
          <Check className="w-4 h-4 mr-1" />
          Valider
        </Button>
      </div>

      <DecisionModal
        isOpen={isOpen}
        decisionType={decisionType}
        isSubmitting={isSubmitting}
        onClose={closeDecisionModal}
        onSubmit={submitDecision}
        projetCode={projet?.code}
      />
    </>
  )
}

