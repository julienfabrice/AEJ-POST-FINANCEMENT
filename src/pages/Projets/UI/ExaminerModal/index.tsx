import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import { useExaminerModal } from '@/pages/Projets/hooks/actions/examiner/useExaminerModal'
import { SectionTitle } from './Shared'
import { ChaineValidation } from './ChaineValidation'
import { LignesTable } from './LignesTable'
import { HistoriqueItem } from './HistoriqueItem'
import { ExaminerFooter } from './ExaminerFooter'
import { ExaminerHeader } from './ExaminerHeader'
import { ExaminerMetadata } from './ExaminerMetadata'

export function ExaminerModal() {
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
  } = useExaminerModal()

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

        {/* ── Corps scrollable ── */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          <div className="px-5 pb-4">

            {/* Chaîne de validation */}
            <SectionTitle>Chaîne de validation</SectionTitle>
            <ChaineValidation 
              chaine={chaineValidation} 
              totalSteps={mainSteps.length} 
              visibleStartIndex={visibleStartIndex} 
            />

            <ExaminerMetadata projet={projet} sigle_monnaie_pays={sigle_monnaie_pays} />

            {/* Note d'observations */}
            {projet?.description && (
              <>
                <SectionTitle>Note / Observations</SectionTitle>
                <div className="text-[13px] text-slate-600 leading-relaxed bg-white border border-slate-100 p-3 rounded-lg">
                  {projet.description}
                </div>
              </>
            )}

            {/* Lignes de décaissement */}
            <SectionTitle>
              Lignes de décaissement {projet?.plan_decaissement?.lignes?.length ? `(${projet?.plan_decaissement.lignes.length})` : ''}
            </SectionTitle>
            <LignesTable lignes={projet?.plan_decaissement?.lignes || []} />

            {/* Historique */}
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

        <ExaminerFooter handleClose={handleClose} projet={projet} />
      </SheetContent>
    </Sheet>
  )
}
