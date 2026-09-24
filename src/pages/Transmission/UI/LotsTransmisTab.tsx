import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import { Card } from '@/components/ui/card'
import { DataGrid } from '@/components/ui/DataGrid'
import { StatusBadge } from '../../EspacePartenaireFinancier/components/StatusBadge'
import { money } from "@/helpers/money"
import type { LOT_TRANSMISSION_T, LOT_MICRO_PROJET_T } from '@/types'
import { lotsMicroProjetsServices } from '@/services/lotsMicroProjets.services'
import dayjs from 'dayjs'

function LotDossiersCount({ lotId }: { lotId: number }) {
  const { data: dossiers = [] } = lotsMicroProjetsServices.useGetAll(lotId)
  return (
    <span className="inline-flex items-center justify-center font-bold text-[11.5px] px-2 py-0.5 rounded-full bg-[#E5F0FF] text-[#2D6BD4]">
      {dossiers.length}
    </span>
  )
}

function LotDossiersList({ lot }: { lot: LOT_TRANSMISSION_T }) {
  const { data: dossiers = [] } = lotsMicroProjetsServices.useGetAll(lot.id)
  
  return (
    <div className="flex flex-col gap-2">
      {dossiers.map((d: LOT_MICRO_PROJET_T) => {
        const p = d.micro_projet || (d as any)
        return (
          <div key={p.id} className="bg-white border border-[#E5EAF1] p-3 rounded flex items-center gap-4 hover:border-[#D0D7E2] cursor-pointer transition-colors">
            <div className="text-[#8595A8]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div className="flex-1 min-w-0">
              <b className="block text-[13px] text-[#131C29] truncate">
                {p.code} — {p.intitule}
              </b>
              <span className="block text-[11.5px] text-[#5A6B80] truncate mt-0.5">
                Réf. {lot.reference_courrier || '-'} · transmis le {lot.date_transmission ? dayjs(lot.date_transmission).format('DD/MM/YYYY') : '-'} · couverture {lot.taux_recouvrement || 0}% · différé {lot.duree_differee || 0} mois · remboursement {lot.duree_remboursement || 0} mois · convention {lot.reference_convention || '-'}
              </span>
            </div>
            <div className="text-[14px] font-mono font-bold text-[#131C29] shrink-0">
              {money(Number(p.montant_total) || 0)}
            </div>
            <div className="shrink-0">
              <StatusBadge
                label={p.workflow_instance ? 'Approuvé' : 'En attente'}
                variant={p.workflow_instance ? 'gr' : 'am'}
              />
            </div>
          </div>
        )
      })}
      {dossiers.length === 0 && (
        <div className="text-[12px] text-[#8595A8] italic py-2">
          Aucun dossier rattaché à ce lot.
        </div>
      )}
    </div>
  )
}

interface LotsTransmisTabProps {
  lots: LOT_TRANSMISSION_T[]
  isLoading: boolean
}

export function LotsTransmisTab({ lots, isLoading }: LotsTransmisTabProps) {
  if (isLoading) {
    return <div className="p-10 text-center text-[#5A6B80]">Chargement des lots...</div>
  }

  if (!lots || lots.length === 0) {
    return (
      <Card className="p-10 text-center text-[#5A6B80] border-[#E5EAF1] shadow-none">
        Aucun lot de transmission trouvé.
      </Card>
    )
  }

  const columnDefs = useMemo<ColDef<LOT_TRANSMISSION_T>[]>(() => [
    {
      headerName: 'Lot',
      field: 'code',
      cellRenderer: (p: any) => (
        <div className="leading-tight flex flex-col justify-center h-full">
          <b className="text-[#2D6BD4] font-semibold">{p.data?.code}</b>
          <span className="text-[#5A6B80] text-[12px] truncate">{p.data?.titre}</span>
        </div>
      ),
      flex: 2,
      minWidth: 220,
    },
    {
      headerName: 'Guichet',
      valueGetter: (p) => p.data?.guichet?.code || 'N/A',
      cellRenderer: (p: any) => (
        <div className="flex items-center h-full">
          <span className="inline-flex items-center justify-center font-mono font-semibold text-[11px] px-2.5 py-0.5 rounded-full bg-[#EEF2F7] text-[#5A6B80]">
            {p.value}
          </span>
        </div>
      ),
      flex: 1,
      minWidth: 140,
    },
    {
      headerName: 'Partenaire',
      valueGetter: (p) => p.data?.organisme?.nom || 'N/A',
      cellRenderer: (p: any) => (
        <span className="text-[13px] text-[#131C29]">{p.value}</span>
      ),
      flex: 1.5,
      minWidth: 150,
    },
    {
      headerName: 'Dossiers',
      cellRenderer: (p: any) => p.data ? (
        <div className="flex items-center h-full">
          <LotDossiersCount lotId={p.data.id} />
        </div>
      ) : null,
      width: 100,
      suppressSizeToFit: true,
    },
    {
      headerName: 'Réf. courrier',
      field: 'reference_courrier',
      cellRenderer: (p: any) => (
        <span className="font-mono text-[#5A6B80] text-[13px]">{p.value || '-'}</span>
      ),
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Transmis le',
      valueGetter: (p) => p.data?.date_transmission ? dayjs(p.data.date_transmission).format('DD/MM/YYYY') : '-',
      cellRenderer: (p: any) => (
        <span className="text-[13px] text-[#5A6B80]">{p.value}</span>
      ),
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: 'Couverture',
      valueGetter: (p) => p.data?.taux_recouvrement ? `${p.data.taux_recouvrement}%` : '-',
      cellRenderer: (p: any) => (
        <span className="text-[13px] text-[#5A6B80]">{p.value}</span>
      ),
      width: 110,
      suppressSizeToFit: true,
    },
    {
      headerName: 'Statut',
      cellRenderer: (p: any) => {
        const l = p.data;
        if (!l) return null;
        return (
          <div className="flex items-center h-full">
            <StatusBadge
              label={l.statut === 'TRANSMIS' ? 'Transmis au partenaire' : l.statut === 'TRAITE' ? 'Traité' : l.statut === 'REJETE' ? 'Rejeté' : 'Brouillon'}
              variant={l.statut === 'TRANSMIS' ? 'or' : l.statut === 'TRAITE' ? 'gr' : l.statut === 'REJETE' ? 'rd' : 'gy'}
            />
          </div>
        )
      },
      flex: 1,
      minWidth: 180,
    },
    {
      headerName: 'Actions',
      cellRenderer: () => (
        <div className="flex items-center justify-end gap-1 w-full h-full">
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#8595A8] hover:bg-[#EEF2F7] hover:text-[#2D6BD4] transition-colors" title="Modifier">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#8595A8] hover:bg-[#FBE7E5] hover:text-[#D6453B] transition-colors" title="Supprimer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      ),
      width: 100,
      sortable: false,
      filter: false,
      headerClass: 'ag-right-aligned-header',
    }
  ], [])

  return (
    <div className="space-y-5">
      <Card className="p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
        <DataGrid
          columnDefs={columnDefs}
          rowData={lots}
          domLayout="autoHeight"
          pagination={false}
          height="auto"
          rowHeight={60}
          headerHeight={44}
          suppressCellFocus={true}
        />
      </Card>

      <Card className="flex p-0 flex-col border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05)] overflow-hidden">
        <div className="p-4 border-b border-[#EEF2F7]">
          <h3 className="text-[14px] font-bold text-[#131C29]">Dossiers par lot</h3>
        </div>
        <div className="p-4 bg-[#fafbfd] flex flex-col gap-6">
          {lots.map((l) => (
            <div key={l.id} className="flex flex-col gap-3">
              <div className="text-[13px] font-semibold text-[#131C29] flex items-center gap-2">
                {l.code} · {l.organisme?.nom || 'N/A'}
                <StatusBadge
                  label={
                    l.statut === 'TRANSMIS'
                      ? 'Transmis'
                      : l.statut === 'TRAITE'
                        ? 'Traité'
                        : l.statut === 'REJETE'
                          ? 'Rejeté'
                          : 'Brouillon'
                  }
                  variant={
                    l.statut === 'TRANSMIS'
                      ? 'or'
                      : l.statut === 'TRAITE'
                        ? 'gr'
                        : l.statut === 'REJETE'
                          ? 'rd'
                          : 'gy'
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <LotDossiersList lot={l} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
