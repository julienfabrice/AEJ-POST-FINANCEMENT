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
          <SelectTrigger className="w-full bg-white h-10 font-semibold text-[#131C29]">
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
        <Card className="overflow-hidden border-slate-300">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 border-b-2 border-slate-300">
              <tr>
                <th className="text-left font-bold text-[#131C29] text-[13.5px] uppercase tracking-wide px-4 py-3">Module</th>
                <th className="text-center font-bold text-[#131C29] text-[13.5px] uppercase tracking-wide px-4 py-3 w-36">Accès</th>
                <th className="text-center font-bold text-[#131C29] text-[13.5px] uppercase tracking-wide px-4 py-3 w-36">Accès complet</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={3} className="text-center text-slate-400 py-6">Chargement...</td></tr>
              ) : (
                rows.map((row, i) => (
                  <tr
                    key={row.module}
                    className={`border-b border-slate-200 last:border-0 hover:bg-orange-50/60 transition-colors ${i % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}`}
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-[13px] text-[#131C29]">{row.module}</td>
                    <td className="text-center px-4 py-3">
                      <Checkbox
                        checked={row.acces}
                        disabled={isSaving || row.fullAccess}
                        onCheckedChange={(checked) => toggle(row.module, 'acces', checked === true)}
                        className="w-5 h-5 border-2 border-slate-400 data-[state=checked]:bg-[#E7722B] data-[state=checked]:border-[#E7722B]"
                      />
                    </td>
                    <td className="text-center px-4 py-3">
                      <Checkbox
                        checked={row.fullAccess}
                        disabled={isSaving}
                        onCheckedChange={(checked) => toggle(row.module, 'fullAccess', checked === true)}
                        className="w-5 h-5 border-2 border-slate-400 data-[state=checked]:bg-[#E7722B] data-[state=checked]:border-[#E7722B]"
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