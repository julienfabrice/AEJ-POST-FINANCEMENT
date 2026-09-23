import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GridSection } from '@/components/shared/GridSection'

import { useRolesGrid } from './hooks/useRolesGrid'
import { RoleFormModal } from './components/RoleFormModal'
import { PermissionsMatrix } from './components/PermissionsMatrix'

function RolesSubTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const { columnDefs, data, isLoading, modalNode } = useRolesGrid(searchQuery)
  return (
    <>
      {modalNode}
      <GridSection
        columnDefs={columnDefs}
        data={data}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un rôle…"
        countLabel={`${data.length} rôle(s)`}
        newButton={
          <RoleFormModal>
            <Button className="h-9"><Plus className="w-4 h-4 mr-2" />Nouveau rôle</Button>
          </RoleFormModal>
        }
      />
    </>
  )
}

export function ProfilsPage() {
  const [subTab, setSubTab] = useState<'roles' | 'permissions'>('roles')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29] mb-2">Rôles &amp; permissions</h1>
        <p className="text-[13px] text-[#5A6B80] -mt-1">Rôles applicatifs et droits d'accès par module.</p>
      </div>

      <Tabs value={subTab} onValueChange={(v) => setSubTab(v as 'roles' | 'permissions')} className="w-full">
        <div className="overflow-x-auto w-full no-scrollbar">
          <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
            <TabsTrigger 
              value="roles" 
              className="!bg-transparent !shadow-none after:hidden px-4 py-2.5 text-[13.5px] font-semibold text-slate-500 border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B] hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none"
            >
              Rôles
            </TabsTrigger>
            <TabsTrigger 
              value="permissions" 
              className="!bg-transparent !shadow-none after:hidden px-4 py-2.5 text-[13.5px] font-semibold text-slate-500 border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B] hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none"
            >
              Matrice de permissions
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="roles" className="mt-2 outline-none">
          <RolesSubTab />
        </TabsContent>
        <TabsContent value="permissions" className="mt-2 outline-none">
          <PermissionsMatrix />
        </TabsContent>
      </Tabs>
    </div>
  )
}
