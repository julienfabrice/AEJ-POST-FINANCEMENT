export const MOCK_SITUATION_GLOBALE = {
  sollicite: "125 000 000",
  finance: "48 500 000",
  nbFinances: 12,
  nbTotal: 25,
  tauxCouverture: 38
}

export const MOCK_REGIONS_HBARS = [
  { label: "Abidjan", nb: 8, montant: "25.5M" },
  { label: "Yamoussoukro", nb: 4, montant: "12.0M" },
  { label: "Bouaké", nb: 3, montant: "5.0M" },
  { label: "San-Pedro", nb: 2, montant: "4.0M" },
  { label: "Korhogo", nb: 1, montant: "2.0M" }
]

export const MOCK_SUIVI_TERRAIN = {
  bonneVoie: 10,
  difficulte: 2,
  nonVisites: 13
}

export const MOCK_BENEF_TASKS = [
  { id: 'doc', titre: "Compléter vos pièces justificatives", desc: "4/6 pièces déposées", icon: 'doc', color: 'amber', route: 'benef_documents' },
  { id: 'flow', titre: "Valider votre plan de décaissement", desc: "3 tranches à confirmer", icon: 'flow', color: 'orange', route: 'benef_plan' },
  { id: 'chart', titre: "Remplir votre fiche de suivi mensuel", desc: "Renseignez votre chiffre d'affaires et vos emplois", icon: 'chart', color: 'blue', route: 'benef_suivi' },
  { id: 'repay', titre: "Régler vos échéances impayées", desc: "1 échéance(s) en attente", icon: 'repay', color: 'red', route: 'benef_remb' },
]
