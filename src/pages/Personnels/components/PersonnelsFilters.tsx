import { RotateCcw, Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface PersonnelsFilterState {
  search: string
  is_active?: string
  role_id?: string
  fonction_id?: string
}

interface PersonnelsFiltersProps {
  filters: PersonnelsFilterState
  setFilters: (f: PersonnelsFilterState) => void
  availableRoles: { id: number; libelle: string }[]
  availableFonctions: { id: number; nom: string }[]
  onAddClick: () => void
}

export function PersonnelsFilters({ filters, setFilters, availableRoles, availableFonctions, onAddClick }: PersonnelsFiltersProps) {
  const activeCount = [filters.is_active, filters.role_id, filters.fonction_id].filter(Boolean).length
  const hasAnyFilter = activeCount > 0 || Boolean(filters.search)

  const clearAll = () => {
    setFilters({ search: '' })
  }

  return (
    <Card className="flex flex-row items-center gap-4 bg-white p-4 flex-wrap">
      <div className="relative w-full max-w-sm">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Rechercher par nom, prénom, email..."
          className="border-none bg-[#F3F5F8] pl-9 h-10"
        />
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <Select
          value={filters.is_active || 'all'}
          onValueChange={(val) => setFilters({ ...filters, is_active: val === 'all' ? undefined : val })}
        >
          <SelectTrigger className="w-[160px] bg-white h-10">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="1">Actif</SelectItem>
            <SelectItem value="0">Inactif</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.role_id || 'all'}
          onValueChange={(val) => setFilters({ ...filters, role_id: val === 'all' ? undefined : val })}
        >
          <SelectTrigger className="w-[180px] bg-white h-10">
            <SelectValue placeholder="Rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            {availableRoles.map(r => (
              <SelectItem key={r.id} value={String(r.id)}>{r.libelle}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.fonction_id || 'all'}
          onValueChange={(val) => setFilters({ ...filters, fonction_id: val === 'all' ? undefined : val })}
        >
          <SelectTrigger className="w-[220px] bg-white h-10">
            <SelectValue placeholder="Fonction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les fonctions</SelectItem>
            {availableFonctions.map(f => (
              <SelectItem key={f.id} value={String(f.id)}>{f.nom}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasAnyFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="cursor-pointer text-slate-600 px-2 h-10"
            title="Réinitialiser"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
        
        <div className="w-[1px] h-6 bg-slate-200 mx-1" />

        <Button onClick={onAddClick} className="bg-[#E7722B] hover:bg-[#C85E18] text-white h-10 px-4 cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau personnel
        </Button>
      </div>
    </Card>
  )
}
