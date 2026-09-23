import { Check, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import { useEtapeRolesMap } from '@/pages/Projets/hooks/useEtapeRolesMap'
import { useWorkflowVersionsMap, getEtapeActuelle } from '@/pages/Projets/hooks/useWorkflowVersionsMap'
import { useProjetActions } from '@/pages/Projets/hooks/actions'
import { roleCode, actionLabel } from '@/helpers/workflowLabels'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

interface ActionBannerProps {
  projet: MICRO_PROJET_T
}

export function ActionBanner({ projet }: ActionBannerProps) {
  const user = useAuthStore((s) => s.user)
  const currentUserRole = import.meta.env.VITE_MOCK_USER_ROLE || user?.role?.code || ''
  
  const { etapeRolesMap, isLoading: isLoadingRoles } = useEtapeRolesMap()
  const { versionsMap, isLoading: isLoadingVersions } = useWorkflowVersionsMap()
  const { executeAction } = useProjetActions()

  if (isLoadingRoles || isLoadingVersions) {
    return null
  }

  const instance = projet.workflow_instance
  if (!instance?.current_etape_code) {
    return null
  }

  const etapeRoles = etapeRolesMap[instance.current_etape_code] || []
  const etape = getEtapeActuelle(instance.workflow_version, instance.current_etape_code, versionsMap)
  
  if (!etape) {
    return null
  }

  const myRoles = etapeRoles.filter((r) => r.role_code === currentUserRole)
  const moi = myRoles.length > 0

  if (!moi) {
    // Cas où ce n'est pas à moi de jouer
    const acteursUniq = Array.from(new Map(etapeRoles.map((r) => [r.role_code, r])).values())
    const acteursText = acteursUniq.map((r) => roleCode(r.role_code, r.role)).join(' / ')

    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-6 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[15px] shrink-0">
            {etape.order || '-'}
          </div>
          <div>
            <h3 className="font-semibold text-[15px] text-slate-800">Chaîne de validation</h3>
            <p className="text-slate-500 text-[13px] font-mono mt-0.5">
              {etape.code} <span className="font-sans">·</span> <span className="font-sans">{etape.name}</span>
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-200/60 pt-4 flex items-center gap-2 text-[13px]">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-600">En attente de :</span>
          <span className="text-slate-500">{acteursText || 'Non assigné'}</span>
        </div>
      </div>
    )
  }

  // Cas où c'est à moi de jouer !
  return (
    <div className="bg-[#FFF4ED] border-l-4 border-l-[#E7722B] border-y border-y-[#F7E6DA] border-r border-r-[#F7E6DA] rounded-r-lg p-5 mb-6 flex flex-col gap-5 relative">
      {/* Ligne 1 : Titre (pleine largeur) */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#E7722B] text-white flex items-center justify-center font-bold text-[15px] shrink-0">
          {etape.order || '-'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[15px] text-slate-800">Chaîne de validation</h3>
          <p className="text-slate-500 text-[13px] font-mono mt-0.5 pr-2">
            {etape.code} <span className="font-sans">·</span> <span className="font-sans">{etape.name}</span>
          </p>
        </div>
      </div>

      {/* Ligne 2 : "À vous de jouer" (gauche) + Boutons (droite) */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        <div>
          <h4 className="font-bold text-[#C85E18] text-[14px] mb-1">À vous de jouer</h4>
          <p className="text-slate-600 text-[13px] leading-relaxed max-w-[400px]">
            Veuillez effectuer l'action requise pour faire avancer le dossier à l'étape suivante.
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto mt-1">
          {myRoles.map((r) => (
            <Button
              key={`${r.id}-${r.action}`}
              onClick={() => {
                useProjetsStore.getState().setSelectedProjet(null)
                executeAction(r.action, projet)
              }}
              className="bg-[#E7722B] hover:bg-[#C85E18] text-white shadow-md font-medium px-5 h-10"
            >
              <Check className="w-4 h-4 mr-2" />
              {actionLabel(r.action)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
