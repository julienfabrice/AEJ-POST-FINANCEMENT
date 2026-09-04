import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataGrid } from '@/components/ui/DataGrid'
import { PermissionGate } from '@/components/PermissionGate'
import { MODULES } from '@/constants/modules'

import { EmbaucheFormModal } from './components/EmbaucheFormModal'
import { ExploitationFormModal } from './components/ExploitationFormModal'
import { useSuiviGrid, type SuiviTab } from './hooks/useSuiviGrid'

/**
 * Onglets de la maquette (l.9762 : `tabbedView(..., [{res:'suivis'}, {res:'embauches'}])`),
 * dans le MÊME ordre et avec les MÊMES libellés.
 *
 * ⚠️ L'onglet « Rapports de visite » consomme `/exploitations`, pas `/suivis` :
 * la table `/suivis` de l'API est vide et ne porte aucune des données d'un
 * rapport de visite (voir l'en-tête de `src/types/suivi.types.ts`).
 */
const TABS_CONFIG = [
  {
    id: 'exploitations',
    label: 'Rapports de visite',
    sing: 'rapport de visite',
    // La maquette écrit « Nouveau ${sing} » sans accorder ; ici l'article est
    // correct pour les deux onglets (cf. « Nouvel emploi »).
    boutonCreation: 'Nouveau rapport de visite',
  },
  {
    id: 'embauches',
    label: 'Emplois créés',
    sing: 'emploi',
    boutonCreation: 'Nouvel emploi',
  },
] as const

export function SuiviPage() {
  const [activeTab, setActiveTab] = useState<SuiviTab>('exploitations')
  const [searchQuery, setSearchQuery] = useState('')

  const { columnDefs, data, isLoading, isError, error, modalNode, fermerEdition } = useSuiviGrid(
    activeTab,
    searchQuery,
  )

  return (
    <>
      {/* Modale d'ÉDITION, pilotée par la grille de l'onglet actif. */}
      {modalNode}

      <div className="space-y-2">
        <div>
          <h1 className="text-2xl font-extrabold text-[#131C29]">Suivi &amp; exploitation</h1>
          <p className="mt-1 text-sm text-[#5A6B80]">
            Rapports de visite terrain et emplois créés.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val as SuiviTab)
            // La maquette remonte une vue NEUVE à chaque changement d'onglet :
            // la recherche ne se transporte pas d'un onglet à l'autre.
            setSearchQuery('')
            // …et l'édition en cours est ABANDONNÉE. Sans cela, l'onglet
            // quitté garderait sa ligne en édition et rouvrirait sa modale au
            // retour (cf. `useSuiviGrid`).
            fermerEdition()
          }}
          className="w-full"
        >
          <div className="no-scrollbar w-full overflow-x-auto">
            {/*
             * La barre occupe toute la largeur (`min-w-full`) pour que le trait
             * `border-b` file jusqu'au bord, comme le `.tabs` de la maquette
             * (aej-demo.html l.1668-1674) ; les ONGLETS, eux, restent groupés à
             * gauche et ne prennent que la place de leur libellé — c'est
             * `flex-none` sur chaque déclencheur qui l'assure (voir ci-dessous).
             */}
            <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
              {TABS_CONFIG.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  /*
                   * ⚠️ `flex-none` ANNULE le `flex-1` que `TabsTrigger` porte
                   * dans ses classes de base (src/components/ui/tabs.tsx:64).
                   * Sans lui, les deux onglets s'étirent pour se partager toute
                   * la largeur de la barre, alors que la maquette ne leur donne
                   * que leur largeur de contenu : `.tabs button { padding: 11px
                   * 15px }` (aej-demo.html l.1676-1687), sans aucun flex-grow.
                   * `tailwind-merge` arbitre en faveur de `flex-none` parce que
                   * les deux classes appartiennent à la même clé `flex` et que
                   * celle-ci est passée en dernier.
                   */
                  className="flex-none !bg-transparent !shadow-none after:hidden px-4 py-2.5 text-[13.5px] font-semibold text-slate-500 border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B] hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {TABS_CONFIG.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0 outline-none">
              <div className="my-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder={`Rechercher un ${tab.sing}…`}
                    className="h-9 border-slate-200 bg-white pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <span className="text-[12.5px] whitespace-nowrap text-slate-500">
                  {isLoading ? 'Chargement...' : `${data.length} ${tab.label.toLowerCase()}`}
                </span>
                <div className="flex-1" />

                {/* Création réservée au droit `c` du module « suivi ». */}
                <PermissionGate module={MODULES.SUIVI} action="c">
                  {tab.id === 'exploitations' ? (
                    <ExploitationFormModal>
                      <Button className="h-9">
                        <Plus className="mr-2 h-4 w-4" />
                        {tab.boutonCreation}
                      </Button>
                    </ExploitationFormModal>
                  ) : (
                    <EmbaucheFormModal>
                      <Button className="h-9">
                        <Plus className="mr-2 h-4 w-4" />
                        {tab.boutonCreation}
                      </Button>
                    </EmbaucheFormModal>
                  )}
                </PermissionGate>
              </div>

              <Card className="p-0 overflow-hidden border-slate-200 rounded-lg shadow-sm">
                {isLoading ? (
                  <div className="flex h-[calc(100vh-300px)] w-full flex-col">
                    <div className="flex h-[48px] items-center gap-4 border-b border-[#E5EAF1] bg-[#fafbfd] px-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <div className="flex-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex-1 space-y-4 p-4">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 border-b border-slate-50 py-2 last:border-0"
                        >
                          <Skeleton className="h-5 w-56" />
                          <Skeleton className="h-5 w-36" />
                          <div className="flex-1" />
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-7 w-7 rounded-md" />
                            <Skeleton className="h-7 w-7 rounded-md" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : isError ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-16 text-red-600">
                    <span className="text-sm font-medium">Impossible de charger les données</span>
                    {error instanceof Error && (
                      <span className="text-xs text-red-500">{error.message}</span>
                    )}
                  </div>
                ) : (
                  <DataGrid
                    rowData={data}
                    columnDefs={columnDefs}
                    height="calc(100vh - 300px)"
                    rowHeight={55}
                    defaultColDef={{ sortable: true, filter: true, resizable: true }}
                  />
                )}
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  )
}
