import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { indicateurs, indicateurs_suivi, formulaires, questions } from '@/mock'
import { Badge } from '@/components/ui/badge'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'

dayjs.locale('fr')

export type IndicateurTab = 'plan' | 'ind' | 'rel' | 'fic' | 'q'

const fmt = (num: number) => new Intl.NumberFormat('fr-FR').format(num)

const actionsCol: ColDef = {
  headerName: 'Actions',
  width: 120,
  minWidth: 120,
  sortable: false,
  filter: false,
  cellRenderer: ActionsCellRenderer,
  cellRendererParams: {
    // Just mock callbacks that do nothing for now
    onEdit: () => console.log('Edit action clicked'),
    onDelete: () => console.log('Delete action clicked')
  },
}

export function useIndicateursGrid(activeTab: IndicateurTab, searchQuery: string = '') {
  const columnDefs = useMemo<ColDef[]>(() => {
    switch (activeTab) {
      case 'ind':
        return [
          { field: 'code', headerName: 'Code', flex: 1, cellRenderer: (params: any) => <Badge variant="outline" className="font-mono">{params.data.code}</Badge> },
          { field: 'nom', headerName: 'Nom', flex: 2, cellRenderer: (params: any) => <span className="font-semibold">{params.data.nom}</span> },
          { field: 'unite', headerName: 'Unité', flex: 1 },
          { field: 'type_valeur', headerName: 'Type de valeur', flex: 1 },
          { field: 'valeur_cible', headerName: 'Cible', flex: 1, cellRenderer: (params: any) => fmt(params.data.valeur_cible) },
          actionsCol
        ]
      case 'rel':
        return [
          { 
            field: 'periode', 
            headerName: 'Période', 
            flex: 1, 
            cellRenderer: (params: any) => {
              if (!params.data.periode) return null
              // On formate en "Octobre 2024"
              const formatted = dayjs(params.data.periode).format('MMMM YYYY')
              return <span className="font-medium capitalize text-slate-700">{formatted}</span>
            } 
          },
          { field: 'indicateur', headerName: 'Indicateur', flex: 2, cellRenderer: (params: any) => {
              const ind = indicateurs.find(i => i.id === params.data.indicateur_id)
              return ind ? <span className="font-semibold">{ind.code} - {ind.nom}</span> : params.data.indicateur_id
          } },
          { field: 'jeune_id', headerName: 'Bénéficiaire', flex: 1, cellRenderer: (params: any) => <Badge variant="secondary">{params.data.jeune_id}</Badge> },
          { field: 'valeur', headerName: 'Valeur', flex: 1, cellRenderer: (params: any) => <span className="font-bold text-[#E7722B]">{params.data.valeur}</span> },
          { 
            field: 'created', 
            headerName: 'Date', 
            flex: 1,
            cellRenderer: (params: any) => {
              if (!params.data.created) return null
              return <span>{dayjs(params.data.created).format('DD/MM/YYYY')}</span>
            }
          },
          actionsCol
        ]
      case 'fic':
        return [
          { field: 'code', headerName: 'Code', flex: 1, cellRenderer: (params: any) => <Badge variant="outline" className="font-mono">{params.data.code}</Badge> },
          { field: 'libelle', headerName: 'Libellé', flex: 2, cellRenderer: (params: any) => <span className="font-semibold">{params.data.libelle}</span> },
          { field: 'public_cible', headerName: 'Public Cible', flex: 1 },
          { field: 'actif', headerName: 'Actif', flex: 1, cellRenderer: (params: any) => (
            <Badge variant={params.data.actif ? 'default' : 'secondary'} className={params.data.actif ? 'bg-green-500 hover:bg-green-600 text-white' : ''}>
              {params.data.actif ? 'Oui' : 'Non'}
            </Badge>
          ) },
          actionsCol
        ]
      case 'q':
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
          )}
          , actionsCol
        ]
      default:
        return []
    }
  }, [activeTab])

  const data = useMemo(() => {
    let currentMock: any[] = []
    switch (activeTab) {
      case 'ind': currentMock = indicateurs; break;
      case 'rel': currentMock = indicateurs_suivi; break;
      case 'fic': currentMock = formulaires; break;
      case 'q': currentMock = questions; break;
      default: return []
    }

    if (!searchQuery.trim()) return currentMock

    const fuse = new Fuse(currentMock, {
      keys: ['code', 'nom', 'libelle', 'jeune_id', 'valeur'],
      threshold: 0.3,
      ignoreLocation: true
    })
    return fuse.search(searchQuery).map(res => res.item)
  }, [activeTab, searchQuery])

  return { columnDefs, data, isLoading: false }
}
