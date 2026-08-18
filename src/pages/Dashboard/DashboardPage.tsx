
import { 
  FolderOpen, 
  Users, 
  Banknote, 
  TrendingUp,
  Download, Plus,
  
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
} from '@/components/ui/dropdown-menu'

const STATS = [
  { label: 'Promoteurs enregistrés', value: '2 841', change: '+12%', icon: Users, color: '#E7722B' },
  { label: 'Micro-projets actifs', value: '1 256', change: '+8%', icon: FolderOpen, color: '#20A83A' },
  { label: 'Financements accordés', value: '874', change: '+5%', icon: Banknote, color: '#2D6BD4' },
  { label: 'Taux de remboursement', value: '78,4 %', change: '+2,1 pts', icon: TrendingUp, color: '#E0A106' },
]

const RECENT = [
  { ref: 'PRJ-2025-0041', promoteur: 'Kouamé Yao Brice', dispositif: 'AGR Classique', montant: '1 500 000', statut: 'FINANCEMENT', date: '14/01/2025' },
  { ref: 'PRJ-2025-0038', promoteur: 'Diabaté Fatoumata', dispositif: 'MEPS', montant: '2 000 000', statut: 'ANALYSE', date: '13/01/2025' },
  { ref: 'PRJ-2025-0035', promoteur: 'Koné Ibrahim', dispositif: 'AGR Classique', montant: '800 000', statut: 'DECAISSEMENT', date: '12/01/2025' },
  { ref: 'PRJ-2025-0031', promoteur: 'Bamba Aminata', dispositif: 'MPE', montant: '3 500 000', statut: 'SOUMISSION', date: '10/01/2025' },
  { ref: 'PRJ-2025-0028', promoteur: 'Ouattara Seydou', dispositif: 'MEPS', montant: '1 200 000', statut: 'CERTIFICATION', date: '09/01/2025' },
]

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  SOUMISSION: { label: 'Soumission', variant: 'secondary' },
  ANALYSE: { label: 'Analyse', variant: 'outline' },
  CERTIFICATION: { label: 'Certification', variant: 'secondary' },
  FINANCEMENT: { label: 'Financement', variant: 'default' },
  DECAISSEMENT: { label: 'Décaissement', variant: 'default' },
  REMBOURSEMENT: { label: 'Remboursement', variant: 'outline' },
}

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* En-tête de page */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#131C29]">Tableau de bord</h1>
          <p className="text-sm text-[#5A6B80] mt-1">Vue d'ensemble de la plateforme AEJ</p>
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
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
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
                <p className="text-xs text-[#20A83A] font-semibold mt-1">{stat.change} ce mois</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tableau des dossiers récents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dossiers récents</CardTitle>
              <CardDescription>Les 5 derniers dossiers enregistrés sur la plateforme</CardDescription>
            </div>
            <Select defaultValue="tous">
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue placeholder="Filtrer par dispositif" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les dispositifs</SelectItem>
                <SelectItem value="agr">AGR Classique</SelectItem>
                <SelectItem value="meps">MEPS</SelectItem>
                <SelectItem value="mpe">MPE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Promoteur</TableHead>
                <TableHead>Dispositif</TableHead>
                <TableHead className="text-right">Montant (FCFA)</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECENT.map((row) => {
                const s = STATUS_MAP[row.statut]
                return (
                  <TableRow key={row.ref} className="hover:bg-[#F3F5F8] cursor-pointer">
                    <TableCell className="font-mono text-xs font-semibold text-[#5A6B80]">
                      {row.ref}
                    </TableCell>
                    <TableCell className="font-medium">{row.promoteur}</TableCell>
                    <TableCell className="text-sm text-[#5A6B80]">{row.dispositif}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {row.montant}
                    </TableCell>
                    <TableCell>
                      <Badge variant={s?.variant ?? 'secondary'} className="text-xs">
                        {s?.label ?? row.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-[#5A6B80]">{row.date}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
