
export const MOCK_SOUS_SECTEURS = [
  { id: 1, libelle: 'Aviculture', secteur_id: 1, secteur: 'Agriculture & Élevage' },
  { id: 2, libelle: 'Pisciculture', secteur_id: 1, secteur: 'Agriculture & Élevage' },
  { id: 3, libelle: 'Cultures vivrières', secteur_id: 1, secteur: 'Agriculture & Élevage' },
  { id: 4, libelle: 'Vente au détail', secteur_id: 2, secteur: 'Commerce & Distribution' },
  { id: 5, libelle: 'Vente en gros', secteur_id: 2, secteur: 'Commerce & Distribution' },
  { id: 6, libelle: 'Menuiserie', secteur_id: 3, secteur: 'Artisanat' },
  { id: 7, libelle: 'Couture & Tailleur', secteur_id: 3, secteur: 'Artisanat' },
  { id: 8, libelle: 'Mécanique', secteur_id: 3, secteur: 'Artisanat' },
  { id: 9, libelle: 'Nettoyage & Entretien', secteur_id: 4, secteur: 'Services' },
  { id: 10, libelle: 'Sécurité privée', secteur_id: 4, secteur: 'Services' },
  { id: 11, libelle: 'Développement Web', secteur_id: 5, secteur: 'TIC & Numérique' },
  { id: 12, libelle: 'Infographie & Design', secteur_id: 5, secteur: 'TIC & Numérique' },
  { id: 13, libelle: 'Livraison express (2 roues)', secteur_id: 6, secteur: 'Transport & Logistique' },
  { id: 14, libelle: 'Transport VTC', secteur_id: 6, secteur: 'Transport & Logistique' },
  { id: 15, libelle: 'Maçonnerie', secteur_id: 7, secteur: 'BTP & Construction' },
  { id: 16, libelle: 'Peinture bâtiment', secteur_id: 7, secteur: 'BTP & Construction' },
  { id: 17, libelle: 'Restauration rapide (Maquis)', secteur_id: 8, secteur: 'Restauration & Hôtellerie' },
  { id: 18, libelle: 'Service traiteur', secteur_id: 8, secteur: 'Restauration & Hôtellerie' },
  { id: 19, libelle: 'Transformation agroalimentaire', secteur_id: 9, secteur: 'Industrie & Transformation' },
  { id: 20, libelle: 'Salon de coiffure', secteur_id: 10, secteur: 'Santé & Beauté' }
]

export const MOCK_TYPE_ENTREPRISES = [
  { id: 1, libelle: 'Entreprise Individuelle (EI)' },
  { id: 2, libelle: 'Société à Responsabilité Limitée (SARL)' },
  { id: 3, libelle: 'Société par Actions Simplifiée (SAS)' },
  { id: 4, libelle: 'Société Anonyme (SA)' },
  { id: 5, libelle: 'Société en Nom Collectif (SNC)' },
  { id: 6, libelle: 'Coopérative Agricole' },
  { id: 7, libelle: 'Groupement d\'Intérêt Économique (GIE)' },
  { id: 8, libelle: 'Association' }
]

export const MOCK_PIECES_IDENTITE = [
  { id: 1, libelle: "Carte Nationale d'Identité (CNI)" },
  { id: 2, libelle: 'Passeport' },
  { id: 3, libelle: "Attestation d'Identité" },
  { id: 4, libelle: 'Carte Consulaire' },
  { id: 5, libelle: 'Permis de conduire' },
  { id: 6, libelle: 'Extrait de naissance' }
]

export const MOCK_SITUATION_MATRIMONIALE = [
  { id: 1, libelle: 'Célibataire' },
  { id: 2, libelle: 'Marié(e)' },
  { id: 3, libelle: 'Veuf / Veuve' },
  { id: 4, libelle: 'Divorcé(e)' },
  { id: 5, libelle: 'En concubinage' }
]

export const MOCK_TYPE_EMPLOIS = [
  { id: 1, libelle: 'Temps plein (CDI)' },
  { id: 2, libelle: 'Temps partiel' },
  { id: 3, libelle: 'Contrat à Durée Déterminée (CDD)' },
  { id: 4, libelle: 'Saisonnier' },
  { id: 5, libelle: 'Journalier' },
  { id: 6, libelle: 'Apprenti / Stagiaire' }
]

export const MOCK_INDICATEURS = [
  { id: 1, libelle: "Chiffre d'affaires mensuel", unite: 'FCFA', type_valeur: 'Numérique' },
  { id: 2, libelle: 'Nombre d\'emplois créés', unite: 'Personne', type_valeur: 'Numérique' },
  { id: 3, libelle: 'Charges opérationnelles', unite: 'FCFA', type_valeur: 'Numérique' },
  { id: 4, libelle: 'Bénéfice net', unite: 'FCFA', type_valeur: 'Numérique' },
  { id: 5, libelle: 'Niveau de satisfaction client', unite: 'Pourcentage', type_valeur: 'Numérique' },
  { id: 6, libelle: 'Volume de production', unite: 'Kilogrammes', type_valeur: 'Numérique' },
  { id: 7, libelle: 'Nombre de clients réguliers', unite: 'Personne', type_valeur: 'Numérique' },
  { id: 8, libelle: 'Taux de remboursement', unite: 'Pourcentage', type_valeur: 'Numérique' }
]
