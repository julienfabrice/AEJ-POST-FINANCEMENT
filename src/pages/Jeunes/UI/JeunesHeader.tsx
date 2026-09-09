import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { PROMOTEUR_T } from '@/types/promoteurs.types'
import { ExportPdfButton, type ExportColumn } from '@/components/generics/ExportPdfButton'

export function JeunesHeader({ rows }: { rows: PROMOTEUR_T[] }) {
  
  const exportColumns: ExportColumn<PROMOTEUR_T>[] = [
    { header: 'Matricule AEJ', accessor: (p) => p.matriculeaej || 'N/A' },
    { header: 'Nom', accessor: (p) => p.nom || 'N/A' },
    { header: 'Prénom', accessor: (p) => p.prenom || 'N/A' },
    { header: 'Email', accessor: (p) => p.email || 'N/A' },
    { header: 'Téléphone', accessor: (p) => p.telephone || 'N/A' },
    { header: 'Sexe', accessor: (p) => p.sexe?.libelle || p.sexe?.nom || 'N/A' },
    { header: "Tranche d'âge", accessor: (p) => p.tranche_age || 'N/A' },
    { header: 'Agence Régionale', accessor: (p) => p.agence_regionale?.nom || p.agence_regionale?.libelle || 'N/A' },
  ]

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29]">Promoteurs (porteurs)</h1>
        <p className="text-sm text-[#5A6B80] mt-1">Gestion des jeunes promoteurs enregistrés</p>
      </div>
      <div className="flex items-center gap-2">
        <ExportPdfButton
          data={rows}
          columns={exportColumns}
          fileName="promoteurs_aej.pdf"
          title="Liste des Promoteurs (Porteurs)"
        />
        {/* Création : désactivée car les données viennent de l'AEJ */}
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-block">
                <Button disabled size="sm" className="bg-[#E7722B]/50 text-white cursor-not-allowed">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nouveau promoteur
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[250px] text-center">
              Les données de cette table proviennent directement du système de l'AEJ.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
