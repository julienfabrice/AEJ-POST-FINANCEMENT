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

export function ProjetsFilters() {
  return (
    <Card className="p-4 flex flex-col sm:flex-row items-center gap-4 bg-white shadow-sm border-slate-100">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Référence, titre du projet ou nom du promoteur..."
          className="pl-9 bg-[#F3F5F8] border-none"
        />
      </div>
      <Select defaultValue="tous_disp">
        <SelectTrigger className="w-full sm:w-[180px] bg-[#F3F5F8] border-none">
          <SelectValue placeholder="Dispositif" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tous_disp">Tous les dispositifs</SelectItem>
          <SelectItem value="agr">AGR Classique</SelectItem>
          <SelectItem value="meps">MEPS</SelectItem>
          <SelectItem value="mpe">MPE</SelectItem>
          <SelectItem value="struct">Projets structurants / Start-Up</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="tous_statut">
        <SelectTrigger className="w-full sm:w-[180px] bg-[#F3F5F8] border-none">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tous_statut">Tous les statuts</SelectItem>
          <SelectItem value="SOUMISSION">Soumission</SelectItem>
          <SelectItem value="ANALYSE">Analyse</SelectItem>
          <SelectItem value="CERTIFICATION">Certification</SelectItem>
          <SelectItem value="FINANCEMENT">Financement</SelectItem>
          <SelectItem value="DECAISSEMENT">Décaissement</SelectItem>
          <SelectItem value="SUIVI">Suivi</SelectItem>
          <SelectItem value="REMBOURSEMENT">Remboursement</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="toutes_agences">
        <SelectTrigger className="w-full sm:w-[160px] bg-[#F3F5F8] border-none">
          <SelectValue placeholder="Agence" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="toutes_agences">Toutes les agences</SelectItem>
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
