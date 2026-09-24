import { useRemboursements } from '../hooks/useRemboursements'
import { KPIs } from '../components/KPIs'
import { GroupsGrid } from './GroupsGrid'
import { RemboursementsTable } from './RemboursementsTable'

export function SuiviSubTab() {
  const { kpis, dossiersGroups } = useRemboursements()
  return (
    <>
      <KPIs kpis={kpis} />
      <GroupsGrid dossiersGroups={dossiersGroups} />
      <RemboursementsTable />
    </>
  )
}
