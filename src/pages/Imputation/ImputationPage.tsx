import { useState } from 'react'
import { Folder, Pin } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  MOCK_AGENCES_IMPUTATION,
  MOCK_A_IMPUTER,
  MOCK_IMPUTES,
  type DossierAImputer,
  type DossierImpute,
} from '@/mock/imputation.mock'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function money(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' F'
}

function agenceLibelle(id: string) {
  return MOCK_AGENCES_IMPUTATION.find((a) => a.id === id)?.libelle ?? id
}

// Badge identique à la maquette : badge(text, cls)
type BadgeCls = 'am' | 'gr' | 'bl' | 'or' | 'rd' | 'gy'
function Badge({ text, cls }: { text: string | number; cls: BadgeCls }) {
  const classes: Record<BadgeCls, string> = {
    am: 'bg-[#FBF1D6] text-[#8a6503]',
    gr: 'bg-[#E3F6E7] text-[#178A2E]',
    bl: 'bg-[#E5EDFB] text-[#2D6BD4]',
    or: 'bg-[#FBEADE] text-[#C85E18]',
    rd: 'bg-[#FBE7E5] text-[#D6453B]',
    gy: 'bg-[#eef1f6] text-[#5A6B80]',
  }
  return (
    <span
      className={`inline-flex items-center text-[11.5px] font-semibold px-[9px] py-[3px] rounded-full whitespace-nowrap ${classes[cls]}`}
    >
      {text}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Ligne dossier à imputer  (attente)
// ---------------------------------------------------------------------------

function LgnAttente({
  d,
  onImputer,
  onDirection,
}: {
  d: DossierAImputer
  onImputer: (id: string, agId: string) => void
  onDirection: (id: string) => void
}) {
  const [agId, setAgId] = useState(d.agence_suggestion)

  return (
    // .lgn  exact CSS : flex, align-items:center, gap:12px, padding:12px 14px,
    //   border:1px solid var(--line), border-radius:var(--r-sm)=8px, mb:8px, bg:var(--card)
    <div className="flex items-center gap-3 px-[14px] py-[12px] border border-[#E5EAF1] rounded-[8px] mb-2 bg-white last:mb-0">
      {/* .num : 26×26, rounded-8, bg ink, color #fff, grid place-items-center */}
      <div className="w-[26px] h-[26px] rounded-[8px] bg-[#131C29] text-white grid place-items-center flex-none">
        <Folder size={13} />
      </div>

      {/* .in : flex-1 min-w-0 */}
      <div className="flex-1 min-w-0">
        {/* .in b : block, font-size:13.5px */}
        <b className="block text-[13.5px] text-[#131C29]">
          {d.code} — {d.titre}
        </b>
        {/* .in span : font-size:11.5px, color var(--slate) */}
        <span className="text-[11.5px] text-[#5A6B80]">
          {d.jeune} · {d.commune} · crédit {money(d.montant_credit)} · rattachement {d.rattachement}
        </span>
      </div>

      {/* select agence : min-width:210px */}
      <Select value={agId} onValueChange={setAgId}>
        <SelectTrigger className="min-w-[210px] h-8 text-[12.5px] border-[#E5EAF1]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MOCK_AGENCES_IMPUTATION.map((a) => (
            <SelectItem key={a.id} value={a.id} className="text-[12.5px]">
              {a.libelle}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* btn sm pri → Imputer */}
      <Button
        size="sm"
        className="h-8 text-[12px] bg-[#E7722B] hover:bg-[#C85E18] border-[#E7722B] text-white"
        onClick={() => onImputer(d.id, agId)}
      >
        Imputer
      </Button>

      {/* btn sm → Conserver à la Direction */}
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-[12px] border-[#E5EAF1] text-[#131C29]"
        onClick={() => onDirection(d.id)}
      >
        Conserver à la Direction
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Ligne dossier déjà imputé  (faits)
// ---------------------------------------------------------------------------

function LgnFait({ d }: { d: DossierImpute }) {
  return (
    // .lgn cursor-pointer  (dans la maquette : data-p → openProjet)
    <div className="flex items-center gap-3 px-[14px] py-[12px] border border-[#E5EAF1] rounded-[8px] mb-2 bg-white last:mb-0 cursor-pointer hover:border-[#cdd6e2] transition-colors">
      {/* .num avec icône pin */}
      <div className="w-[26px] h-[26px] rounded-[8px] bg-[#131C29] text-white grid place-items-center flex-none">
        <Pin size={13} />
      </div>

      {/* .in */}
      <div className="flex-1 min-w-0">
        <b className="block text-[13.5px] text-[#131C29]">
          {d.code} — {d.titre}
        </b>
        <span className="text-[11.5px] text-[#5A6B80]">
          {d.gere_par === 'DIRECTION'
            ? 'Géré par la Direction'
            : agenceLibelle(d.agence_id!)}
          {' · '}plan de décaissement {d.plan_label}
        </span>
      </div>

      {/* badge Direction ou Agence */}
      <Badge
        text={d.gere_par === 'DIRECTION' ? 'Direction' : 'Agence'}
        cls={d.gere_par === 'DIRECTION' ? 'bl' : 'or'}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page principale
// ---------------------------------------------------------------------------

export function ImputationPage() {
  const [attente, setAttente] = useState<DossierAImputer[]>(MOCK_A_IMPUTER)
  const [faits, setFaits] = useState<DossierImpute[]>(MOCK_IMPUTES)

  function handleImputer(id: string, agId: string) {
    const d = attente.find((x) => x.id === id)
    if (!d) return
    setAttente((prev) => prev.filter((x) => x.id !== id))
    setFaits((prev) => [
      ...prev,
      {
        id: d.id,
        code: d.code,
        titre: d.titre,
        gere_par: 'AGENCE',
        agence_id: agId,
        plan_label: 'non saisi',
      },
    ])
  }

  function handleDirection(id: string) {
    const d = attente.find((x) => x.id === id)
    if (!d) return
    setAttente((prev) => prev.filter((x) => x.id !== id))
    setFaits((prev) => [
      ...prev,
      {
        id: d.id,
        code: d.code,
        titre: d.titre,
        gere_par: 'DIRECTION',
        plan_label: 'non saisi',
      },
    ])
  }

  return (
    <div>
      {/* Deux cards identiques à la maquette */}

      {/* Card 1 : Dossiers approuvés à imputer */}
      <Card className="p-0 border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)] overflow-hidden mb-4">
        {/* .hd */}
        <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
          <h3 className="text-[14.5px] font-bold text-[#131C29]">Dossiers approuvés à imputer</h3>
          <div className="flex-1" />
          <Badge text={attente.length} cls="am" />
        </div>

        {/* .bd */}
        <div className="p-[18px]">
          {attente.length === 0 ? (
            // .empty
            <div className="text-center py-[50px] px-5 text-[#5A6B80]">
              Aucun dossier approuvé en attente d&apos;imputation
            </div>
          ) : (
            attente.map((d) => (
              <LgnAttente
                key={d.id}
                d={d}
                onImputer={handleImputer}
                onDirection={handleDirection}
              />
            ))
          )}
        </div>
      </Card>

      {/* Card 2 : Dossiers déjà imputés */}
      <Card className="p-0 border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)] overflow-hidden">
        {/* .hd */}
        <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
          <h3 className="text-[14.5px] font-bold text-[#131C29]">Dossiers déjà imputés</h3>
          <div className="flex-1" />
          <Badge text={faits.length} cls="gr" />
        </div>

        {/* .bd */}
        <div className="p-[18px]">
          {faits.length === 0 ? (
            <div className="text-center py-[50px] px-5 text-[#5A6B80]">
              Aucun dossier imputé
            </div>
          ) : (
            faits.map((d) => <LgnFait key={d.id} d={d} />)
          )}
        </div>
      </Card>
    </div>
  )
}
