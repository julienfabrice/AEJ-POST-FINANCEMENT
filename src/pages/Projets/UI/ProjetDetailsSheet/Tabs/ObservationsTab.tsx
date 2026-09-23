import { TabsContent } from '@/components/ui/tabs'
import { observationsServices } from '@/services/observations.services'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { formatDateTime } from '@/helpers/date'
import { Loader2 } from 'lucide-react'

interface ObservationsTabProps {
  projet: MICRO_PROJET_T
}

export function ObservationsTab({ projet }: ObservationsTabProps) {
  const { data: observations, isLoading } = observationsServices.useGetByProjet(projet.id)

  return (
    <TabsContent value="observations" className="mt-0 focus-visible:outline-none">
      <h3 className="text-[13px] font-bold text-aej-ink mb-4 uppercase tracking-wide">Observations des agents</h3>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 text-aej-orange animate-spin" />
          </div>
        ) : observations && observations.length > 0 ? (
          observations.map((obs) => (
            <div key={obs.id}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-[13px] text-aej-ink">
                  {obs.user?.prenom} {obs.user?.nom} {obs.user?.role ? `(${obs.user.role.libelle})` : ''}
                </span>
                <span className="text-[12px] text-aej-slate italic">{formatDateTime(obs.created_at)}</span>
              </div>
              <p className="text-[13px] text-aej-ink-3 leading-relaxed">{obs.contenu}</p>
            </div>
          ))
        ) : (
          <div className="text-[13px] text-aej-slate italic py-2">
            Aucune observation pour le moment.
          </div>
        )}
      </div>

    </TabsContent>
  )
}
