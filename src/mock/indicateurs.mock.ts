export const indicateurs = [
  { id: 'in-emp', code: 'IND-EMP', nom: "Nombre d'emplois créés", micro_projet_id: null, unite: "Emplois", type_valeur: "Entier", valeur_cible: 300000, statut: 1 },
  { id: 'in-empf', code: 'IND-EMPF', nom: "Emplois créés — Femmes", micro_projet_id: null, unite: "Emplois", type_valeur: "Entier", valeur_cible: 100000, statut: 1 },
  { id: 'in-empj', code: 'IND-EMPJ', nom: "Emplois créés — Jeunes", micro_projet_id: null, unite: "Emplois", type_valeur: "Entier", valeur_cible: 200000, statut: 1 },
  { id: 'in-stg', code: 'IND-STG', nom: "Nombre de stagiaires accueillis", micro_projet_id: null, unite: "Personnes", type_valeur: "Entier", valeur_cible: 40000, statut: 1 },
  { id: 'in-form', code: 'IND-FORM', nom: "Nombre de promoteurs formés", micro_projet_id: null, unite: "Personnes", type_valeur: "Entier", valeur_cible: 30000, statut: 1 },
  { id: 'in-femi', code: 'IND-FEMI', nom: "Femmes promotrices installées", micro_projet_id: null, unite: "Personnes", type_valeur: "Entier", valeur_cible: 400, statut: 1 }
];

export const indicateurs_suivi = [
  { id: 'is1', indicateur_id: 'in-emp', jeune_id: 'j1', periode: "2024-10", valeur: "4", created: "2024-10-31" },
  { id: 'is2', indicateur_id: 'in-emp', jeune_id: 'j1', periode: "2024-11", valeur: "6", created: "2024-11-30" },
  { id: 'is3', indicateur_id: 'in-empf', jeune_id: 'j1', periode: "2024-11", valeur: "3", created: "2024-11-30" },
  { id: 'is4', indicateur_id: 'in-empj', jeune_id: 'j1', periode: "2024-11", valeur: "5", created: "2024-11-30" },
  { id: 'is5', indicateur_id: 'in-stg', jeune_id: 'j1', periode: "2024-11", valeur: "2", created: "2024-11-30" },
  { id: 'is6', indicateur_id: 'in-emp', jeune_id: 'j6', periode: "2024-11", valeur: "5", created: "2024-11-30" },
  { id: 'is7', indicateur_id: 'in-empf', jeune_id: 'j6', periode: "2024-11", valeur: "2", created: "2024-11-30" },
  { id: 'is8', indicateur_id: 'in-form', jeune_id: 'j6', periode: "2024-10", valeur: "1", created: "2024-10-15" },
  { id: 'is9', indicateur_id: 'in-femi', jeune_id: 'j6', periode: "2024-10", valeur: "1", created: "2024-10-15" },
  { id: 'is10', indicateur_id: 'in-emp', jeune_id: 'j12', periode: "2025-02", valeur: "4", created: "2025-02-15" }
];

export const formulaires = [
  { id: 'fm1', micro_projet_id: null, code: "SUIVI-MENSUEL", libelle: "Fiche de suivi mensuel du bénéficiaire", public_cible: "Bénéficiaire", actif: 1 }
];

export const questions = [
  { id: 'qz-ca', formulaire_id: 'fm1', code: 'CA', libelle: "Chiffre d'affaires du mois (FCFA)", type_question: "nombre", ordre: 1, obligatoire: 1 },
  { id: 'qz-emp', formulaire_id: 'fm1', code: 'EMP', libelle: "Emplois créés ce mois", type_question: "nombre", ordre: 2, obligatoire: 1, cible_ind: 'in-emp' },
  { id: 'qz-empf', formulaire_id: 'fm1', code: 'EMPF', libelle: "dont femmes", type_question: "nombre", ordre: 3, obligatoire: 0, cible_ind: 'in-empf' },
  { id: 'qz-empj', formulaire_id: 'fm1', code: 'EMPJ', libelle: "dont jeunes (18-35 ans)", type_question: "nombre", ordre: 4, obligatoire: 0, cible_ind: 'in-empj' },
  { id: 'qz-stg', formulaire_id: 'fm1', code: 'STG', libelle: "Stagiaires accueillis ce mois", type_question: "nombre", ordre: 5, obligatoire: 0, cible_ind: 'in-stg' },
  { id: 'qz-etat', formulaire_id: 'fm1', code: 'ETAT', libelle: "État de l'activité", type_question: "choix", options: ["Bonne marche", "En exploitation", "En difficulté"], ordre: 6, obligatoire: 1 },
  { id: 'qz-diff', formulaire_id: 'fm1', code: 'DIFF', libelle: "Difficultés rencontrées / besoins", type_question: "texte", ordre: 7, obligatoire: 0 }
];
