import { useState } from 'react'
import { ChevronDown, ChevronUp, FileText, CheckCircle2, Download, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { lotsTransmissionServices } from '@/services/lotsTransmission.services'
import { StatusBadge, lotStatutBadge, approbationBadge } from '../components/StatusBadge'
import { money } from "@/helpers/money"
import { formatDate } from "@/helpers/date"
import { refLabel } from '@/types/referentials.types'
import type { LOT_TRANSMISSION_T } from '@/types'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

// ---------- Ligne dossier --------------------------------------------------

function DossierRow({ d }: { d: MICRO_PROJET_T }) {
  const badge = approbationBadge(d.statut)
  const promoteurName = d.promoteur ? `${d.promoteur.nom} ${d.promoteur.prenom}` : '—'
  const montant = d.montant_total ? Number(d.montant_total) : 0

  return (
    <div className="flex items-center gap-3 border border-[#E5EAF1] rounded-[8px] px-[14px] py-3 bg-white mb-2">
      {/* icône */}
      <div className="w-[26px] h-[26px] rounded-[8px] bg-[#131C29] text-white grid place-items-center flex-none">
        <FileText size={13} />
      </div>
      {/* info */}
      <div className="flex-1 min-w-0">
        <b className="block text-[13.5px] text-[#131C29]">
          {d.code} — {d.intitule}
        </b>
        <span className="text-[11.5px] text-[#5A6B80]">
          {promoteurName} {montant > 0 && `· ${money(montant)} sollicité`}
          {d.stade_projet && ` · ${d.stade_projet}`}
          {d.type_projet && ` (${d.type_projet})`}
        </span>
      </div>
      {/* badge */}
      <StatusBadge label={badge.label} variant={badge.variant} />
    </div>
  )
}

// ---------- Carte lot ------------------------------------------------------

function LotCard({ lot }: { lot: LOT_TRANSMISSION_T }) {
  const [expanded, setExpanded] = useState(true)
  const badge = lotStatutBadge(lot.statut)
  const { mutate: validateLot, isPending: isValidating } = lotsTransmissionServices.useValidate()

  const dossiers = lot.dossiers ?? []
  const partenaireName = lot.organisme ? (lot.organisme.sigle || lot.organisme.nom) : `Organisme #${lot.organisme_id}`
  const guichetName = lot.guichet ? refLabel(lot.guichet) : `Guichet #${lot.guichet_id}`

  return (
    <Card className="mb-4 p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
      {/* En-tête */}
      <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
        <h3 className="text-[14.5px] font-bold text-[#131C29]">
          {lot.code} {lot.titre ? `— ${lot.titre}` : ''}
        </h3>
        <div className="flex-1" />
        <span className="text-[12.5px] text-[#5A6B80]">
          {partenaireName} · {guichetName}
        </span>
        <StatusBadge label={badge.label} variant={badge.variant} />
      </div>

      {/* Corps */}
      <div className="px-[18px] py-[16px]">
        {/* Méta-infos */}
        <div className="flex flex-wrap gap-[6px] mb-3">
          {[
            ['Réf. Courrier', lot.reference_courrier || '—'],
            ['Transmis le', formatDate(lot.date_transmission)],
            ['Taux recouvrement', lot.taux_recouvrement !== undefined && lot.taux_recouvrement !== null ? `${Number(lot.taux_recouvrement) * (Number(lot.taux_recouvrement) <= 1 ? 100 : 1)}%` : '—'],
            ['Différé', lot.duree_differee ? `${lot.duree_differee} mois` : '—'],
            ['Remboursement', lot.duree_remboursement ? `${lot.duree_remboursement} mois` : '—'],
            ['Convention', lot.reference_convention || '—'],
          ].map(([k, v]) => (
            <span
              key={k}
              className="text-[11.5px] bg-[#f4f6fa] border border-[#EEF2F7] rounded-[7px] px-[9px] py-[4px] text-[#5A6B80] inline-flex gap-[5px] items-center"
            >
              {k} <b className="text-[#131C29] font-semibold">{v}</b>
            </span>
          ))}
        </div>

        {/* Actions & fichiers */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {lot.fichier_repartition && (
            <a
              href={lot.fichier_repartition}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] h-8 px-3 rounded-[6px] border border-[#E5EAF1] bg-white hover:bg-slate-50 text-[#131C29] font-medium transition-colors"
            >
              <Download size={13} />
              Fichier de répartition
            </a>
          )}
          {lot.fichier_courrier && (
            <a
              href={lot.fichier_courrier}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] h-8 px-3 rounded-[6px] border border-[#E5EAF1] bg-white hover:bg-slate-50 text-[#131C29] font-medium transition-colors"
            >
              <ExternalLink size={13} />
              Fichier courrier
            </a>
          )}

          {lot.statut === 'TRANSMIS' && (
            <Button
              size="sm"
              onClick={() => validateLot({ id: lot.id, statut: 'TRAITE' })}
              disabled={isValidating}
              className="bg-[#20A83A] hover:bg-[#178A2E] text-white text-[12px] gap-1.5 h-8 ml-auto"
            >
              <CheckCircle2 size={13} />
              Marquer comme traité
            </Button>
          )}
        </div>

        {/* Toggle dossiers */}
        {dossiers.length > 0 && (
          <>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-[#5A6B80] hover:text-[#131C29] mb-2 transition-colors"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {dossiers.length} dossier(s)
            </button>

            {/* Liste dossiers */}
            {expanded && (
              <div>
                {dossiers.map((d) => (
                  <DossierRow key={d.id} d={d} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}

// ---------- Tab principale -------------------------------------------------

export function TabLotsRecus() {
  const { data: lots = [], isLoading, error } = lotsTransmissionServices.useGetAll()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#5A6B80]">
        <Loader2 size={32} className="animate-spin text-[#E7722B] mb-2" />
        <span className="text-[13px]">Chargement des lots reçus...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-14 text-[#D6453B]">
        <FileText size={40} className="mx-auto mb-3 opacity-60" />
        <b className="block text-[15px] mb-1 font-['Archivo']">Erreur de chargement</b>
        <span className="text-[13px]">Impossible de récupérer la liste des lots de transmission.</span>
      </div>
    )
  }

  if (lots.length === 0) {
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
      {lots.map((lot) => (
        <LotCard key={lot.id} lot={lot} />
      ))}
    </div>
  )
}

