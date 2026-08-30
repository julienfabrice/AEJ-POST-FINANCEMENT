import { Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from './components/Badge'
import { LgnAttente } from './UI/LgnAttente'
import { LgnFait } from './UI/LgnFait'
import { useImputation } from './hooks/useImputation'

export function ImputationPage() {
  const { attente, faits, agences, isLoading, isImputing, handleImputer, handleDirection } = useImputation()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#5A6B80]">
        <Loader2 size={34} className="animate-spin text-[#E7722B] mb-2" />
        <span className="text-[13.5px]">Chargement des dossiers et agences...</span>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Card 1 : Dossiers approuvés à imputer */}
      <Card className="p-0 border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)] overflow-hidden">
        <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
          <h3 className="text-[14.5px] font-bold text-[#131C29]">Dossiers approuvés à imputer</h3>
          <div className="flex-1" />
          <Badge text={attente.length} cls="am" />
        </div>

        <div className="p-[18px]">
          {attente.length === 0 ? (
            <div className="text-center py-[40px] px-5 text-[#5A6B80] text-[13px]">
              Aucun dossier approuvé en attente d&apos;imputation
            </div>
          ) : (
            attente.map((d) => (
              <LgnAttente
                key={d.id}
                d={d}
                agences={agences}
                onImputer={handleImputer}
                onDirection={handleDirection}
                isImputing={isImputing}
              />
            ))
          )}
        </div>
      </Card>

      {/* Card 2 : Dossiers déjà imputés */}
      <Card className="p-0 border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)] overflow-hidden">
        <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
          <h3 className="text-[14.5px] font-bold text-[#131C29]">Dossiers déjà imputés</h3>
          <div className="flex-1" />
          <Badge text={faits.length} cls="gr" />
        </div>

        <div className="p-[18px]">
          {faits.length === 0 ? (
            <div className="text-center py-[40px] px-5 text-[#5A6B80] text-[13px]">
              Aucun dossier imputé
            </div>
          ) : (
            faits.map((d) => <LgnFait key={d.id} d={d} />)
          )}
        </div>
      </Card>
    </div>
  )
}

