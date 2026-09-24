import { useState } from 'react'
import { Plus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GridSection } from '@/components/shared/GridSection'

import { useRemboursementsDeclarationsGrid } from '../hooks/useRemboursementsDeclarationsGrid'
import { RemboursementDeclarationFormModal } from '../components/RemboursementDeclarationFormModal'
import { ImportRemboursementDeclarationsModal } from '../components/ImportRemboursementDeclarationsModal'

export function DeclarationsSubTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const { columnDefs, data, isLoading, modalNode } = useRemboursementsDeclarationsGrid(searchQuery)
  return (
    <>
      {modalNode}
      <GridSection
        columnDefs={columnDefs}
        data={data}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher une déclaration…"
        countLabel={`${data.length} déclaration(s)`}
        newButton={
          <div className="flex items-center gap-2">
            <ImportRemboursementDeclarationsModal>
              <Button variant="outline" className="h-9">
                <Upload className="w-4 h-4 mr-2" />
                Import massif
              </Button>
            </ImportRemboursementDeclarationsModal>
            <RemboursementDeclarationFormModal>
              <Button className="h-9"><Plus className="w-4 h-4 mr-2" />Nouvelle déclaration</Button>
            </RemboursementDeclarationFormModal>
          </div>
        }
      />
    </>
  )
}
