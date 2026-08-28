import { useState } from 'react'
import { ChevronDown, ChevronUp, CreditCard, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { planDecaissementServices } from '@/services/planDecaissements.services'
import { StatusBadge, ligneStatutBadge } from '../components/StatusBadge'
import { money } from "@/helpers/money"
import { formatDate } from "@/helpers/date"
import { refLabel } from '@/types/referentials.types'
import type { PLAN_DECAISSEMENT_T, LIGNE_DECAISSEMENT_T } from '@/types'

// ---------- Ligne de décaissement ------------------------------------------

function LigneRow({ ligne }: { ligne: LIGNE_DECAISSEMENT_T }) {
  const badge = ligneStatutBadge(ligne.statut)
  const numCls =
    ligne.statut === 'VALIDE'
      ? 'bg-[#20A83A]'
      : 'bg-[#131C29]'

  return (
    <div
      className={`border rounded-[8px] mb-2 overflow-hidden ${
        ligne.statut === 'VALIDE'
          ? 'border-[#c7ebd0]'
          : 'border-[#E5EAF1]'
      }`}
    >
      {/* En-tête numéro */}
      <div className="flex items-center gap-3 px-[14px] py-3 bg-white">
        <div
          className={`w-[26px] h-[26px] rounded-[8px] ${numCls} text-white grid place-items-center text-[12px] font-bold font-['Archivo'] flex-none`}
        >
          {ligne.numero_ligne}
        </div>
        <div className="flex-1 min-w-0">
          <b className="block text-[13.5px] text-[#131C29]">{ligne.object_ligne || `Ligne #${ligne.numero_ligne}`}</b>
          <span className="text-[11.5px] text-[#5A6B80]">
            {[
              ligne.intitule_prestataire && `Prestataire : ${ligne.intitule_prestataire}`,
              ligne.mode_decaisse && `Mode : ${ligne.mode_decaisse}`,
              ligne.date_prevue && `Prévu le : ${formatDate(ligne.date_prevue)}`,
              ligne.numero_compte && `Compte : ${ligne.numero_compte}`,
              ligne.contact && `Contact : ${ligne.contact}`,
            ]
              .filter(Boolean)
              .join(' · ')}
          </span>
          {ligne.observations && (
            <span className="block text-[11px] text-[#8595A8] mt-0.5 italic">
              Note : {ligne.observations}
            </span>
          )}
        </div>
        <span className="font-mono font-semibold text-[13px] text-[#131C29] whitespace-nowrap">
          {money(Number(ligne.montant_ligne))}
        </span>
        <StatusBadge label={badge.label} variant={badge.variant} />
      </div>
    </div>
  )
}

// ---------- Drawer plan détail --------------------------------------------

function PlanDrawer({
  plan,
  open,
  onClose,
}: {
  plan: PLAN_DECAISSEMENT_T | null
  open: boolean
  onClose: () => void
}) {
  if (!plan) return null
  const lignes = plan.lignes ?? []
  const total = Number(plan.montant_planifie) || lignes.reduce((s, l) => s + Number(l.montant_ligne), 0)
  const decaisse = lignes
    .filter((l) => l.statut === 'VALIDE')
    .reduce((s, l) => s + Number(l.montant_ligne), 0)

  const projet = plan.micro_projet
  const promoteurName = projet?.promoteur ? `${projet.promoteur.nom} ${projet.promoteur.prenom}` : '—'
  const agenceName = projet?.agence ? refLabel(projet.agence) : '—'

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-[560px] max-w-[94vw] p-0 bg-[#F3F5F8] overflow-y-auto"
      >
        {/* En-tête sticky */}
        <div className="sticky top-0 bg-white border-b border-[#E5EAF1] px-[22px] py-[18px] z-10">
          <SheetHeader className="p-0">
            <div className="text-[11px] text-[#5A6B80]">
              <span className="font-mono">{plan.code || `#PLAN-${plan.id}`}</span> · Plan de décaissement
            </div>
            <SheetTitle className="text-[17px] font-bold text-[#131C29] mt-0.5">
              {plan.intitule || projet?.intitule || `Plan #${plan.id}`}
            </SheetTitle>
            <div className="text-[12px] text-[#5A6B80]">
              {promoteurName} · {agenceName}
            </div>
          </SheetHeader>
        </div>

        {/* Corps */}
        <div className="px-[22px] py-[22px] space-y-5">
          {/* Infos */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px] bg-white p-4 rounded-[9px] border border-[#E5EAF1]">
            {[
              ['Code', plan.code || `PLAN-${plan.id}`],
              ['Date prévue', formatDate(plan.date_prevue)],
              ['Projet', projet?.intitule || (plan.budget_id ? `Budget #${plan.budget_id}` : '—')],
              ['Montant planifié', money(total)],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-[11px] uppercase tracking-[.04em] text-[#8595A8] font-bold mb-0.5">
                  {k}
                </div>
                <div className="font-semibold text-[#131C29]">{v}</div>
              </div>
            ))}
          </div>

          {/* Lignes */}
          <div>
            <p className="text-[11px] uppercase tracking-[.08em] text-[#8595A8] font-bold mb-2">
              Lignes de décaissement ({lignes.length})
            </p>
            {lignes.length === 0 ? (
              <div className="text-center py-6 text-[13px] text-[#8595A8] bg-white rounded-[8px] border border-[#E5EAF1]">
                Aucune ligne de décaissement associée.
              </div>
            ) : (
              lignes.map((l, index) => (
                <LigneRow key={l.id ?? index} ligne={l} />
              ))
            )}

            {/* Total */}
            {lignes.length > 0 && (
              <div className="flex items-center gap-3 px-[14px] py-3 bg-[#EEF2F7] rounded-[8px] font-bold mt-2">
                <div className="w-[26px] h-[26px] rounded-[8px] bg-[#5A6B80] text-white grid place-items-center text-[12px] font-bold flex-none">
                  Σ
                </div>
                <div className="flex-1">
                  <b className="text-[13.5px]">TOTAL PLANIFIÉ : {money(total)}</b>
                  <span className="text-[11.5px] text-[#5A6B80] ml-2">
                    validé : {money(decaisse)}
                  </span>
                </div>
                <span className="font-mono text-[13px] font-bold">
                  RESTE : {money(Math.max(0, total - decaisse))}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Pied */}
        <div className="sticky bottom-0 bg-white border-t border-[#EEF2F7] px-[22px] py-[15px] flex gap-2">
          <Button variant="outline" onClick={onClose} className="text-[13px]">
            Fermer
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ---------- Carte plan -----------------------------------------------------

function PlanCard({ plan, onOpen }: { plan: PLAN_DECAISSEMENT_T; onOpen: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const lignes = plan.lignes ?? []
  const total = Number(plan.montant_planifie) || lignes.reduce((s, l) => s + Number(l.montant_ligne), 0)

  const projet = plan.micro_projet
  const promoteurName = projet?.promoteur ? `${projet.promoteur.nom} ${projet.promoteur.prenom}` : null

  return (
    <Card className="mb-4 p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
      {/* En-tête */}
      <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
        <h3 className="text-[14.5px] font-bold text-[#131C29] min-w-0 truncate">
          {plan.code || `PLAN-${plan.id}`} — {plan.intitule || projet?.intitule || 'Plan de décaissement'}
        </h3>
        <div className="flex-1" />
        <span className="font-mono font-semibold text-[13.5px] text-[#131C29]">
          {money(total)}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="text-[12px] gap-1 h-7 ml-2"
          onClick={onOpen}
        >
          Détails <ChevronDown size={12} />
        </Button>
      </div>

      {/* Corps */}
      <div className="px-[18px] py-[14px]">
        {/* Méta */}
        <div className="flex flex-wrap gap-[6px] mb-2">
          {([
            promoteurName ? ['Promoteur', promoteurName] : null,
            plan.budget_id ? ['Budget ID', `#${plan.budget_id}`] : null,
            plan.date_prevue ? ['Date prévue', formatDate(plan.date_prevue)] : null,
            [`${lignes.length} ligne(s)`, money(total)],
          ] as [string, string][])
            .filter((item): item is [string, string] => Boolean(item))
            .map(([k, v]) => (
              <span
                key={k}
                className="text-[11.5px] bg-[#f4f6fa] border border-[#EEF2F7] rounded-[7px] px-[9px] py-[4px] text-[#5A6B80] inline-flex gap-[5px] items-center"
              >
                {k} <b className="text-[#131C29] font-semibold">{v}</b>
              </span>
            ))}
        </div>

        {/* Toggle lignes */}
        {lignes.length > 0 && (
          <>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-[#5A6B80] hover:text-[#131C29] mt-2 transition-colors"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expanded ? 'Masquer les lignes' : `Voir les ${lignes.length} ligne(s)`}
            </button>

            {expanded && (
              <div className="mt-2">
                {lignes.map((l, index) => (
                  <LigneRow key={l.id ?? index} ligne={l} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}

// ---------- Tab principale ------------------------------------------------

export function TabPlansDecaissement() {
  const { data: plans = [], isLoading, error } = planDecaissementServices.useGetAll()
  const [selectedPlan, setSelectedPlan] = useState<PLAN_DECAISSEMENT_T | null>(null)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#5A6B80]">
        <Loader2 size={32} className="animate-spin text-[#E7722B] mb-2" />
        <span className="text-[13px]">Chargement des plans de décaissement...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-14 text-[#D6453B]">
        <CreditCard size={40} className="mx-auto mb-3 opacity-60" />
        <b className="block text-[15px] mb-1 font-['Archivo']">Erreur de chargement</b>
        <span className="text-[13px]">Impossible de récupérer les plans de décaissement.</span>
      </div>
    )
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-14 text-[#5A6B80]">
        <CreditCard size={40} className="mx-auto mb-3 opacity-40" />
        <b className="block text-[#131C29] text-[15px] mb-1 font-['Archivo']">
          Aucun plan de décaissement
        </b>
        <span className="text-[13px]">Aucun plan de décaissement enregistré.</span>
      </div>
    )
  }

  return (
    <>
      <div>
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onOpen={() => setSelectedPlan(plan)}
          />
        ))}
      </div>

      <PlanDrawer
        plan={selectedPlan}
        open={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </>
  )
}

