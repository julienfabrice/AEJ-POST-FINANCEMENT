import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GridSection, SUBTAB_TRIGGER_CLASS } from '@/components/shared/GridSection'

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
        <h1 className="text-2xl font-extrabold text-[#131C29] mb-2">Profils &amp; permissions</h1>
        <p className="text-[13px] text-[#5A6B80] -mt-1">Rôles applicatifs et droits d'accès par module.</p>
      </div>

      <Tabs value={subTab} onValueChange={(v) => setSubTab(v as 'roles' | 'permissions')} className="w-full">
        <TabsList className="bg-slate-100 p-1 h-auto rounded-md w-fit">
          <TabsTrigger value="roles" className={SUBTAB_TRIGGER_CLASS}>Rôles</TabsTrigger>
          <TabsTrigger value="permissions" className={SUBTAB_TRIGGER_CLASS}>Matrice de permissions</TabsTrigger>
        </TabsList>
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
