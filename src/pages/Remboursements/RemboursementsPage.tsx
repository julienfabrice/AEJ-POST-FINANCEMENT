import { useRemboursements } from './hooks/useRemboursements'
import { KPIs } from './components/KPIs'
import { GroupsGrid } from './components/GroupsGrid'
import { RemboursementsTable } from './components/RemboursementsTable'

export function RemboursementsPage() {
  const { kpis, dossiersGroups } = useRemboursements()

  return (
    <div className="space-y-6">
      {/* ---- En-tête ---- */}
      <div>
        <h1 className="text-[24px] font-extrabold text-[#131C29] font-['Archivo'] tracking-tight">
          Remboursements
        </h1>
        <p className="text-[13px] text-[#5A6B80] mt-1">Échéances, encaissements et impayés.</p>
      </div>

      <KPIs kpis={kpis} />
      
      <GroupsGrid dossiersGroups={dossiersGroups} />

      <RemboursementsTable />
    </div>
  )
}
