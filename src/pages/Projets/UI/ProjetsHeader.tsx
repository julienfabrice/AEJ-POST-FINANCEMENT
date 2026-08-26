import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PermissionGate } from '@/components/PermissionGate'
import { MODULES } from '@/constants/modules'
import { ExportPdfButton } from '@/components/generics/ExportPdfButton'
import type { ExportColumn } from '@/components/generics/ExportPdfButton'
import { useProjetsStore } from '@/store/useProjetsStore'
import { configurationServices } from '@/services/configurations.services'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import dayjs from 'dayjs'

export function ProjetsHeader() {
  const { projets } = useProjetsStore()
  const { data: configuration } = configurationServices.useGet()

  const exportColumns = useMemo<ExportColumn<MICRO_PROJET_T>[]>(() => [
    { header: 'Référence', accessor: (p) => p.code },
    { header: 'Titre du projet', accessor: (p) => p.intitule },
    { header: 'Promoteur', accessor: (p) => p.promoteur ? `${p.promoteur.prenom} ${p.promoteur.nom}` : '-' },
    { header: 'Agence', accessor: (p) => p.agence?.libelle || '-' },
    { header: 'Montant', accessor: (p) => p.montant_total ? `${new Intl.NumberFormat('fr-FR').format(parseFloat(p.montant_total))} ${configuration?.sigle_monnaie_pays || 'FCFA'}` : '0' },
    { header: 'Statut', accessor: (p) => p.statut ? p.statut.replace(/_/g, ' ') : (p.stade_projet || '-') },
    { header: 'Date', accessor: (p) => p.created_at ? dayjs(p.created_at).format('DD/MM/YYYY') : '-' },
  ], [configuration?.sigle_monnaie_pays])

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29]">Micro-projets</h1>
        <p className="text-sm text-[#5A6B80] mt-1">Suivi des dossiers de financement des jeunes promoteurs</p>
      </div>
      <div className="flex items-center gap-2">
        <ExportPdfButton
          data={projets}
          columns={exportColumns}
          fileName="liste-micro-projets.pdf"
          title="Liste des Micro-projets"
          subtitle="Suivi des dossiers de financement"
        />
        {/* Création : réservée au `full_access` sur le module. */}
        <PermissionGate module={MODULES.PROJETS} action="c">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau dossier
          </Button>
        </PermissionGate>
      </div>
    </div>
  )
}
