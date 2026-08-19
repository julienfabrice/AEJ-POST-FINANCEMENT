export const MOCK_DISPOSITIFS = [
  { id: 'agr', libelle: 'AGR Classique' },
  { id: 'meps', libelle: 'MEPS' },
  { id: 'mpe', libelle: 'MPE' },
  { id: 'structurants', libelle: 'Projets structurants / Start-Up' }
]

export const MOCK_WORKFLOWS: Record<string, any> = {
  'agr': {
    code: 'AGR',
    etapes: [
      {
        numero: 1, code: 'AGR.1', titre: 'Enrôlement & Soumission',
        sousEtapes: [
          { titre: 'Création du profil promoteur', acteurs: 'Promoteur', livrable: 'Compte activé', delai: '' },
          { titre: 'Saisie du formulaire de demande', acteurs: 'Promoteur', livrable: 'Dossier soumis', delai: '' }
        ]
      },
      {
        numero: 2, code: 'AGR.2', titre: 'Vérification administrative',
        sousEtapes: [
          { titre: 'Contrôle des pièces d\'identité', acteurs: 'Conseiller', livrable: 'Fiche d\'identité validée', delai: '2 jours' },
          { titre: 'Vérification de l\'âge et de la localité', acteurs: 'Conseiller', livrable: 'Attestation d\'éligibilité', delai: '1 jour' }
        ]
      },
      {
        numero: 3, code: 'AGR.3', titre: 'Formation & Renforcement',
        sousEtapes: [
          { titre: 'Formation en entrepreneuriat de base', acteurs: 'Cabinet Externe', livrable: 'Attestation de formation', delai: '5 jours' }
        ]
      },
      {
        numero: 4, code: 'AGR.4', titre: 'Montage du Plan d\'Affaires',
        sousEtapes: [
          { titre: 'Accompagnement au montage financier', acteurs: 'Conseiller / Mentor', livrable: 'Business Plan simplifié', delai: '10 jours' }
        ]
      },
      {
        numero: 5, code: 'AGR.5', titre: 'Analyse Technique et Financière',
        sousEtapes: [
          { titre: 'Évaluation de la rentabilité', acteurs: 'Analyste Financier', livrable: 'Note d\'analyse', delai: '5 jours' },
          { titre: 'Visite du lieu d\'activité', acteurs: 'Agent Terrain', livrable: 'Rapport de visite', delai: '3 jours' }
        ]
      },
      {
        numero: 6, code: 'AGR.6', titre: 'Comité de Crédit',
        sousEtapes: [
          { titre: 'Examen par le comité régional', acteurs: 'Comité Régional', livrable: 'PV d\'approbation', delai: '14 jours' }
        ]
      },
      {
        numero: 7, code: 'AGR.7', titre: 'Financement & Décaissement',
        sousEtapes: [
          { titre: 'Ouverture du compte partenaire', acteurs: 'Institution de Microfinance', livrable: 'RIB', delai: '2 jours' },
          { titre: 'Mise à disposition des fonds', acteurs: 'Guichet Financier', livrable: 'Avis de virement', delai: '7 jours' }
        ]
      },
      {
        numero: 8, code: 'AGR.8', titre: 'Suivi & Remboursement',
        sousEtapes: [
          { titre: 'Visite de constat de démarrage', acteurs: 'Agent de Suivi', livrable: 'Fiche de démarrage', delai: '30 jours' },
          { titre: 'Collecte des remboursements', acteurs: 'Institution de Microfinance', livrable: 'Reçu de paiement', delai: 'Mensuel' }
        ]
      }
    ]
  },
  'meps': {
    code: 'MEPS',
    etapes: [
      {
        numero: 1, code: 'MEPS.1', titre: 'Appel à projets & Candidature',
        sousEtapes: [
          { titre: 'Soumission du pitch deck', acteurs: 'Promoteur', livrable: 'Présentation projet', delai: '' }
        ]
      },
      {
        numero: 2, code: 'MEPS.2', titre: 'Phase de Présélection',
        sousEtapes: [
          { titre: 'Tri des dossiers par secteur', acteurs: 'Comité de sélection', livrable: 'Shortlist', delai: '10 jours' }
        ]
      },
      {
        numero: 3, code: 'MEPS.3', titre: 'Boot-camp d\'incubation',
        sousEtapes: [
          { titre: 'Ateliers de perfectionnement (Design Thinking)', acteurs: 'Incubateur', livrable: 'Prototype validé', delai: '21 jours' }
        ]
      },
      {
        numero: 4, code: 'MEPS.4', titre: 'Pitch final',
        sousEtapes: [
          { titre: 'Présentation devant le jury d\'investisseurs', acteurs: 'Jury', livrable: 'Grille de notation', delai: '1 jour' }
        ]
      },
      {
        numero: 5, code: 'MEPS.5', titre: 'Création d\'entreprise',
        sousEtapes: [
          { titre: 'Immatriculation au CEPICI', acteurs: 'Agent juridique', livrable: 'Registre de commerce (RCCM)', delai: '3 jours' },
          { titre: 'Déclaration fiscale', acteurs: 'Agent juridique', livrable: 'Numéro de Compte Contribuable', delai: '2 jours' }
        ]
      },
      {
        numero: 6, code: 'MEPS.6', titre: 'Déblocage des fonds',
        sousEtapes: [
          { titre: 'Signature de la convention de subvention/prêt', acteurs: 'Direction AEJ', livrable: 'Convention signée', delai: '5 jours' },
          { titre: 'Virement de la première tranche', acteurs: 'Banque', livrable: 'Preuve de transfert', delai: '3 jours' }
        ]
      }
    ]
  },
  'mpe': {
    code: 'MPE',
    etapes: [
      {
        numero: 1, code: 'MPE.1', titre: 'Réception de la demande',
        sousEtapes: [
          { titre: 'Dépôt des états financiers', acteurs: 'Entreprise', livrable: 'États financiers', delai: '' },
          { titre: 'Analyse de solvabilité préliminaire', acteurs: 'Analyste', livrable: 'Fiche d\'évaluation', delai: '5 jours' }
        ]
      },
      {
        numero: 2, code: 'MPE.2', titre: 'Audit et due diligence',
        sousEtapes: [
          { titre: 'Visite sur site et vérification du stock', acteurs: 'Auditeur interne', livrable: 'Rapport d\'audit', delai: '7 jours' }
        ]
      },
      {
        numero: 3, code: 'MPE.3', titre: 'Approbation de la facilité de crédit',
        sousEtapes: [
          { titre: 'Validation par le conseil d\'administration', acteurs: 'CA Fonds MPE', livrable: 'Résolution', delai: '15 jours' }
        ]
      },
      {
        numero: 4, code: 'MPE.4', titre: 'Mise en place des garanties',
        sousEtapes: [
          { titre: 'Signature des actes de nantissement', acteurs: 'Notaire / Service Juridique', livrable: 'Acte notarié', delai: '10 jours' }
        ]
      }
    ]
  },
  'structurants': {
    code: 'STRUCT',
    etapes: [
      {
        numero: 1, code: 'STRUCT.1', titre: 'Études préliminaires',
        sousEtapes: [
          { titre: 'Étude d\'impact environnemental et social (EIES)', acteurs: 'Cabinet certifié', livrable: 'Certificat ANDE', delai: '60 jours' },
          { titre: 'Étude de faisabilité technico-économique', acteurs: 'Bureau d\'études', livrable: 'Rapport validé', delai: '45 jours' }
        ]
      },
      {
        numero: 2, code: 'STRUCT.2', titre: 'Appel à Manifestation d\'Intérêt (AMI)',
        sousEtapes: [
          { titre: 'Publication dans la presse officielle', acteurs: 'Service Communication', livrable: 'Avis de publication', delai: '2 jours' },
          { titre: 'Dépouillement des offres', acteurs: 'Commission des marchés', livrable: 'PV d\'ouverture', delai: '14 jours' }
        ]
      },
      {
        numero: 3, code: 'STRUCT.3', titre: 'Montage financier et PPP',
        sousEtapes: [
          { titre: 'Négociation de la convention de concession', acteurs: 'Ministère / BNETD', livrable: 'Convention PPP', delai: '30 jours' },
          { titre: 'Bouclage financier', acteurs: 'Consortium bancaire', livrable: 'Accord de financement', delai: '90 jours' }
        ]
      },
      {
        numero: 4, code: 'STRUCT.4', titre: 'Réalisation des infrastructures',
        sousEtapes: [
          { titre: 'Pose de la première pierre', acteurs: 'Autorité compétente', livrable: 'PV de lancement', delai: '1 jour' },
          { titre: 'Contrôle qualité des travaux', acteurs: 'Bureau de contrôle', livrable: 'Rapport mensuel', delai: 'Continu' }
        ]
      }
    ]
  }
}
