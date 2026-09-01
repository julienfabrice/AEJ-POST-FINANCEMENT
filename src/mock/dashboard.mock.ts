export const MOCK_ADMIN_KPIS = [
  { id: 'enroles', label: "Promoteurs enrôlés", value: "25", desc: "+2 ce mois", up: true, icon: "Users", color: "#E7722B", bg: "#fef1e8" },
  { id: 'actifs', label: "Micro-projets actifs", value: "25", desc: "10 en instruction", up: true, icon: "FolderOpen", color: "#2D6BD4", bg: "#eff6ff" },
  { id: 'decaisse', label: "Montant décaissé", value: "48 500 000", suffix: "F", desc: "4 décaissements", up: true, icon: "Banknote", color: "#20A83A", bg: "#ebf8ee" },
  { id: 'rembourse', label: "Taux de remboursement", value: "85%", desc: "1 impayé(s)", up: true, icon: "TrendingUp", color: "#8a6503", bg: "#fef3c7" }
]

export const MOCK_SITUATION_GLOBALE = {
  sollicite: "125 000 000",
  finance: "48 500 000",
  nbFinances: 12,
  nbTotal: 25,
  tauxCouverture: 38
}

export const MOCK_ETAPES_BARS = [
  { label: "SOUMISSION", value: 3 },
  { label: "ANALYSE", value: 4 },
  { label: "CERTIFICATION", value: 4 },
  { label: "FINANCEMENT", value: 2 },
  { label: "DECAISSEMENT", value: 4 },
  { label: "SUIVI", value: 3 },
  { label: "REMBOURSEMENT", value: 5 }
]

export const MOCK_REGIONS_HBARS = [
  { label: "Abidjan", nb: 8, montant: "25.5M" },
  { label: "Yamoussoukro", nb: 4, montant: "12.0M" },
  { label: "Bouaké", nb: 3, montant: "5.0M" },
  { label: "San-Pedro", nb: 2, montant: "4.0M" },
  { label: "Korhogo", nb: 1, montant: "2.0M" }
]

export const MOCK_AGENCES_HBARS = [
  { label: "Agence Abidjan Sud", nb: 5, montant: "15.0M" },
  { label: "Agence Abidjan Nord", nb: 3, montant: "10.5M" },
  { label: "Agence Yamoussoukro", nb: 4, montant: "12.0M" },
  { label: "Agence Bouaké", nb: 3, montant: "5.0M" },
  { label: "Agence San-Pedro", nb: 2, montant: "4.0M" }
]

export const MOCK_SUIVI_TERRAIN = {
  bonneVoie: 10,
  difficulte: 2,
  nonVisites: 13
}

export const MOCK_ANNEE_REGION = [
  { annee: "2024", region: "Abidjan", montant: "25 500 000 F" },
  { annee: "2024", region: "Yamoussoukro", montant: "12 000 000 F" },
  { annee: "2024", region: "Bouaké", montant: "5 000 000 F" },
  { annee: "2024", region: "San-Pedro", montant: "4 000 000 F" }
]
export const MOCK_AGENT_KPIS = [
  { id: 'enroles', label: "Promoteurs enrôlés", value: "12", desc: "+1 ce mois", up: true, icon: "Users", color: "#E7722B", bg: "#fef1e8" },
  { id: 'actifs', label: "Micro-projets actifs", value: "8", desc: "3 en instruction", up: true, icon: "FolderOpen", color: "#2D6BD4", bg: "#eff6ff" },
  { id: 'decaisse', label: "Montant décaissé", value: "15 000 000", suffix: "F", desc: "2 décaissements", up: true, icon: "Banknote", color: "#20A83A", bg: "#ebf8ee" },
  { id: 'rembourse', label: "Taux de remboursement", value: "90%", desc: "0 impayé(s)", up: true, icon: "TrendingUp", color: "#8a6503", bg: "#fef3c7" }
]

export const MOCK_AGENT_SITUATION_GLOBALE = {
  sollicite: "25 000 000",
  finance: "15 000 000",
  nbFinances: 4,
  nbTotal: 8,
  tauxCouverture: 60
}

export const MOCK_AGENT_ETAPES_BARS = [
  { label: "SOUMISSION", value: 1 },
  { label: "ANALYSE", value: 2 },
  { label: "CERTIFICATION", value: 1 },
  { label: "FINANCEMENT", value: 1 },
  { label: "DECAISSEMENT", value: 1 },
  { label: "SUIVI", value: 1 },
  { label: "REMBOURSEMENT", value: 1 }
]

export const MOCK_AGENT_SUIVI_TERRAIN = {
  bonneVoie: 3,
  difficulte: 0,
  nonVisites: 5
}
export const MOCK_BENEF_PROJET = {
  code: "MP-2025-0041",
  titre: "Élevage de volailles",
  statut: "FINANCEMENT",
  montant: "1 500 000 F",
  pieces_deposees: 4,
  pieces_totales: 6
}

export const MOCK_BENEF_PLAN = {
  total: "1 500 000 F",
  recu: "500 000 F",
  tranches: 3,
  tranches_recues: 1,
  valide_benef: false,
}

export const MOCK_BENEF_REMBOURSEMENTS = [
  { echeance: "2025-04-10", du: "50 000 F", paye: "50 000 F", reste: "0 F", statut: "PAYE" },
  { echeance: "2025-05-10", du: "50 000 F", paye: "20 000 F", reste: "30 000 F", statut: "PARTIEL" },
  { echeance: "2025-06-10", du: "50 000 F", paye: "0 F", reste: "50 000 F", statut: "IMPAYE" },
]

export const MOCK_BENEF_TASKS = [
  { id: 'doc', titre: "Compléter vos pièces justificatives", desc: "4/6 pièces déposées", icon: 'doc', color: 'amber', route: 'benef_documents' },
  { id: 'flow', titre: "Valider votre plan de décaissement", desc: "3 tranches à confirmer", icon: 'flow', color: 'orange', route: 'benef_plan' },
  { id: 'chart', titre: "Remplir votre fiche de suivi mensuel", desc: "Renseignez votre chiffre d'affaires et vos emplois", icon: 'chart', color: 'blue', route: 'benef_suivi' },
  { id: 'repay', titre: "Régler vos échéances impayées", desc: "1 échéance(s) en attente", icon: 'repay', color: 'red', route: 'benef_remb' },
]
export const MOCK_PF_KPIS = [
  { id: 'lots', label: "Lots transmis", value: "3", desc: "1 en cours", up: true, icon: "FolderOpen", color: "#E7722B", bg: "#fef1e8" },
  { id: 'approuves', label: "Dossiers approuvés", value: "15", desc: "+5 ce mois", up: true, icon: "CheckCircle", color: "#2D6BD4", bg: "#eff6ff" },
  { id: 'engage', label: "Montant engagé", value: "22 500 000", suffix: "F", desc: "Pour 15 dossiers", up: true, icon: "Banknote", color: "#20A83A", bg: "#ebf8ee" },
  { id: 'rembourse', label: "Taux du portefeuille", value: "92%", desc: "1 impayé", up: true, icon: "TrendingUp", color: "#8a6503", bg: "#fef3c7" }
]

export const MOCK_PF_LOTS_RECENTS = [
  { ref: "LOT-2025-003", dispositif: "AGR", date: "2025-03-10", statut: "EN_COURS", montant: "10 000 000 F", dossiers: 5 },
  { ref: "LOT-2025-002", dispositif: "MPE", date: "2025-02-15", statut: "VALIDE", montant: "25 000 000 F", dossiers: 2 },
  { ref: "LOT-2025-001", dispositif: "AGR", date: "2025-01-10", statut: "VALIDE", montant: "12 500 000 F", dossiers: 8 },
]

export const MOCK_PF_ETAPES = [
  { label: "DECAISSEMENT", value: 3 },
  { label: "SUIVI", value: 5 },
  { label: "REMBOURSEMENT", value: 7 }
]

export const MOCK_RECENT_PROJECTS = [
  { ref: 'PRJ-2025-0041', promoteur: 'Kouamé Yao Brice', dispositif: 'AGR Classique', montant: '1 500 000', statut: 'FINANCEMENT', date: '14/01/2025' },
  { ref: 'PRJ-2025-0038', promoteur: 'Diabaté Fatoumata', dispositif: 'MEPS', montant: '2 000 000', statut: 'ANALYSE', date: '13/01/2025' },
  { ref: 'PRJ-2025-0035', promoteur: 'Koné Ibrahim', dispositif: 'AGR Classique', montant: '800 000', statut: 'DECAISSEMENT', date: '12/01/2025' },
  { ref: 'PRJ-2025-0031', promoteur: 'Bamba Aminata', dispositif: 'MPE', montant: '3 500 000', statut: 'SOUMISSION', date: '10/01/2025' },
  { ref: 'PRJ-2025-0028', promoteur: 'Ouattara Seydou', dispositif: 'MEPS', montant: '1 200 000', statut: 'CERTIFICATION', date: '09/01/2025' },
  { ref: 'PRJ-2025-0025', promoteur: 'Touré Awa', dispositif: 'MPE', montant: '4 500 000', statut: 'SUIVI', date: '08/01/2025' },
  { ref: 'PRJ-2025-0021', promoteur: 'Koffi Jean-Luc', dispositif: 'AGR Classique', montant: '950 000', statut: 'REMBOURSEMENT', date: '05/01/2025' },
  { ref: 'PRJ-2025-0018', promoteur: 'Cissé Mariam', dispositif: 'MEPS', montant: '1 800 000', statut: 'ANALYSE', date: '04/01/2025' }
]
import { FolderOpen, Users, Banknote, TrendingUp } from 'lucide-react'

export const MOCK_DASHBOARD_STATS = [
  { label: 'Promoteurs enregistrés', value: '2 841', change: '+12%', icon: Users, color: '#E7722B' },
  { label: 'Micro-projets actifs', value: '1 256', change: '+8%', icon: FolderOpen, color: '#20A83A' },
  { label: 'Financements accordés', value: '874', change: '+5%', icon: Banknote, color: '#2D6BD4' },
  { label: 'Taux de remboursement', value: '78,4 %', change: '+2,1 pts', icon: TrendingUp, color: '#E0A106' },
]
