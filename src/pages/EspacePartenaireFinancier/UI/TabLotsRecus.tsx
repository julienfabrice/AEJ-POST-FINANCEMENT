import { useState } from 'react'
import { ChevronDown, ChevronUp, FileText, CheckCircle2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  MOCK_LOTS,
  type MockLot,
  type MockDossier,
} from '@/mock/espacePartenaireFinancier.mock'
import { StatusBadge, lotStatutBadge, approbationBadge } from '../components/StatusBadge'
import { money } from "@/helpers/money"

// ---------- Ligne dossier --------------------------------------------------

function DossierRow({ d, canEdit }: { d: MockDossier; canEdit?: boolean }) {
  const badge = approbationBadge(d.approbation)
  return (
    <div className="flex items-center gap-3 border border-[#E5EAF1] rounded-[8px] px-[14px] py-3 bg-white mb-2">
      {/* icône */}
      <div className="w-[26px] h-[26px] rounded-[8px] bg-[#131C29] text-white grid place-items-center flex-none">
        <FileText size={13} />
      </div>
      {/* info */}
      <div className="flex-1 min-w-0">
        <b className="block text-[13.5px] text-[#131C29]">
          {d.code} — {d.titre}
        </b>
        <span className="text-[11.5px] text-[#5A6B80]">
          {d.promoteur} · {money(d.montant)} sollicité
          {d.date_ouverture_compte && ` · compte ouvert le ${d.date_ouverture_compte}`}
        </span>
      </div>
      {/* badge */}
      <StatusBadge label={badge.label} variant={badge.variant} />
      {/* bouton Traiter */}
      {canEdit && d.approbation === 'EN_ATTENTE' && (
        <Button variant="outline" size="sm" className="text-[12px] h-7">
          Traiter
        </Button>
      )}
    </div>
  )
}

// ---------- Carte lot ------------------------------------------------------

function LotCard({ lot }: { lot: MockLot }) {
  const [expanded, setExpanded] = useState(true)
  const badge = lotStatutBadge(lot.statut)
  const pending = lot.dossiers.filter((d) => d.approbation === 'EN_ATTENTE').length

  return (
    <Card className="mb-4 p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
      {/* En-tête */}
      <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
        <h3 className="text-[14.5px] font-bold text-[#131C29]">{lot.reference}</h3>
        <div className="flex-1" />
        <span className="text-[12.5px] text-[#5A6B80]">
          {lot.partenaire} · {lot.dispositif}
        </span>
        <StatusBadge label={badge.label} variant={badge.variant} />
      </div>

      {/* Corps */}
      <div className="px-[18px] py-[16px]">
        {/* Méta-infos */}
        <div className="flex flex-wrap gap-[6px] mb-3">
          {[
            ['Courrier', lot.courrier_reference],
            ['Transmis le', lot.date_transmission],
            ['Couverture', `${lot.taux_couverture}%`],
            ['Différé', `${lot.duree_differe} mois`],
            ['Remboursement', `${lot.duree_remboursement} mois`],
            ['Convention', lot.reference_convention],
          ].map(([k, v]) => (
            <span
              key={k}
              className="text-[11.5px] bg-[#f4f6fa] border border-[#EEF2F7] rounded-[7px] px-[9px] py-[4px] text-[#5A6B80] inline-flex gap-[5px] items-center"
            >
              {k} <b className="text-[#131C29] font-semibold">{v}</b>
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Button variant="outline" size="sm" className="text-[12px] gap-1.5 h-8">
            <Download size={13} />
            Traiter par import Excel
          </Button>
          {pending === 0 && (
            <Button
              size="sm"
              className="bg-[#20A83A] hover:bg-[#178A2E] text-white text-[12px] gap-1.5 h-8"
              disabled={lot.statut === 'RETOURNE'}
            >
              <CheckCircle2 size={13} />
              Renvoyer le lot au chef de service
            </Button>
          )}
        </div>

        {/* Toggle dossiers */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-[#5A6B80] hover:text-[#131C29] mb-2 transition-colors"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {lot.dossiers.length} dossier(s)
          {pending > 0 && (
            <span className="text-[11px] bg-[#FBF1D6] text-[#8a6503] font-bold px-2 py-0.5 rounded-full">
              {pending} à traiter
            </span>
          )}
        </button>

        {/* Liste dossiers */}
        {expanded && (
          <div>
            {lot.dossiers.map((d) => (
              <DossierRow key={d.id} d={d} canEdit />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

// ---------- Tab principale -------------------------------------------------

export function TabLotsRecus() {
  if (MOCK_LOTS.length === 0) {
    return (
      <div className="text-center py-14 text-[#5A6B80]">
        <FileText size={40} className="mx-auto mb-3 opacity-40" />
        <b className="block text-[#131C29] text-[15px] mb-1 font-['Archivo']">
          Aucun lot reçu
        </b>
        <span className="text-[13px]">Aucun lot transmis par le partenaire financier.</span>
      </div>
    )
  }

  return (
    <div>
      {MOCK_LOTS.map((lot) => (
        <LotCard key={lot.id} lot={lot} />
      ))}
    </div>
  )
}
