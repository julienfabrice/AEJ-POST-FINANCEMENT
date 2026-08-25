import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GridSection } from '@/components/shared/GridSection'

import { BudgetFormModal } from './components/BudgetFormModal'
import { useBudgetsGrid } from './hooks/useBudgetsGrid'

export function FinancementsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { columnDefs, data, isLoading, modalNode } = useBudgetsGrid(searchQuery)

  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29]">Financements</h1>
        <p className="text-sm text-[#5A6B80] mt-1">
          Budgets : accord, source, devise, convention et validation par micro-projet.
        </p>
      </div>

      {modalNode}
      <GridSection
        columnDefs={columnDefs}
        data={data}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un budget…"
        countLabel={`${data.length} budget(s)`}
        newButton={
          <BudgetFormModal>
            <Button className="h-9"><Plus className="w-4 h-4 mr-2" />Nouveau budget</Button>
          </BudgetFormModal>
        }
      />
    </div>
  )
}
