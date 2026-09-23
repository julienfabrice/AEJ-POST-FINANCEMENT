import { rolesServices } from '@/services/roles.services'
import { permissionsServices, type PERMISSION_INPUT_T } from '@/services/permissions.services'
import { MODULES } from '@/constants/modules'
import type { PERMISSION_T } from '@/types/permissions.types'

export interface MatrixCell {
  existing?: PERMISSION_T
  acces: boolean
  fullAccess: boolean
}

export interface MatrixRow {
  module: string
  rolesData: Record<number, MatrixCell>
}

export function usePermissionsMatrix() {
  const { data: roles = [], isLoading: rolesLoading } = rolesServices.useGetAll()
  const { data: permissions = [], isLoading: permsLoading } = permissionsServices.useGetAll()
  
  const { mutate: create, isPending: isCreating } = permissionsServices.useCreate()
  const { mutate: update, isPending: isUpdating } = permissionsServices.useUpdate()

  const rows: MatrixRow[] = Object.values(MODULES).map((module) => {
    const rolesData: Record<number, MatrixCell> = {}
    
    roles.forEach(role => {
      const existing = permissions.find((p) => p.module === module && p.role_id === role.id)
      rolesData[role.id] = {
        existing,
        // `acces` arrive en chaîne ("0"/"1") depuis l'API — cf. PERMISSION_T.
        acces: existing ? String(existing.acces) === '1' : false,
        fullAccess: existing ? Number(existing.full_access) === 1 : false,
      }
    })

    return { module, rolesData }
  })

  const toggle = (roleId: number, moduleKey: string, field: 'acces' | 'fullAccess', value: boolean) => {
    const row = rows.find((r) => r.module === moduleKey)
    if (!row) return
    const cell = row.rolesData[roleId]
    if (!cell) return

    const nextAcces = field === 'acces' ? value : cell.acces
    // Activer l'accès complet implique forcément l'accès de base.
    const nextFull = field === 'fullAccess' ? value : cell.fullAccess
    const effectiveAcces = nextFull ? true : nextAcces

    const payload: PERMISSION_INPUT_T = {
      role_id: roleId,
      module: moduleKey,
      autorise: effectiveAcces,
      acces: effectiveAcces,
      full_access: nextFull,
    }

    if (cell.existing) {
      update({ id: cell.existing.id, data: payload })
    } else {
      create(payload)
    }
  }

  return { 
    roles, 
    rows, 
    isLoading: rolesLoading || permsLoading, 
    isSaving: isCreating || isUpdating, 
    toggle 
  }
}
