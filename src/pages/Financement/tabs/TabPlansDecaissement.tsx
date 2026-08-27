import { useState } from 'react'
import { ChevronDown, ChevronUp, CreditCard, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { MOCK_PLANS, type MockPlan, type MockLignePlan } from '@/mock/financement.mock'
import { StatusBadge, planStatutBadge, ligneStatutBadge } from '../components/StatusBadge'
import { money } from '../utils/money'

// ---------- Chaîne de validation ------------------------------------------

function ChaineValidation({ statut }: { statut: MockPlan['statut'] }) {
  const steps = [
    { label: 'CIP', title: 'Conseiller en Insertion Professionnelle' },
    { label: 'CAR', title: 'Chef d\'Agence Régionale' },
    { label: 'SDRF', title: 'Chef Service Dév. Ressources Financement' },
    { label: 'SDEF', title: 'Sous-Dir. Évaluation Financière' },
    { label: 'SDPF', title: 'Sous-Dir. Partenariat et Financement' },
    { label: 'DPF', title: 'Directeur du Partenariat et du Financement' },
    { label: 'PF', title: 'Partenaire Financier' },
  ]

  const doneCount =
    statut === 'TRANSMIS_PF'
      ? steps.length
      : statut === 'EN_VALIDATION'
        ? 2
        : statut === 'BROUILLON'
          ? 0
          : 0

  return (
    <div className="flex flex-wrap gap-0 my-3 items-stretch">
      {steps.map((s, i) => {
        const isDone = i < doneCount
        const isCur = i === doneCount && statut === 'EN_VALIDATION'
        const isKo = statut === 'AJOURNE' && i === doneCount

        let cls =
          'border border-[#E5EAF1] bg-white text-[#5A6B80] text-[12px] px-3 py-2 flex items-center gap-2 flex-none first:rounded-l-[8px] last:rounded-r-[8px] border-r-0 last:border-r'
        if (isDone) cls = cls.replace('bg-white text-[#5A6B80]', 'bg-[#E3F6E7] border-[#c7ebd0] text-[#178A2E]')
        if (isCur) cls = cls.replace('bg-white text-[#5A6B80]', 'bg-[#FBEADE] border-[#f3cfb3] text-[#C85E18]')
        if (isKo) cls = cls.replace('bg-white text-[#5A6B80]', 'bg-[#FBE7E5] border-[#f2c9c5] text-[#D6453B]')

        return (
          <div key={s.label} className={cls} title={s.title}>
            <span
              className={`w-5 h-5 rounded-full grid place-items-center text-[10.5px] font-bold flex-none ${
                isDone
                  ? 'bg-[#20A83A] text-white'
                  : isCur
                    ? 'bg-[#E7722B] text-white'
                    : isKo
                      ? 'bg-[#D6453B] text-white'
                      : 'bg-[#EEF2F7] text-[#5A6B80]'
              }`}
            >
              {i + 1}
            </span>
            <b className="font-semibold">{s.label}</b>
          </div>
        )
      })}
    </div>
  )
}

// ---------- Ligne de décaissement ------------------------------------------

function LigneRow({ ligne }: { ligne: MockLignePlan }) {
  const badge = ligneStatutBadge(ligne.statut)
  const numCls =
    ligne.statut === 'EXECUTE'
      ? 'bg-[#20A83A]'
      : ligne.statut === 'AUTORISE'
        ? 'bg-[#E0A106]'
        : 'bg-[#131C29]'

  return (
    <div
      className={`border rounded-[8px] mb-2 overflow-hidden ${
        ligne.statut === 'EXECUTE'
          ? 'border-[#c7ebd0]'
          : ligne.statut === 'AUTORISE'
            ? 'border-[#f3cfb3]'
            : 'border-[#E5EAF1]'
      }`}
    >
      {/* En-tête numéro */}
      <div className="flex items-center gap-3 px-[14px] py-3 bg-white">
        <div
          className={`w-[26px] h-[26px] rounded-[8px] ${numCls} text-white grid place-items-center text-[12px] font-bold font-['Archivo'] flex-none`}
        >
          {ligne.num}
        </div>
        <div className="flex-1 min-w-0">
          <b className="block text-[13.5px] text-[#131C29]">{ligne.libelle}</b>
          <span className="text-[11.5px] text-[#5A6B80]">
            {[
              ligne.ordre && `Prestataire : ${ligne.ordre}`,
              ligne.date_prevue && `prévu le ${ligne.date_prevue}`,
              ligne.date_autorisation && `autorisé le ${ligne.date_autorisation}`,
              ligne.date_execution && `exécuté le ${ligne.date_execution}`,
            ]
              .filter(Boolean)
              .join(' · ')}
          </span>
        </div>
        <span className="font-mono font-semibold text-[13px] text-[#131C29] whitespace-nowrap">
          {money(ligne.montant)}
        </span>
        <StatusBadge label={badge.label} variant={badge.variant} />
        {ligne.statut === 'AUTORISE' && (
          <Button
            size="sm"
            className="bg-[#20A83A] hover:bg-[#178A2E] text-white text-[12px] gap-1 h-7"
          >
            <CheckCircle2 size={12} /> Exécuter
          </Button>
        )}
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
  plan: MockPlan | null
  open: boolean
  onClose: () => void
}) {
  if (!plan) return null
  const badge = planStatutBadge(plan.statut)
  const total = plan.lignes.reduce((s, l) => s + l.montant, 0)
  const decaisse = plan.lignes
    .filter((l) => l.statut === 'EXECUTE')
    .reduce((s, l) => s + l.montant, 0)

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
              <span className="font-mono">{plan.projet_id}</span> · plan de décaissement · voie{' '}
              {plan.voie === 'DIRECTION' ? 'Direction' : 'Agence'}
            </div>
            <SheetTitle className="text-[17px] font-bold text-[#131C29] mt-0.5">
              {plan.projet_titre}
            </SheetTitle>
            <div className="text-[12px] text-[#5A6B80]">
              {plan.promoteur} · {plan.agence}
            </div>
          </SheetHeader>
          <div className="mt-2">
            <StatusBadge label={badge.label} variant={badge.variant} />
          </div>
        </div>

        {/* Corps */}
        <div className="px-[22px] py-[22px] space-y-5">
          {/* Chaîne de validation */}
          <div>
            <p className="text-[11px] uppercase tracking-[.08em] text-[#8595A8] font-bold mb-1">
              Chaîne de validation
            </p>
            <ChaineValidation statut={plan.statut} />
          </div>

          {/* Infos */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
            {[
              ['Agence', plan.agence],
              ['Voie', plan.voie === 'DIRECTION' ? 'Direction' : 'Agence'],
              ['Validation bénéficiaire', plan.valide_benef ? '✔ Validé' : 'En attente'],
              ['Créé le', plan.cree],
              ['Montant du crédit', money(plan.montant_credit)],
              ['Montant total du plan', money(total)],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-[11px] uppercase tracking-[.04em] text-[#8595A8] font-bold mb-0.5">
                  {k}
                </div>
                <div className="font-semibold text-[#131C29]">{v}</div>
              </div>
            ))}
          </div>

          {/* Note */}
          {plan.note && (
            <div>
              <p className="text-[11px] uppercase tracking-[.08em] text-[#8595A8] font-bold mb-1">
                Note / Observations
              </p>
              <p className="text-[13px] text-[#5A6B80]">{plan.note}</p>
            </div>
          )}

          {/* Lignes */}
          <div>
            <p className="text-[11px] uppercase tracking-[.08em] text-[#8595A8] font-bold mb-2">
              Lignes de décaissement ({plan.lignes.length})
            </p>
            {plan.lignes.map((l) => (
              <LigneRow key={l.id} ligne={l} />
            ))}

            {/* Total */}
            <div className="flex items-center gap-3 px-[14px] py-3 bg-[#EEF2F7] rounded-[8px] font-bold">
              <div className="w-[26px] h-[26px] rounded-[8px] bg-[#5A6B80] text-white grid place-items-center text-[12px] font-bold flex-none">
                Σ
              </div>
              <div className="flex-1">
                <b className="text-[13.5px]">TOTAL</b>
                <span className="text-[11.5px] text-[#5A6B80] ml-2">
                  décaissé {money(decaisse)}
                </span>
              </div>
              <span className="font-mono text-[13px] font-bold">
                RESTE : {money(total - decaisse)}
              </span>
            </div>
          </div>
        </div>

        {/* Pied */}
        <div className="sticky bottom-0 bg-white border-t border-[#EEF2F7] px-[22px] py-[15px] flex gap-2">
          <Button variant="outline" onClick={onClose} className="text-[13px]">
            Fermer
          </Button>
          <Button variant="ghost" className="text-[13px] gap-1.5">
            <CreditCard size={14} /> Voir le dossier
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ---------- Carte plan -----------------------------------------------------

function PlanCard({ plan, onOpen }: { plan: MockPlan; onOpen: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const badge = planStatutBadge(plan.statut)
  const total = plan.lignes.reduce((s, l) => s + l.montant, 0)

  return (
    <Card className="mb-4 p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
      {/* En-tête */}
      <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
        <h3 className="text-[14.5px] font-bold text-[#131C29] min-w-0 truncate">
          {plan.projet_id} — {plan.projet_titre}
        </h3>
        <div className="flex-1" />
        <StatusBadge label={badge.label} variant={badge.variant} />
        <Button
          variant="outline"
          size="sm"
          className="text-[12px] gap-1 h-7"
          onClick={onOpen}
        >
          Ouvrir <ChevronDown size={12} />
        </Button>
      </div>

      {/* Corps */}
      <div className="px-[18px] py-[14px]">
        {/* Méta */}
        <div className="flex flex-wrap gap-[6px] mb-3">
          {[
            ['Promoteur', plan.promoteur],
            ['Agence', plan.agence],
            ['Voie', plan.voie === 'DIRECTION' ? 'Direction' : 'Agence'],
            [`${plan.lignes.length} ligne(s)`, money(total)],
            ['Bénéficiaire', plan.valide_benef ? 'validé' : 'en attente'],
          ].map(([k, v]) => (
            <span
              key={k}
              className="text-[11.5px] bg-[#f4f6fa] border border-[#EEF2F7] rounded-[7px] px-[9px] py-[4px] text-[#5A6B80] inline-flex gap-[5px] items-center"
            >
              {k} <b className="text-[#131C29] font-semibold">{v}</b>
            </span>
          ))}
        </div>

        {/* Chaîne compacte */}
        <ChaineValidation statut={plan.statut} />

        {/* Toggle lignes */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-[#5A6B80] hover:text-[#131C29] mt-2 transition-colors"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Masquer les lignes' : 'Voir les lignes'}
        </button>

        {expanded && (
          <div className="mt-2">
            {plan.lignes.map((l) => (
              <LigneRow key={l.id} ligne={l} />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

// ---------- Tab principale ------------------------------------------------

export function TabPlansDecaissement() {
  const [selectedPlan, setSelectedPlan] = useState<MockPlan | null>(null)

  return (
    <>
      <div>
        {MOCK_PLANS.length === 0 ? (
          <div className="text-center py-14 text-[#5A6B80]">
            <CreditCard size={40} className="mx-auto mb-3 opacity-40" />
            <b className="block text-[#131C29] text-[15px] mb-1 font-['Archivo']">
              Aucun plan de décaissement
            </b>
          </div>
        ) : (
          MOCK_PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onOpen={() => setSelectedPlan(plan)}
            />
          ))
        )}
      </div>

      <PlanDrawer
        plan={selectedPlan}
        open={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </>
  )
}
