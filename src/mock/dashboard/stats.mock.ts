import { FolderOpen, Users, Banknote, TrendingUp } from 'lucide-react'

export const MOCK_DASHBOARD_STATS = [
  { label: 'Promoteurs enregistrés', value: '2 841', change: '+12%', icon: Users, color: '#E7722B' },
  { label: 'Micro-projets actifs', value: '1 256', change: '+8%', icon: FolderOpen, color: '#20A83A' },
  { label: 'Financements accordés', value: '874', change: '+5%', icon: Banknote, color: '#2D6BD4' },
  { label: 'Taux de remboursement', value: '78,4 %', change: '+2,1 pts', icon: TrendingUp, color: '#E0A106' },
]
