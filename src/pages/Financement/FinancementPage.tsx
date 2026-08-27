import { useState } from 'react'
import { Banknote, CheckCircle2, XCircle, Clock, Layers, CreditCard, TrendingDown, Shield } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { KpiCard } from './components/KpiCard'
import { TabLotsRecus } from './tabs/TabLotsRecus'
import { TabListeDecision } from './tabs/TabListeDecision'
import { TabPlansDecaissement } from './tabs/TabPlansDecaissement'
import { TabRemboursements } from './tabs/TabRemboursements'
import { TabGaranties } from './tabs/TabGaranties'

import {
  MOCK_LOTS,
  MOCK_DOSSIERS_APPROUVES,
  MOCK_DOSSIERS_REJETES,
  MOCK_DECAISSEMENTS,
  MOCK_REMBOURSEMENTS,
  MOCK_GARANTIES,
  MOCK_PLANS,
} from '@/mock/financement.mock'

// ---------- Compteurs dynamiques ------------------------------------------

const lotsEnCoursCount = MOCK_LOTS.filter((l) => l.statut !== 'RETOURNE').length
const plansEnValidation = MOCK_PLANS.filter((p) => p.statut === 'EN_VALIDATION').length
const impayes = MOCK_REMBOURSEMENTS.filter((r) => r.statut !== 'A_JOUR').length

// ---------- Tabs configuration -------------------------------------------

type TabKey = 'lots' | 'approuves' | 'rejetes' | 'plans' | 'decaissements' | 'remboursements' | 'garanties'

interface TabConfig {
  id: TabKey
  label: string
  count?: number
}

const TABS: TabConfig[] = [
  { id: 'lots', label: 'Lots reçus', count: lotsEnCoursCount },
  { id: 'approuves', label: 'Dossiers approuvés', count: MOCK_DOSSIERS_APPROUVES.length },
  { id: 'rejetes', label: 'Dossiers rejetés', count: MOCK_DOSSIERS_REJETES.length },
  { id: 'plans', label: 'Plans de décaissement', count: plansEnValidation },
  { id: 'decaissements', label: 'Décaissements', count: MOCK_DECAISSEMENTS.length },
  { id: 'remboursements', label: 'Remboursements' },
  { id: 'garanties', label: 'Rappels de garantie', count: MOCK_GARANTIES.length },
]

// ---------- Page principale -----------------------------------------------

export function FinancementPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('lots')

  return (
    <div className="space-y-5">
      {/* ---- En-tête ---- */}
      <div>
        <h1 className="text-[24px] font-extrabold text-[#131C29] font-['Archivo'] tracking-tight">
          Circuit de financement
        </h1>
        <p className="text-[13px] text-[#5A6B80] mt-1">
          Lots transmis, traitement des dossiers, plans de décaissement, remboursements et garanties.
        </p>
      </div>

      {/* ---- KPIs ---- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard
          label="Lots en cours"
          value={lotsEnCoursCount}
          trend={`${MOCK_LOTS.length} lot(s) total`}
          trendUp
          icon={Layers}
          iconColor="#2D6BD4"
          iconBg="#E5EDFB"
        />
        <KpiCard
          label="Dossiers approuvés"
          value={MOCK_DOSSIERS_APPROUVES.length}
          trend={`sur ${MOCK_LOTS.flatMap((l) => l.dossiers).length} dossiers`}
          trendUp
          icon={CheckCircle2}
          iconColor="#20A83A"
          iconBg="#E3F6E7"
        />
        <KpiCard
          label="Plans en validation"
          value={plansEnValidation}
          trend={`${MOCK_PLANS.length} plan(s) total`}
          trendUp={plansEnValidation === 0}
          icon={CreditCard}
          iconColor="#E7722B"
          iconBg="#FBEADE"
        />
        <KpiCard
          label="Impayés"
          value={impayes}
          trend={impayes > 0 ? 'action requise' : 'Aucun impayé'}
          trendUp={impayes === 0}
          icon={impayes > 0 ? XCircle : CheckCircle2}
          iconColor={impayes > 0 ? '#D6453B' : '#20A83A'}
          iconBg={impayes > 0 ? '#FBE7E5' : '#E3F6E7'}
        />
      </div>

      {/* ---- Onglets ---- */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabKey)}
        className="w-full"
      >
        {/* Barre d'onglets */}
        <div className="overflow-x-auto w-full no-scrollbar">
          <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="
                  !bg-transparent !shadow-none after:hidden
                  px-4 py-2.5 text-[13.5px] font-semibold text-slate-500
                  border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent
                  data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B]
                  hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none
                  flex items-center gap-2
                "
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-[rgba(255,255,255,.1)] text-[#5A6B80] data-[state=active]:bg-[#FBEADE] data-[state=active]:text-[#C85E18] text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 min-w-[20px] text-center">
                    {tab.count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Contenu des onglets */}
        <TabsContent value="lots" className="mt-5 outline-none">
          <TabLotsRecus />
        </TabsContent>

        <TabsContent value="approuves" className="mt-5 outline-none">
          <TabListeDecision type="APPROUVE" />
        </TabsContent>

        <TabsContent value="rejetes" className="mt-5 outline-none">
          <TabListeDecision type="REJETE" />
        </TabsContent>

        <TabsContent value="plans" className="mt-5 outline-none">
          <TabPlansDecaissement />
        </TabsContent>

        <TabsContent value="decaissements" className="mt-5 outline-none">
          <DecaissementsTab />
        </TabsContent>

        <TabsContent value="remboursements" className="mt-5 outline-none">
          <TabRemboursements />
        </TabsContent>

        <TabsContent value="garanties" className="mt-5 outline-none">
          <TabGaranties />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ---------- Onglet Décaissements (inline simple) -------------------------

function DecaissementsTab() {
  if (MOCK_DECAISSEMENTS.length === 0) {
    return (
      <div className="text-center py-14 text-[#5A6B80]">
        <Banknote size={40} className="mx-auto mb-3 opacity-30" />
        <b className="block text-[#131C29] text-[15px] mb-1 font-['Archivo']">
          Aucun décaissement enregistré
        </b>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#E5EAF1] rounded-[11px] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)] overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {['Dossier', 'Agence', 'Numéro', 'Libellé', 'Montant', 'Date', 'Référence'].map((h) => (
              <th
                key={h}
                className="text-left text-[11px] uppercase tracking-[.05em] text-[#8595A8] font-bold px-[14px] py-[11px] border-b border-[#E5EAF1] bg-[#fafbfd] whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MOCK_DECAISSEMENTS.map((d) => (
            <tr key={d.id} className="hover:bg-[#fafbfe] transition-colors">
              <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px]">
                <b className="font-semibold text-[#131C29]">{d.code}</b>
                <span className="block text-[12px] text-[#5A6B80]">{d.promoteur}</span>
              </td>
              <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                {d.agence}
              </td>
              <td className="px-[14px] py-[12px] border-b border-[#EEF2F7]">
                <span className="w-[26px] h-[26px] rounded-[8px] bg-[#20A83A] text-white grid place-items-center text-[12px] font-bold inline-grid">
                  {d.num}
                </span>
              </td>
              <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#131C29] max-w-[200px] truncate">
                {d.libelle}
              </td>
              <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono font-semibold text-[#131C29]">
                {new Intl.NumberFormat('fr-FR').format(d.montant)} F
              </td>
              <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] text-[#5A6B80]">
                {d.date}
              </td>
              <td className="px-[14px] py-[12px] border-b border-[#EEF2F7] text-[13px] font-mono text-[#5A6B80]">
                {d.reference}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
