import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { FolderOpen } from 'lucide-react'
import { useProjetsStore } from '@/store/useProjetsStore'
import { ExaminerHeader } from './ExaminerModal/ExaminerHeader'
import { ExaminerMetadata } from './ExaminerModal/ExaminerMetadata'
import { ChaineValidation } from './ExaminerModal/ChaineValidation'
import { LignesTable } from './ExaminerModal/LignesTable'
import { HistoriqueItem } from './ExaminerModal/HistoriqueItem'
import { SectionTitle } from './ExaminerModal/Shared'
import { usePlanDecaissementViewerModal } from '../hooks/usePlanDecaissementViewerModal'

export function PlanDecaissementModal() {
  const setSelectedProjet = useProjetsStore(s => s.setSelectedProjet)

  const {
    projet,
    sigle_monnaie_pays,
    historiques,
    allEtapeRoles,
    statutConfig,
    mainSteps,
    visibleStartIndex,
    chaineValidation,
    handleClose
  } = usePlanDecaissementViewerModal()

  if (!projet) return null

  return (
    <Sheet open={!!projet} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full sm:max-w-[580px] p-0 flex flex-col gap-0 overflow-hidden"
      >
        <ExaminerHeader 
          projet={projet} 
          statutConfig={statutConfig} 
          handleClose={handleClose} 
        />

        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          <div className="px-5 pb-4">
            <SectionTitle>Chaîne de validation</SectionTitle>
            <ChaineValidation 
              chaine={chaineValidation} 
              totalSteps={mainSteps.length} 
              visibleStartIndex={visibleStartIndex} 
            />

            <ExaminerMetadata projet={projet} sigle_monnaie_pays={sigle_monnaie_pays} />

            {projet.description && (
              <>
                <SectionTitle>Note / Observations</SectionTitle>
                <div className="text-[13px] text-slate-600 leading-relaxed bg-white border border-slate-100 p-3 rounded-lg">
                  {projet.description}
                </div>
              </>
            )}

            <SectionTitle>
              Lignes de décaissement {projet.plan_decaissement?.lignes?.length ? `(${projet.plan_decaissement.lignes.length})` : ''}
            </SectionTitle>
            <LignesTable lignes={projet.plan_decaissement?.lignes || []} />

            {historiques && historiques.length > 0 ? (
              <>
                <SectionTitle>Historique des décisions</SectionTitle>
                <div className="space-y-4">
                  {historiques.map((h, i) => (
                    <HistoriqueItem key={i} item={h} allRoles={allEtapeRoles || []} />
                  ))}
                </div>
              </>
            ) : (
              <>
                <SectionTitle>Historique des décisions</SectionTitle>
                <div className="text-[12px] text-slate-500 italic p-3 border border-slate-100 rounded-lg bg-slate-50 text-center">
                  Aucun historique disponible pour le moment.
                </div>
              </>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-100 bg-slate-50 px-5 py-3 flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleClose}>
            Fermer
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-600" onClick={() => { handleClose(); setSelectedProjet(projet); }}>
            <FolderOpen className="w-4 h-4 mr-1.5" />
            Voir le dossier
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
