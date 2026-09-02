export const MOCK_WORKFLOW = {
  id: 1,
  title: "AGR Classique", 
  code: "PRCO 1", 
  version: "1.0",
  cycles: [
    {
      n: 1, code: "PRCO 1.1", t: "Les travaux préparatoires", subs: [
        { t: "1.1 Définition zone & secteur", acteurs: "DPF", liv: "Mode opératoire" },
        { t: "1.2 Identification de la cible", acteurs: "DPF", liv: "Mode opératoire", note: "Nationalité ivoirienne · 18-40 ans · expérience 2 mois · dossier complet" },
        { t: "1.3 Conditions de financement", acteurs: "DPF", liv: "Mode opératoire", note: "100 000 – 1 000 000 F (plafond 2 500 000 F collectif) · 8% · 24 mois" },
        { t: "1.4 Répartition des objectifs", acteurs: "DESSE · DPF · Administrateur · DAICG", liv: "Note de service", delai: "3 semaines après notification budgétaire" }]
    },
    {
      n: 2, code: "PRCO 1.2", t: "Information & sensibilisation", subs: [
        { t: "2.1 Plan de communication", acteurs: "Sous-Dir. Communication · CAR", liv: "Plan de communication", delai: "14 j avant lancement" },
        { t: "2.2 Mise en œuvre", acteurs: "DIC · Agences régionales", liv: "Plan diffusé, courriers", delai: "14 jours" }]
    },
    {
      n: 3, code: "PRCO 1.3", t: "L'enrôlement", subs: [
        { t: "3.1 Cellule d'enrôlement", acteurs: "Chef d'Agence Régionale", liv: "Liste des membres", delai: "24 h" },
        { t: "3.2 Enrôlement", acteurs: "CIP · AC · Informaticiens", liv: "Dossier candidature · BDD enrôlés", delai: "14 jours", dec: "—" }]
    },
    {
      n: 4, code: "PRCO 1.4", t: "Présélection communale", subs: [
        { t: "Présélection", acteurs: "Comité de présélection · Chef d'Agence · DPF", liv: "PV présélection · liste présélectionnés", delai: "9 jours", dec: "Retenu / Non retenu" }]
    },
    {
      n: 5, code: "PRCO 1.5", t: "Formation des promoteurs", subs: [
        { t: "5.1 Validation des modules", acteurs: "Prestataire · DPF", liv: "Matrice · planning", delai: "72 h" },
        { t: "5.2 Exécution des modules", acteurs: "Prestataire · CIP · AC · CAR", liv: "Plans d'affaires · BDD formés", delai: "1 mois" }]
    },
    {
      n: 6, code: "PRCO 1.6", t: "Récupération des projets sélectionnés", subs: [
        { t: "6.1 Récupération des projets sélectionnés", acteurs: "Chef Service Dév. Ressources de Financement", liv: "Liste consolidée", delai: "Dès formation achevée", note: "Point de départ : promoteurs sélectionnés et formés" }]
    },
    {
      n: 7, code: "PRCO 1.7", t: "Ajout des plans d'affaires par les agences", subs: [
        { t: "7.1 Ajout des plans d'affaires par les agences régionales", acteurs: "Chef d'Agence Régionale · CIP", liv: "Fichiers plans d'affaires", note: "Tous les profils sont notifiés" }]
    },
    {
      n: 8, code: "PRCO 1.8", t: "Transmission au partenaire financier", subs: [
        { t: "8.1 Transmission au(x) partenaire(s)", acteurs: "Chef Service", liv: "Lots Excel", delai: "Par lot", note: "Vue d'ensemble pour tous" }]
    },
    {
      n: 9, code: "PRCO 1.9", t: "Traitement du dossier par le partenaire", subs: [
        { t: "9.1 Traitement du dossier", acteurs: "Point focal Partenaire", liv: "Approbation / Rejet", delai: "Saisie directe", dec: "Approuvé / Rejeté", note: "Le dossier revient au chef de service" }]
    },
    {
      n: 10, code: "PRCO 1.10", t: "Décaissement & remboursement", subs: [
        { t: "10.1 Décaissement", acteurs: "Partenaire financier", liv: "Lignes de décaissement", delai: "Selon plan" },
        { t: "10.2 Remboursement", acteurs: "Partenaire financier", liv: "Échéancier", delai: "Import par N° de dossier", note: "Suivi organisé en 3 listes" },
        { t: "10.3 Recouvrement en cas d'impayés", acteurs: "Chef de Service Financement", liv: "Actions de rappel", dec: "Amiable / Contentieux" }]
    },
    {
      n: 11, code: "PRCO 1.11", t: "Suivi terrain & évaluation d'impact", subs: [
        { t: "11.1 Visite de suivi", acteurs: "Agences régionales · DPF", liv: "Fiche de visite", delai: "Dès le 1ᵉʳ décaissement" },
        { t: "11.2 Évaluation & études d'impact", acteurs: "DESSE · DAICG", liv: "Rapport d'évaluation", delai: "Selon TdR" }]
    }
  ]
}

export const MOCK_PROJECTS = [
  { id: 'p1', titre: 'Ferme Avicole Mermoz', code: 'PRJ-001', jeune: 'Kouassi Jean', montant: 500000, etape: 8, statut: 'bl' },
  { id: 'p2', titre: 'Atelier de Couture', code: 'PRJ-002', jeune: 'Bamba Aminata', montant: 350000, etape: 9, statut: 'gr' },
  { id: 'p3', titre: 'Cybercafé & Services', code: 'PRJ-003', jeune: 'Touré Ibrahim', montant: 1000000, etape: 10, statut: 'or' },
  { id: 'p4', titre: 'Boutique de cosmétiques', code: 'PRJ-004', jeune: 'Koné Fatou', montant: 250000, etape: 7, statut: 'bl' },
  { id: 'p5', titre: 'Lavage Auto Pro', code: 'PRJ-005', jeune: 'Diabaté Moussa', montant: 400000, etape: 6, statut: 'slate' },
]
