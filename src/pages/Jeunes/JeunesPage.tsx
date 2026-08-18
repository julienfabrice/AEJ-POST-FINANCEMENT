import { useState } from 'react'
import { MOCK_JEUNES } from '@/mock'

import {
  Search,
  UserPlus,
  Download,
  MoreHorizontal,
  Eye,
  History,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const AVATAR_COLORS = [
  '#E7722B',
  '#20A83A',
  '#2D6BD4',
  '#E0A106',
  '#D6453B',
  '#8B5CF6',
]



export function JeunesPage() {
  const [page, setPage] = useState(1)
  const itemsPerPage = 8
  const totalPages = Math.ceil(MOCK_JEUNES.length / itemsPerPage)
  
  const currentItems = MOCK_JEUNES.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  return (
    <div className="space-y-6">
      {/* En-tête de page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#131C29]">Promoteurs (porteurs)</h1>
          <p className="text-sm text-[#5A6B80] mt-1">Gestion des jeunes promoteurs enregistrés</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Nouveau promoteur
          </Button>
        </div>
      </div>

      {/* Barre de filtres */}
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
        <div className="text-sm text-slate-500 font-medium whitespace-nowrap">
          {MOCK_JEUNES.length} promoteur(s) trouvé(s)
        </div>
      </Card>

      {/* Tableau */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px]">Matricule</TableHead>
              <TableHead>Nom complet</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Localité</TableHead>
              <TableHead>Secteur d'activité</TableHead>
              <TableHead className="text-center">Projets</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((jeune, idx) => {
              const color = AVATAR_COLORS[idx % AVATAR_COLORS.length]
              const initials = `${jeune.prenoms.charAt(0)}${jeune.nom.charAt(0)}`.toUpperCase()
              
              return (
                <TableRow key={jeune.id} className="hover:bg-[#F3F5F8]">
                  <TableCell className="font-mono text-xs text-slate-500 font-medium">
                    {jeune.matricule}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback
                          className="text-white text-xs font-bold"
                          style={{ backgroundColor: color }}
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-[#131C29]">
                        {jeune.prenoms} {jeune.nom}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-slate-600">
                    {jeune.telephone}
                  </TableCell>
                  <TableCell className="text-slate-600">{jeune.ville}</TableCell>
                  <TableCell className="text-slate-600">{jeune.secteur}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-mono">
                      {jeune.nb_projets}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {jeune.actif ? (
                      <Badge className="bg-[#E3F6E7] text-[#178A2E] hover:bg-[#E3F6E7] border-0">
                        Actif
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-0">
                        Inactif
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4 text-slate-500" />
                          Voir le profil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <History className="mr-2 h-4 w-4 text-slate-500" />
                          Antécédents
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4 text-slate-500" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <div className="text-sm text-slate-500">
            Page {page} de {totalPages} &middot; {MOCK_JEUNES.length} promoteurs
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
