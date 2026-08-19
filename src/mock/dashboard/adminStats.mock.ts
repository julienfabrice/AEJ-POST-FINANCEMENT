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
