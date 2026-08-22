import { Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProjetsFilters } from '../hooks/useProjetsFilters'
import { PROJECT_STATUSES } from '@/constants/PROJECT_STATUSES'

export function ProjetsFilters() {
  const { filters, setFilters, term, setTerm } = useProjetsFilters()

  return (
    <Card className="p-4 flex flex-col sm:flex-row items-center gap-4 bg-white shadow-sm border-slate-100">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Référence, titre du projet ou nom du promoteur..."
          className="pl-9 bg-[#F3F5F8] border-none"
        />
      </div>
      <Select 
        value={filters.dispositif_id || 'tous_disp'} 
        onValueChange={(val) => setFilters({ dispositif_id: val === 'tous_disp' ? undefined : val })}
      >
        <SelectTrigger className="w-full sm:w-[180px] bg-[#F3F5F8] border-none">
          <SelectValue placeholder="Dispositif" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tous_disp">Tous les dispositifs</SelectItem>
          <SelectItem value="1">AGR Classique</SelectItem>
          <SelectItem value="2">MEPS</SelectItem>
          <SelectItem value="3">MPE</SelectItem>
          <SelectItem value="4">Projets structurants / Start-Up</SelectItem>
        </SelectContent>
      </Select>
      <Select 
        value={filters.statut || 'tous_statut'}
        onValueChange={(val) => setFilters({ statut: val === 'tous_statut' ? undefined : val })}
      >
        <SelectTrigger className="w-full sm:w-[180px] bg-[#F3F5F8] border-none">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tous_statut">Tous les statuts</SelectItem>
          {PROJECT_STATUSES.map(status => (
            <SelectItem key={status.key} value={status.key}>{status.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select 
        value={filters.agence_id || 'toutes_agences'}
        onValueChange={(val) => setFilters({ agence_id: val === 'toutes_agences' ? undefined : val })}
      >
        <SelectTrigger className="w-full sm:w-[160px] bg-[#F3F5F8] border-none">
          <SelectValue placeholder="Agence" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="toutes_agences">Toutes les agences</SelectItem>
          <SelectItem value="1">Abidjan</SelectItem>
          <SelectItem value="2">Bouaké</SelectItem>
          <SelectItem value="3">Korhogo</SelectItem>
          <SelectItem value="4">Daloa</SelectItem>
          <SelectItem value="5">San-Pedro</SelectItem>
        </SelectContent>
      </Select>
    </Card>
  )
}
