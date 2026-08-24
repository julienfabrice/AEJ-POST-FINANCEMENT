import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { questions, indicateurs } from '@/mock'
import { Badge } from '@/components/ui/badge'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'

const actionsCol: ColDef = {
  headerName: 'Actions',
  width: 120,
  minWidth: 120,
  sortable: false,
  filter: false,
  cellRenderer: ActionsCellRenderer,
  cellRendererParams: {
    onEdit: () => console.log('Edit action clicked'),
    onDelete: () => console.log('Delete action clicked')
  },
}

export function useQuestionsGrid(searchQuery: string) {
  const columnDefs = useMemo<ColDef[]>(() => {
    return [
      { field: 'code', headerName: 'Code', flex: 1, cellRenderer: (params: any) => <Badge variant="outline" className="font-mono">{params.data.code}</Badge> },
      { field: 'libelle', headerName: 'Libellé', flex: 3 },
      { field: 'type_question', headerName: 'Type', flex: 1, cellRenderer: (params: any) => <Badge variant="secondary">{params.data.type_question}</Badge> },
      { field: 'cible_ind', headerName: 'Indicateur', flex: 1, cellRenderer: (params: any) => {
        const ind = indicateurs.find(i => i.id === params.data.cible_ind)
        return ind ? <Badge className="bg-[#2D6BD4] hover:bg-[#2D6BD4] font-mono text-white">{ind.code}</Badge> : <span className="text-gray-400">—</span>
      } },
      { field: 'obligatoire', headerName: 'Obligatoire', flex: 1, cellRenderer: (params: any) => (
         params.data.obligatoire ? <span className="text-green-600 font-bold">Oui</span> : <span className="text-gray-400">Non</span>
      )},
      actionsCol
    ]
  }, [])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return questions

    const fuse = new Fuse(questions, {
      keys: ['code', 'libelle', 'type_question'],
      threshold: 0.3,
      ignoreLocation: true
    })
    return fuse.search(searchQuery).map(res => res.item)
  }, [searchQuery])

  return { columnDefs, data: filteredData, isLoading: false }
}
