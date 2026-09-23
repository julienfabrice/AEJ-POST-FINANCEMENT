import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  FolderOpen,
  Check,
  X,
  ChevronRight,
} from 'lucide-react'
import { useProjetsStore } from '@/store/useProjetsStore'
import { cn } from '@/lib/utils'

// ─── Données statiques mock (Phase 1) ───────────────────────────────────────

const MOCK_PLAN = {
  code: 'MP-2025-0042',
  titre: "Développement d'une plateforme de vente en ligne de produits artisanaux",
  beneficiaire: 'Konan Adjoua Marie',
  agence: "Agence Régionale d'Abidjan Plateau",
  voie: 'Agence',
  statut: 'EN_VALIDATION' as const,
  saisisseur: 'Bamba Lamine (CIP)',
  pointFocal: 'Banque Atlantique CI — M. Coulibaly',
  dateCree: '12/01/2025',
  validationBeneficiaire: true,
  fichierSigne: 'plan_decaissement_MP-2025-0042_signe.pdf',
  montantTotal: '8 500 000 F CFA',
  montantCredit: '10 000 000 F CFA',
  note: "Décaissement prévu en 3 tranches conditionnées à l'avancement des travaux de développement de la plateforme et à la certification du prestataire.",
}

const MOCK_CHAINE = [
  { role: 'CIP (saisisseur)', statut: 'done' as const },
  { role: "Chargé d'appui régional", statut: 'current' as const },
  { role: 'Directeur régional', statut: 'pending' as const },
  { role: 'Partenaire financier', statut: 'pending' as const },
]

const MOCK_LIGNES = [
  { num: 1, libelle: "Frais d'actes de sûreté", montant: '250 000 F', datePrevue: '15/02/2025', mode: 'Virement', statut: 'PREVU' },
  { num: 1, libelle: 'Assurance vie', montant: '150 000 F', datePrevue: '15/02/2025', mode: 'Virement', statut: 'PREVU' },
  { num: 2, libelle: 'Achat équipements informatiques', montant: '3 500 000 F', datePrevue: '01/03/2025', mode: 'Virement', statut: 'PREVU' },
  { num: 3, libelle: 'Développement plateforme (solde)', montant: '4 600 000 F', datePrevue: '01/04/2025', mode: 'Chèque', statut: 'PREVU' },
]

const MOCK_HISTORIQUE: {
  role: string
  acteur: string
  date: string
  decision: 'SOUMIS' | 'VALIDE' | 'AJOURNE'
  motif?: string
}[] = [
  {
    role: 'CIP (saisisseur)',
    acteur: 'Bamba Lamine',
    date: '12/01/2025',
    decision: 'SOUMIS',
    motif: 'Plan soumis à la validation de la chaîne.',
  },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

const STATUT_PLAN: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  BROUILLON:    { label: 'Brouillon',         variant: 'outline' },
  EN_VALIDATION:{ label: 'En validation',     variant: 'default' },
  AJOURNE:      { label: 'Ajourné',           variant: 'destructive' },
  TRANSMIS_PF:  { label: 'Transmis au PF',    variant: 'secondary' },
}

const STATUT_LIGNE: Record<string, { label: string; color: string }> = {
  PREVU:       { label: 'Prévu',      color: 'text-slate-500 bg-slate-100' },
  AUTORISE:    { label: 'Autorisé',   color: 'text-amber-700 bg-amber-100' },
  EXECUTE:     { label: 'Exécuté',    color: 'text-green-700 bg-green-100' },
}

// ─── Sous-composants ─────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mt-5 mb-2 pb-1.5 border-b border-slate-100">
      {children}
    </h4>
  )
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-px bg-slate-100 border border-slate-100 rounded-lg overflow-hidden text-sm">
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white px-3 py-2.5">
      <div className="text-[11px] font-semibold text-slate-400 mb-0.5">{label}</div>
      <div className="text-[13px] font-medium text-slate-800">{children}</div>
    </div>
  )
}

function ChaineValidation() {
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1">
      {MOCK_CHAINE.map((step, i) => (
        <div key={i} className="flex items-center shrink-0">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-none',
                step.statut === 'done'    && 'bg-green-500 text-white',
                step.statut === 'current' && 'bg-[#E7722B] text-white ring-2 ring-[#E7722B]/30 ring-offset-1',
                step.statut === 'pending' && 'bg-slate-200 text-slate-400',
              )}
            >
              {step.statut === 'done' ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span
              className={cn(
                'text-[10px] font-medium text-center max-w-[80px] leading-tight',
                step.statut === 'current' && 'text-[#C85E18]',
                step.statut === 'pending' && 'text-slate-400',
                step.statut === 'done'    && 'text-green-600',
              )}
            >
              {step.role}
            </span>
          </div>
          {i < MOCK_CHAINE.length - 1 && (
            <ChevronRight className="w-4 h-4 text-slate-300 mx-1 mb-4 shrink-0" />
          )}
        </div>
      ))}
    </div>
  )
}

function LignesTable() {
  // Grouper les lignes par numéro
  const grouped = MOCK_LIGNES.reduce<Record<number, typeof MOCK_LIGNES>>((acc, l) => {
    if (!acc[l.num]) acc[l.num] = []
    acc[l.num].push(l)
    return acc
  }, {})

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([num, lignes]) => (
        <div key={num} className="border border-slate-100 rounded-lg overflow-hidden">
          <div className="bg-slate-50 px-3 py-1.5 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-700 text-white text-[11px] font-bold flex items-center justify-center flex-none">
              {num}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {lignes.length} ligne{lignes.length > 1 ? 's' : ''} · Numéro {num}
            </span>
          </div>
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-3 py-1.5 text-slate-400 font-semibold">Libellé</th>
                <th className="text-right px-3 py-1.5 text-slate-400 font-semibold">Montant</th>
                <th className="text-left px-3 py-1.5 text-slate-400 font-semibold hidden sm:table-cell">Date prévue</th>
                <th className="text-left px-3 py-1.5 text-slate-400 font-semibold hidden sm:table-cell">Mode</th>
                <th className="text-left px-3 py-1.5 text-slate-400 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((l, i) => {
                const st = STATUT_LIGNE[l.statut] ?? { label: l.statut, color: 'text-slate-500 bg-slate-100' }
                return (
                  <tr key={i} className="border-b border-slate-50 last:border-0">
                    <td className="px-3 py-2 text-slate-700">{l.libelle}</td>
                    <td className="px-3 py-2 text-right font-mono font-semibold text-slate-800">{l.montant}</td>
                    <td className="px-3 py-2 text-slate-500 hidden sm:table-cell">{l.datePrevue}</td>
                    <td className="px-3 py-2 text-slate-500 hidden sm:table-cell">{l.mode}</td>
                    <td className="px-3 py-2">
                      <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', st.color)}>
                        {st.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

function HistoriqueItem({ item }: { item: typeof MOCK_HISTORIQUE[0] }) {
  const isValide   = item.decision === 'VALIDE'
  const isAjourne  = item.decision === 'AJOURNE'
  const isSoumis   = item.decision === 'SOUMIS'

  return (
    <div className="flex gap-3 text-sm">
      <div className="flex flex-col items-center gap-1">
        <div className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center flex-none mt-0.5',
          isValide  && 'bg-green-100 text-green-600',
          isAjourne && 'bg-red-100 text-red-600',
          isSoumis  && 'bg-blue-100 text-blue-600',
        )}>
          {isValide  && <CheckCircle2 className="w-4 h-4" />}
          {isAjourne && <XCircle className="w-4 h-4" />}
          {isSoumis  && <Clock className="w-4 h-4" />}
        </div>
        <div className="w-px flex-1 bg-slate-100" />
      </div>
      <div className="pb-4 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-800">{item.role}</span>
          <span className="text-slate-400">—</span>
          <span className="text-slate-600">{item.acteur}</span>
          <span className="text-slate-400 text-xs ml-auto">{item.date}</span>
        </div>
        <div className="flex items-start gap-2 mt-1">
          <span className={cn(
            'text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0',
            isValide  && 'bg-green-100 text-green-700',
            isAjourne && 'bg-red-100 text-red-700',
            isSoumis  && 'bg-blue-100 text-blue-700',
          )}>
            {isValide ? 'Validé' : isAjourne ? 'Ajourné' : 'Soumis'}
          </span>
          {item.motif && <p className="text-slate-500 text-[12.5px] leading-snug">{item.motif}</p>}
        </div>
      </div>
    </div>
  )
}

// ─── Composant principal ─────────────────────────────────────────────────────

export function ExaminerModal() {
  const projet = useProjetsStore(s => s.examinerModalProjet)
  const setExaminerModalProjet = useProjetsStore(s => s.setExaminerModalProjet)

  const handleClose = () => setExaminerModalProjet(null)

  const currentStatut = projet?.plan_decaissement?.statut ?? projet?.statut ?? 'BROUILLON'
  const statutConfig = STATUT_PLAN[currentStatut] ?? { label: currentStatut, variant: 'outline' as const }

  return (
    <Sheet open={!!projet} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full sm:max-w-[580px] p-0 flex flex-col gap-0 overflow-hidden"
      >
        {/* ── Header sticky ── */}
        <SheetHeader className="sticky top-0 z-10 bg-white border-b border-slate-100 px-5 py-4 gap-1 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <code className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {projet?.code ?? 'N/A'}
                </code>
                <span className="text-xs text-slate-400">· plan de décaissement · voie Agence</span>
                <Badge variant={statutConfig.variant} className="text-[11px]">
                  {statutConfig.label}
                </Badge>
              </div>
              <SheetTitle className="text-[16px] font-bold text-slate-900 leading-snug">
                {projet?.intitule ?? 'Projet sans titre'}
              </SheetTitle>
              <p className="text-[12.5px] text-slate-500 mt-0.5">
                {projet?.promoteur ? `${projet.promoteur.prenom} ${projet.promoteur.nom}` : 'Promoteur inconnu'} · {projet?.agence?.libelle || projet?.agence?.nom || 'Agence inconnue'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex-none rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </SheetHeader>

        {/* ── Corps scrollable ── */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-5 pb-4">

            {/* Chaîne de validation */}
            <SectionTitle>Chaîne de validation</SectionTitle>
            <ChaineValidation />

            {/* Métadonnées */}
            <SectionTitle>Informations du plan</SectionTitle>
            <FieldGrid>
              <Field label="Chargé de Suivi / Saisisseur">{MOCK_PLAN.saisisseur}</Field>
              <Field label="Point focal banque / IMF">{MOCK_PLAN.pointFocal}</Field>
              <Field label="Créé le">{MOCK_PLAN.dateCree}</Field>
              <Field label="Validation du bénéficiaire">
                {MOCK_PLAN.validationBeneficiaire ? (
                  <span className="inline-flex items-center gap-1 text-green-700 font-semibold text-[12px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Validé depuis l'appli mobile
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-[12px]">
                    <Clock className="w-3.5 h-3.5" /> En attente
                  </span>
                )}
              </Field>
              <Field label="Plan signé (PDF)">
                {MOCK_PLAN.fichierSigne ? (
                  <span className="inline-flex items-center gap-1 text-blue-600">
                    <FileText className="w-3.5 h-3.5" />
                    {MOCK_PLAN.fichierSigne}
                  </span>
                ) : '—'}
              </Field>
              <Field label="Montant total du plan">
                <span className="font-mono font-bold">{MOCK_PLAN.montantTotal}</span>
              </Field>
              <Field label="Montant du crédit accordé">
                <span className="font-mono">{MOCK_PLAN.montantCredit}</span>
              </Field>
            </FieldGrid>

            {/* Note */}
            {MOCK_PLAN.note && (
              <>
                <SectionTitle>Note / Observations</SectionTitle>
                <p className="text-[13px] text-slate-600 leading-relaxed">{MOCK_PLAN.note}</p>
              </>
            )}

            {/* Lignes de décaissement */}
            <SectionTitle>Lignes de décaissement ({MOCK_LIGNES.length})</SectionTitle>
            <LignesTable />

            {/* Historique */}
            {MOCK_HISTORIQUE.length > 0 && (
              <>
                <SectionTitle>Historique des décisions</SectionTitle>
                <div className="mt-2">
                  {MOCK_HISTORIQUE.map((item, i) => (
                    <HistoriqueItem key={i} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* ── Footer ── */}
        <div className="shrink-0 border-t border-slate-100 bg-slate-50 px-5 py-3 flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleClose}>
            Fermer
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-600">
            <FolderOpen className="w-4 h-4 mr-1.5" />
            Voir le dossier
          </Button>
          <div className="flex-1" />
          {/* Actions de décision (visibles selon le rôle — statiques pour l'instant) */}
          <Button
            size="sm"
            variant="destructive"
            className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-none"
          >
            <X className="w-4 h-4 mr-1" />
            Ajourner
          </Button>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="w-4 h-4 mr-1" />
            Valider
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
