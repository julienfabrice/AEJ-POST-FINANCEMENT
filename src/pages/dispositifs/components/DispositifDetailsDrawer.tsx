import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Workflow } from 'lucide-react'
import { formatMontant } from '@/helpers/numbers'
import type { DISPOSITIF_T } from '@/types'
import { Link } from '@tanstack/react-router'

interface DispositifDetailsDrawerProps {
  dispositif: DISPOSITIF_T | null
  onClose: () => void
}

export function DispositifDetailsDrawer({ dispositif: g, onClose }: DispositifDetailsDrawerProps) {
  if (!g) return null

  return (
    <Sheet open={!!g} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-[#F8FAFC] border-l-[#E5EAF1] p-0">
        <SheetHeader className="p-6 bg-white border-b border-[#E5EAF1]">
          <div className="flex items-center gap-[12px] mb-2">
            <div 
              className="w-12 h-12 rounded-[12px] flex items-center justify-center text-white shrink-0 shadow-sm"
              style={{ backgroundColor: g.guichet?.couleur || '#3498db' }}
            >
              <Workflow className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <SheetTitle className="text-[17px] text-[#131C29] leading-tight truncate">
                {g.intitule}
              </SheetTitle>
              <div className="font-mono text-[13px] text-[#8595A8] mt-1">
                {g.code}
              </div>
            </div>
          </div>
          <Link 
            to="/dispositif-workflow/$workflowId" 
            params={{ workflowId: g.workflow_version?.id?.toString() || '1' }}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-[#2D6BD4] text-white py-2 rounded-lg text-[13.5px] font-semibold hover:bg-[#2054A5] transition-colors"
          >
            Consulter le workflow
          </Link>
        </SheetHeader>

        <div className="p-6 space-y-6">
          <div className="bg-white rounded-xl border border-[#E5EAF1] p-4 shadow-sm">
            <h4 className="text-[13px] font-bold text-[#131C29] mb-4 uppercase tracking-wider">Informations financières</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[13.5px]">
                <span className="text-[#5A6B80]">Budget alloué</span>
                <b className="font-mono">{formatMontant(g.budget_alloue?.toString() || '0', 'F')}</b>
              </div>
              <div className="flex justify-between items-center text-[13.5px]">
                <span className="text-[#5A6B80]">Montant min</span>
                <b className="font-mono">{formatMontant(g.montant_min?.toString() || '0', 'F')}</b>
              </div>
              <div className="flex justify-between items-center text-[13.5px]">
                <span className="text-[#5A6B80]">Montant max</span>
                <b className="font-mono">{formatMontant(g.montant_max?.toString() || '0', 'F')}</b>
              </div>
              <div className="flex justify-between items-center text-[13.5px] pt-3 border-t border-[#F1F5F9]">
                <span className="text-[#5A6B80]">Taux d'intérêt</span>
                <b className="font-mono text-[#2D6BD4] bg-[#E5EDFB] px-2 py-0.5 rounded">{g.taux}%</b>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E5EAF1] p-4 shadow-sm">
            <h4 className="text-[13px] font-bold text-[#131C29] mb-4 uppercase tracking-wider">Caractéristiques</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[13.5px]">
                <span className="text-[#5A6B80]">Durée</span>
                <b>{g.duree} mois</b>
              </div>
              <div className="flex justify-between items-center text-[13.5px]">
                <span className="text-[#5A6B80]">Emplois prévus</span>
                <b>{g.nbre_emplois_prevu}</b>
              </div>
              <div className="flex justify-between items-center text-[13.5px]">
                <span className="text-[#5A6B80]">Bénéficiaires prévus</span>
                <b>{g.nbre_beneficiaire_prevu}</b>
              </div>
              <div className="flex justify-between items-center text-[13.5px]">
                <span className="text-[#5A6B80]">Micro-projets prévus</span>
                <b>{g.nbre_micro_projet_prevu}</b>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E5EAF1] p-4 shadow-sm">
            <h4 className="text-[13px] font-bold text-[#131C29] mb-4 uppercase tracking-wider">Workflow associé</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[13.5px]">
                <span className="text-[#5A6B80]">Version</span>
                <b className="font-mono">{g.workflow_version?.code}</b>
              </div>
              <div className="flex justify-between items-center text-[13.5px]">
                <span className="text-[#5A6B80]">Créé le</span>
                <b>{new Date(g.created_at || '').toLocaleDateString('fr-FR')}</b>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
