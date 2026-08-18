export const MOCK_SECTEURS = [
  { id: 1, libelle: 'Agriculture & Élevage' },
  { id: 2, libelle: 'Commerce & Distribution' },
  { id: 3, libelle: 'Artisanat' },
  { id: 4, libelle: 'Services' },
  { id: 5, libelle: 'TIC & Numérique' }
]

export const MOCK_SOUS_SECTEURS = [
  { id: 1, libelle: 'Aviculture', secteur_id: 1, secteur: 'Agriculture & Élevage' },
  { id: 2, libelle: 'Pisciculture', secteur_id: 1, secteur: 'Agriculture & Élevage' },
  { id: 3, libelle: 'Vente de vêtements', secteur_id: 2, secteur: 'Commerce & Distribution' },
  { id: 4, libelle: 'Menuiserie', secteur_id: 3, secteur: 'Artisanat' },
  { id: 5, libelle: 'Développement Web', secteur_id: 5, secteur: 'TIC & Numérique' }
]

export const MOCK_TYPE_ENTREPRISES = [
  { id: 1, libelle: 'Entreprise Individuelle (EI)' },
  { id: 2, libelle: 'Société à Responsabilité Limitée (SARL)' },
  { id: 3, libelle: 'Société par Actions Simplifiée (SAS)' },
  { id: 4, libelle: 'Société Anonyme (SA)' },
  { id: 5, libelle: 'Coopérative' }
]

export const MOCK_PIECES_IDENTITE = [
  { id: 1, libelle: "Carte Nationale d'Identité (CNI)" },
  { id: 2, libelle: 'Passeport' },
  { id: 3, libelle: "Attestation d'Identité" },
  { id: 4, libelle: 'Carte Consulaire' }
]

export const MOCK_SITUATION_MATRIMONIALE = [
  { id: 1, libelle: 'Célibataire' },
  { id: 2, libelle: 'Marié(e)' },
  { id: 3, libelle: 'Veuf / Veuve' },
  { id: 4, libelle: 'Divorcé(e)' }
]

export const MOCK_TYPE_EMPLOIS = [
  { id: 1, libelle: 'Temps plein' },
  { id: 2, libelle: 'Temps partiel' },
  { id: 3, libelle: 'Saisonnier' },
  { id: 4, libelle: 'Journalier' }
]

export const MOCK_INDICATEURS = [
  { id: 1, libelle: "Chiffre d'affaires mensuel", unite: 'FCFA', type_valeur: 'Numérique' },
  { id: 2, libelle: 'Nombre d\'emplois créés', unite: 'Personne', type_valeur: 'Numérique' },
  { id: 3, libelle: 'Charges opérationnelles', unite: 'FCFA', type_valeur: 'Numérique' },
  { id: 4, libelle: 'Bénéfice net', unite: 'FCFA', type_valeur: 'Numérique' },
  { id: 5, libelle: 'Niveau de satisfaction client', unite: 'Pourcentage', type_valeur: 'Numérique' }
]
