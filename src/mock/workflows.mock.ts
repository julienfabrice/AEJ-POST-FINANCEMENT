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
          { titre: 'Création du profil promoteur', roles: ['Promoteur'], documents: ['Compte activé'], duree: '' },
          { titre: 'Saisie du formulaire de demande', roles: ['Promoteur'], documents: ['Dossier soumis'], duree: '' }
        ]
      },
      {
        numero: 2, code: 'AGR.2', titre: 'Vérification administrative',
        sousEtapes: [
          { titre: 'Contrôle des pièces d\'identité', roles: ['Conseiller'], documents: ['Fiche d\'identité validée'], duree: '2 jours' },
          { titre: 'Vérification de l\'âge et de la localité', roles: ['Conseiller'], documents: ['Attestation d\'éligibilité'], duree: '1 jour' }
        ]
      },
      {
        numero: 3, code: 'AGR.3', titre: 'Formation & Renforcement',
        sousEtapes: [
          { titre: 'Formation en entrepreneuriat de base', roles: ['Cabinet Externe'], documents: ['Attestation de formation'], duree: '5 jours' }
        ]
      },
      {
        numero: 4, code: 'AGR.4', titre: 'Montage du Plan d\'Affaires',
        sousEtapes: [
          { titre: 'Accompagnement au montage financier', roles: ['Conseiller / Mentor'], documents: ['Business Plan simplifié'], duree: '10 jours' }
        ]
      },
      {
        numero: 5, code: 'AGR.5', titre: 'Analyse Technique et Financière',
        sousEtapes: [
          { titre: 'Évaluation de la rentabilité', roles: ['Analyste Financier'], documents: ['Note d\'analyse'], duree: '5 jours' },
          { titre: 'Visite du lieu d\'activité', roles: ['Agent Terrain'], documents: ['Rapport de visite'], duree: '3 jours' }
        ]
      },
      {
        numero: 6, code: 'AGR.6', titre: 'Comité de Crédit',
        sousEtapes: [
          { titre: 'Examen par le comité régional', roles: ['Comité Régional'], documents: ['PV d\'approbation'], duree: '14 jours' }
        ]
      },
      {
        numero: 7, code: 'AGR.7', titre: 'Financement & Décaissement',
        sousEtapes: [
          { titre: 'Ouverture du compte partenaire', roles: ['Institution de Microfinance'], documents: ['RIB'], duree: '2 jours' },
          { titre: 'Mise à disposition des fonds', roles: ['Guichet Financier'], documents: ['Avis de virement'], duree: '7 jours' }
        ]
      },
      {
        numero: 8, code: 'AGR.8', titre: 'Suivi & Remboursement',
        sousEtapes: [
          { titre: 'Visite de constat de démarrage', roles: ['Agent de Suivi'], documents: ['Fiche de démarrage'], duree: '30 jours' },
          { titre: 'Collecte des remboursements', roles: ['Institution de Microfinance'], documents: ['Reçu de paiement'], duree: 'Mensuel' }
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
          { titre: 'Soumission du pitch deck', roles: ['Promoteur'], documents: ['Présentation projet'], duree: '' }
        ]
      },
      {
        numero: 2, code: 'MEPS.2', titre: 'Phase de Présélection',
        sousEtapes: [
          { titre: 'Tri des dossiers par secteur', roles: ['Comité de sélection'], documents: ['Shortlist'], duree: '10 jours' }
        ]
      },
      {
        numero: 3, code: 'MEPS.3', titre: 'Boot-camp d\'incubation',
        sousEtapes: [
          { titre: 'Ateliers de perfectionnement (Design Thinking)', roles: ['Incubateur'], documents: ['Prototype validé'], duree: '21 jours' }
        ]
      },
      {
        numero: 4, code: 'MEPS.4', titre: 'Pitch final',
        sousEtapes: [
          { titre: 'Présentation devant le jury d\'investisseurs', roles: ['Jury'], documents: ['Grille de notation'], duree: '1 jour' }
        ]
      },
      {
        numero: 5, code: 'MEPS.5', titre: 'Création d\'entreprise',
        sousEtapes: [
          { titre: 'Immatriculation au CEPICI', roles: ['Agent juridique'], documents: ['Registre de commerce (RCCM)'], duree: '3 jours' },
          { titre: 'Déclaration fiscale', roles: ['Agent juridique'], documents: ['Numéro de Compte Contribuable'], duree: '2 jours' }
        ]
      },
      {
        numero: 6, code: 'MEPS.6', titre: 'Déblocage des fonds',
        sousEtapes: [
          { titre: 'Signature de la convention de subvention/prêt', roles: ['Direction AEJ'], documents: ['Convention signée'], duree: '5 jours' },
          { titre: 'Virement de la première tranche', roles: ['Banque'], documents: ['Preuve de transfert'], duree: '3 jours' }
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
          { titre: 'Dépôt des états financiers', roles: ['Entreprise'], documents: ['États financiers'], duree: '' },
          { titre: 'Analyse de solvabilité préliminaire', roles: ['Analyste'], documents: ['Fiche d\'évaluation'], duree: '5 jours' }
        ]
      },
      {
        numero: 2, code: 'MPE.2', titre: 'Audit et due diligence',
        sousEtapes: [
          { titre: 'Visite sur site et vérification du stock', roles: ['Auditeur interne'], documents: ['Rapport d\'audit'], duree: '7 jours' }
        ]
      },
      {
        numero: 3, code: 'MPE.3', titre: 'Approbation de la facilité de crédit',
        sousEtapes: [
          { titre: 'Validation par le conseil d\'administration', roles: ['CA Fonds MPE'], documents: ['Résolution'], duree: '15 jours' }
        ]
      },
      {
        numero: 4, code: 'MPE.4', titre: 'Mise en place des garanties',
        sousEtapes: [
          { titre: 'Signature des actes de nantissement', roles: ['Notaire / Service Juridique'], documents: ['Acte notarié'], duree: '10 jours' }
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
          { titre: 'Étude d\'impact environnemental et social (EIES)', roles: ['Cabinet certifié'], documents: ['Certificat ANDE'], duree: '60 jours' },
          { titre: 'Étude de faisabilité technico-économique', roles: ['Bureau d\'études'], documents: ['Rapport validé'], duree: '45 jours' }
        ]
      },
      {
        numero: 2, code: 'STRUCT.2', titre: 'Appel à Manifestation d\'Intérêt (AMI)',
        sousEtapes: [
          { titre: 'Publication dans la presse officielle', roles: ['Service Communication'], documents: ['Avis de publication'], duree: '2 jours' },
          { titre: 'Dépouillement des offres', roles: ['Commission des marchés'], documents: ['PV d\'ouverture'], duree: '14 jours' }
        ]
      },
      {
        numero: 3, code: 'STRUCT.3', titre: 'Montage financier et PPP',
        sousEtapes: [
          { titre: 'Négociation de la convention de concession', roles: ['Ministère / BNETD'], documents: ['Convention PPP'], duree: '30 jours' },
          { titre: 'Bouclage financier', roles: ['Consortium bancaire'], documents: ['Accord de financement'], duree: '90 jours' }
        ]
      },
      {
        numero: 4, code: 'STRUCT.4', titre: 'Réalisation des infrastructures',
        sousEtapes: [
          { titre: 'Pose de la première pierre', roles: ['Autorité compétente'], documents: ['PV de lancement'], duree: '1 jour' },
          { titre: 'Contrôle qualité des travaux', roles: ['Bureau de contrôle'], documents: ['Rapport mensuel'], duree: 'Continu' }
        ]
      }
    ]
  }
}
