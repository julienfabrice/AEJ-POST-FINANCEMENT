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

export function JeunesFilters() {
  return (
    <Card className="p-4 flex flex-col sm:flex-row items-center gap-4 bg-white">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Rechercher par nom, téléphone, matricule..."
          className="pl-9 bg-[#F3F5F8] border-none"
        />
      </div>
      <Select defaultValue="tous">
        <SelectTrigger className="w-full sm:w-[180px] bg-[#F3F5F8] border-none">
          <SelectValue placeholder="Dispositif" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tous">Tous les dispositifs</SelectItem>
          <SelectItem value="agr">AGR Classique</SelectItem>
          <SelectItem value="meps">MEPS</SelectItem>
          <SelectItem value="mpe">MPE</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="toutes">
        <SelectTrigger className="w-full sm:w-[180px] bg-[#F3F5F8] border-none">
          <SelectValue placeholder="Région" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="toutes">Toutes les régions</SelectItem>
          <SelectItem value="abidjan">Abidjan</SelectItem>
          <SelectItem value="bouake">Bouaké</SelectItem>
          <SelectItem value="korhogo">Korhogo</SelectItem>
          <SelectItem value="daloa">Daloa</SelectItem>
          <SelectItem value="san-pedro">San-Pedro</SelectItem>
        </SelectContent>
      </Select>
    </Card>
  )
}
