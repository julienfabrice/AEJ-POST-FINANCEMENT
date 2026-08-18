import { useState } from 'react'
import {
  FolderOpen,
  ClipboardList,
  Banknote,
  TrendingUp,
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  ArrowRight,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader,  } from '@/components/ui/card'
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


const STATS = [
  { label: 'Total dossiers', value: '1 256', change: '+12 cette semaine', icon: FolderOpen, color: '#E7722B' },
  { label: 'En instruction', value: '127', change: '42 à certifier', icon: ClipboardList, color: '#2D6BD4' },
  { label: 'Financés', value: '874', change: '+8 ce mois', icon: Banknote, color: '#20A83A' },
  { label: 'Taux de couverture', value: '78%', change: '+2,1 pts', icon: TrendingUp, color: '#E0A106' },
]

const MOCK_PROJETS = [
  { id: '1', ref: 'PRJ-2025-0041', titre: 'Ferme Avicole Yéo', promoteur: 'Yéo Lacina', dispositif: 'AGR Classique', agence: 'Korhogo', montant: '1 500 000', statut: 'FINANCEMENT', date: '14/01/2025' },
  { id: '2', ref: 'PRJ-2025-0038', titre: 'Atelier de Couture Awa', promoteur: 'Touré Awa', dispositif: 'MEPS', agence: 'Abidjan', montant: '2 000 000', statut: 'ANALYSE', date: '13/01/2025' },
  { id: '3', ref: 'PRJ-2025-0035', titre: 'Boutique Multiservices', promoteur: 'Kouamé Yao Brice', dispositif: 'AGR Classique', agence: 'Abidjan', montant: '800 000', statut: 'DECAISSEMENT', date: '12/01/2025' },
  { id: '4', ref: 'PRJ-2025-0031', titre: 'Transformation de Manioc', promoteur: 'Bamba Aminata', dispositif: 'MPE', agence: 'Daloa', montant: '3 500 000', statut: 'SOUMISSION', date: '10/01/2025' },
  { id: '5', ref: 'PRJ-2025-0028', titre: 'Lavage Auto Pro', promoteur: 'Ouattara Seydou', dispositif: 'MEPS', agence: 'San-Pedro', montant: '1 200 000', statut: 'CERTIFICATION', date: '09/01/2025' },
  { id: '6', ref: 'PRJ-2025-0025', titre: 'Elevage Porcin', promoteur: 'Koné Ibrahim', dispositif: 'AGR Classique', agence: 'Korhogo', montant: '900 000', statut: 'SUIVI', date: '08/01/2025' },
  { id: '7', ref: 'PRJ-2025-0022', titre: 'Vente de Garba', promoteur: 'Diabaté Fatoumata', dispositif: 'AGR Classique', agence: 'Bouaké', montant: '500 000', statut: 'REMBOURSEMENT', date: '07/01/2025' },
  { id: '8', ref: 'PRJ-2025-0019', titre: 'Salon de Coiffure', promoteur: 'Kouassi Akissi', dispositif: 'MEPS', agence: 'Bouaké', montant: '1 800 000', statut: 'ANALYSE', date: '05/01/2025' },
  { id: '9', ref: 'PRJ-2025-0015', titre: 'Ferme Maraîchère', promoteur: 'Camara Moussa', dispositif: 'MPE', agence: 'Odienné', montant: '4 200 000', statut: 'FINANCEMENT', date: '03/01/2025' },
  { id: '10', ref: 'PRJ-2025-0012', titre: 'Mini Marché Aka', promoteur: 'Aka Marguerite', dispositif: 'AGR Classique', agence: 'Aboisso', montant: '1 100 000', statut: 'DECAISSEMENT', date: '02/01/2025' },
  { id: '11', ref: 'PRJ-2024-0988', titre: 'Atelier de Menuiserie', promoteur: 'N\'Guessan Koffi', dispositif: 'MEPS', agence: 'Yamoussoukro', montant: '2 500 000', statut: 'SUIVI', date: '28/12/2024' },
  { id: '12', ref: 'PRJ-2024-0985', titre: 'Culture de Maïs', promoteur: 'Soro Guillaume', dispositif: 'AGR Classique', agence: 'Ferkessédougou', montant: '1 300 000', statut: 'REMBOURSEMENT', date: '27/12/2024' },
  { id: '13', ref: 'PRJ-2024-0970', titre: 'Cybercafé', promoteur: 'Touré Awa', dispositif: 'MEPS', agence: 'Abidjan', montant: '1 900 000', statut: 'CERTIFICATION', date: '20/12/2024' },
  { id: '14', ref: 'PRJ-2024-0965', titre: 'Vente de Produits Vivriers', promoteur: 'Bamba Aminata', dispositif: 'AGR Classique', agence: 'Daloa', montant: '750 000', statut: 'SOUMISSION', date: '18/12/2024' },
  { id: '15', ref: 'PRJ-2024-0950', titre: 'Atelier Mécanique', promoteur: 'Ouattara Seydou', dispositif: 'MPE', agence: 'San-Pedro', montant: '5 000 000', statut: 'SUIVI', date: '15/12/2024' },
]

const STATUS_STYLES: Record<string, string> = {
  SOUMISSION: 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-0',
  ANALYSE: 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-0',
  CERTIFICATION: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-0',
  FINANCEMENT: 'bg-[#FBEADE] text-[#C85E18] hover:bg-[#FBEADE] border-0',
  DECAISSEMENT: 'bg-[#E3F6E7] text-[#178A2E] hover:bg-[#E3F6E7] border-0',
  SUIVI: 'bg-blue-50 text-blue-600 hover:bg-blue-50 border-0',
  REMBOURSEMENT: 'bg-green-50 text-green-700 hover:bg-green-50 border-0',
}

export function ProjetsPage() {
  const [page, setPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(MOCK_PROJETS.length / itemsPerPage)
  
  const currentItems = MOCK_PROJETS.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#131C29]">Micro-projets</h1>
          <p className="text-sm text-[#5A6B80] mt-1">Suivi des dossiers de financement des jeunes promoteurs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau dossier
          </Button>
        </div>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[#5A6B80] font-medium">{stat.label}</span>
                  <div
                    className="w-9 h-9 rounded-lg grid place-items-center"
                    style={{ background: `${stat.color}18` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-[#131C29]">{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filtres & Tableau */}
      <Card>
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Référence, titre du projet ou nom du promoteur..."
                className="pl-9 bg-[#F3F5F8] border-none"
              />
            </div>
            <Select defaultValue="tous">
              <SelectTrigger className="w-full md:w-[160px] bg-[#F3F5F8] border-none">
                <SelectValue placeholder="Dispositif" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous dispositifs</SelectItem>
                <SelectItem value="agr">AGR Classique</SelectItem>
                <SelectItem value="meps">MEPS</SelectItem>
                <SelectItem value="mpe">MPE</SelectItem>
                <SelectItem value="struct">Projets structurants</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="tous">
              <SelectTrigger className="w-full md:w-[160px] bg-[#F3F5F8] border-none">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous statuts</SelectItem>
                <SelectItem value="soumission">Soumission</SelectItem>
                <SelectItem value="analyse">Analyse</SelectItem>
                <SelectItem value="certification">Certification</SelectItem>
                <SelectItem value="financement">Financement</SelectItem>
                <SelectItem value="decaissement">Décaissement</SelectItem>
                <SelectItem value="suivi">Suivi</SelectItem>
                <SelectItem value="remboursement">Remboursement</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="toutes">
              <SelectTrigger className="w-full md:w-[160px] bg-[#F3F5F8] border-none">
                <SelectValue placeholder="Agence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="toutes">Toutes agences</SelectItem>
                <SelectItem value="abidjan">Abidjan</SelectItem>
                <SelectItem value="bouake">Bouaké</SelectItem>
                <SelectItem value="korhogo">Korhogo</SelectItem>
                <SelectItem value="daloa">Daloa</SelectItem>
                <SelectItem value="san-pedro">San-Pedro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px]">Référence</TableHead>
                <TableHead>Titre du projet</TableHead>
                <TableHead>Promoteur</TableHead>
                <TableHead>Agence</TableHead>
                <TableHead className="text-right">Montant (FCFA)</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((projet) => (
                <TableRow key={projet.id} className="hover:bg-[#F3F5F8] cursor-pointer">
                  <TableCell className="font-mono text-xs font-medium text-slate-500">
                    {projet.ref}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-[#131C29] max-w-[200px] truncate" title={projet.titre}>
                      {projet.titre}
                    </div>
                    <div className="text-xs text-slate-500">{projet.dispositif}</div>
                  </TableCell>
                  <TableCell className="text-slate-700">{projet.promoteur}</TableCell>
                  <TableCell className="text-sm text-slate-600">{projet.agence}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-[#131C29]">
                    {projet.montant}
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_STYLES[projet.statut] || 'bg-slate-100 text-slate-700 border-0'}>
                      {projet.statut.charAt(0) + projet.statut.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">{projet.date}</TableCell>
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
                          Ouvrir le dossier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowRight className="mr-2 h-4 w-4 text-slate-500" />
                          Avancer l'étape
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
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <div className="text-sm text-slate-500">
              {(page - 1) * itemsPerPage + 1}–{Math.min(page * itemsPerPage, MOCK_PROJETS.length)} sur {MOCK_PROJETS.length}
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
        </CardContent>
      </Card>
    </div>
  )
}
