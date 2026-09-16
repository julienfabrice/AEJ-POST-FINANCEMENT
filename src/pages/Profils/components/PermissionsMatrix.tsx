import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { usePermissionsMatrix } from '../hooks/usePermissionsMatrix'

export function PermissionsMatrix() {
  const { roles, roleId, setRoleId, rows, isLoading, isSaving, toggle } = usePermissionsMatrix()

  return (
    <div className="space-y-4">
      <div className="max-w-xs">
        <Select value={roleId ? String(roleId) : undefined} onValueChange={(v) => setRoleId(Number(v))}>
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((r) => (
              <SelectItem key={r.id} value={String(r.id)}>{r.libelle ?? r.name ?? r.code}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!roleId && (
        <p className="text-sm text-slate-500">Sélectionne un rôle pour voir et modifier ses permissions par module.</p>
      )}

      {roleId && (
        <Card className="overflow-hidden border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left font-semibold text-slate-600 px-4 py-2.5">Module</th>
                <th className="text-center font-semibold text-slate-600 px-4 py-2.5 w-32">Accès</th>
                <th className="text-center font-semibold text-slate-600 px-4 py-2.5 w-32">Accès complet</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={3} className="text-center text-slate-400 py-6">Chargement...</td></tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.module} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-2 font-mono text-[12.5px] text-slate-700">{row.module}</td>
                    <td className="text-center px-4 py-2">
                      <Checkbox
                        checked={row.acces}
                        disabled={isSaving || row.fullAccess}
                        onCheckedChange={(checked) => toggle(row.module, 'acces', checked === true)}
                      />
                    </td>
                    <td className="text-center px-4 py-2">
                      <Checkbox
                        checked={row.fullAccess}
                        disabled={isSaving}
                        onCheckedChange={(checked) => toggle(row.module, 'fullAccess', checked === true)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
