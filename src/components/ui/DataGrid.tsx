import { forwardRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { AgGridReactProps } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community'

// Enregistrement de tous les modules communautaires pour AG Grid v33+ (inclut Pagination, Filtres, CellStyles, etc.)
ModuleRegistry.registerModules([AllCommunityModule])

const AG_GRID_LOCALE_FR = {
  // Pagination
  page: 'Page',
  more: 'Plus',
  to: 'à',
  of: 'sur',
  next: 'Suivant',
  last: 'Dernier',
  first: 'Premier',
  previous: 'Précédent',
  loadingOoo: 'Chargement...',
  noRowsToShow: 'Aucune donnée à afficher',
  
  // Filter
  empty: 'Vide',
  equals: 'Égal à',
  notEqual: 'Différent de',
  lessThan: 'Inférieur à',
  greaterThan: 'Supérieur à',
  inRange: 'Dans l\'intervalle',
  contains: 'Contient',
  notContains: 'Ne contient pas',
  startsWith: 'Commence par',
  endsWith: 'Se termine par',
}

interface DataGridProps extends AgGridReactProps {
  className?: string
  height?: string
}

export const DataGrid = forwardRef<AgGridReact, DataGridProps>(({ 
  className = '', 
  height = '500px', 
  ...props 
}, ref) => {
  return (
    <div className={className} style={{ height, width: '100%' }}>
      <AgGridReact
        ref={ref}
        theme={themeQuartz}
        localeText={AG_GRID_LOCALE_FR}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50]}
        domLayout="normal"
        {...props}
      />
    </div>
  )
})

DataGrid.displayName = 'DataGrid'
