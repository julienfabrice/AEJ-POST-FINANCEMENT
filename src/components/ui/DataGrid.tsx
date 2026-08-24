import { forwardRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { AgGridReactProps } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule])

const customTheme = themeQuartz.withParams({
  headerBackgroundColor: '#fafbfd',
  headerTextColor: '#8595A8',
  headerFontSize: '11px',
  headerFontWeight: '700',
  dataFontSize: '13px',
  rowHoverColor: '#fafbfe',
  
  cellTextColor: '#131C29',
  borderColor: '#E5EAF1',
  wrapperBorderRadius: '7px',
  headerRowBorder: '1px solid #E5EAF1',
})

const AG_GRID_LOCALE_FR = {
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
      <style>{`
        .ag-header-cell-text {
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        .ag-cell {
          display: flex;
          align-items: center;
        }
        .ag-row {
          border-bottom: 1px solid #EEF2F7 !important;
          transition: background-color 0.1s ease;
        }
      `}</style>
      <AgGridReact
        ref={ref}
        theme={customTheme}
        localeText={AG_GRID_LOCALE_FR}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50]}
        domLayout="normal"
        enableBrowserTooltips={true}
        {...props}
      />
    </div>
  )
})

DataGrid.displayName = 'DataGrid'
