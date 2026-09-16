import { useState } from 'react'
import { rolesServices } from '@/services/roles.services'
import { permissionsServices, type PERMISSION_INPUT_T } from '@/services/permissions.services'
import { MODULES } from '@/constants/modules'

export function usePermissionsMatrix() {
  const { data: roles = [] } = rolesServices.useGetAll()
  const [roleId, setRoleId] = useState<number | null>(null)

  const { data: permissions = [], isLoading } = permissionsServices.useGetByRole(roleId)
  const { mutate: create, isPending: isCreating } = permissionsServices.useCreate()
  const { mutate: update, isPending: isUpdating } = permissionsServices.useUpdate()

  const rows = Object.values(MODULES).map((module) => {
    const existing = permissions.find((p) => p.module === module)
    return {
      module,
      existing,
      // `acces` arrive en chaîne ("0"/"1") depuis l'API — cf. PERMISSION_T.
      acces: existing ? String(existing.acces) === '1' : false,
      fullAccess: existing ? Number(existing.full_access) === 1 : false,
    }
  })

  const toggle = (moduleKey: string, field: 'acces' | 'fullAccess', value: boolean) => {
    if (!roleId) return
    const row = rows.find((r) => r.module === moduleKey)
    if (!row) return

    const nextAcces = field === 'acces' ? value : row.acces
    // Activer l'accès complet implique forcément l'accès de base.
    const nextFull = field === 'fullAccess' ? value : row.fullAccess
    const effectiveAcces = nextFull ? true : nextAcces

    const payload: PERMISSION_INPUT_T = {
      role_id: roleId,
      module: moduleKey,
      autorise: effectiveAcces,
      acces: effectiveAcces,
      full_access: nextFull,
    }

    if (row.existing) {
      update({ id: row.existing.id, data: payload })
    } else {
      create(payload)
    }
  }

  return { roles, roleId, setRoleId, rows, isLoading, isSaving: isCreating || isUpdating, toggle }
}
