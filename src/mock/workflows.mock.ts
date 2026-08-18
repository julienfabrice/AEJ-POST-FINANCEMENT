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
        numero: 1,
        code: 'AGR.1',
        titre: 'Soumission du micro-projet',
        sousEtapes: [
          { titre: 'Création du dossier par le promoteur', acteurs: 'Promoteur', livrable: 'Dossier de candidature', delai: '' },
          { titre: 'Vérification administrative', acteurs: 'Conseiller', livrable: 'Fiche de contrôle', delai: '3 jours' }
        ]
      },
      {
        numero: 2,
        code: 'AGR.2',
        titre: 'Analyse et certification',
        sousEtapes: [
          { titre: 'Analyse technique et financière', acteurs: 'Analyste', livrable: 'Note d\'analyse', delai: '7 jours' },
          { titre: 'Avis du comité de certification', acteurs: 'Comité de crédit', livrable: 'PV de validation', delai: '2 jours' }
        ]
      },
      {
        numero: 3,
        code: 'AGR.3',
        titre: 'Financement et décaissement',
        sousEtapes: [
          { titre: 'Transmission au partenaire financier', acteurs: 'Agent AEJ', livrable: 'Convention signée', delai: '1 jour' },
          { titre: 'Décaissement des fonds', acteurs: 'Partenaire Financier', livrable: 'Preuve de virement', delai: '5 jours' }
        ]
      }
    ]
  },
  'meps': {
    code: 'MEPS',
    etapes: [
      {
        numero: 1,
        code: 'MEPS.1',
        titre: 'Candidature spontanée',
        sousEtapes: [
          { titre: 'Enregistrement en ligne', acteurs: 'Promoteur', livrable: '', delai: '' }
        ]
      },
      {
        numero: 2,
        code: 'MEPS.2',
        titre: 'Formation obligatoire',
        sousEtapes: [
          { titre: 'Participation aux ateliers', acteurs: 'Formateur', livrable: 'Attestation', delai: '14 jours' }
        ]
      }
    ]
  },
  'mpe': {
    code: 'MPE',
    etapes: []
  },
  'structurants': {
    code: 'STRUCT',
    etapes: [
      {
        numero: 1,
        code: 'STRUCT.1',
        titre: 'Étude de faisabilité',
        sousEtapes: [
          { titre: 'Validation de l\'étude', acteurs: 'Comité technique', livrable: 'Rapport validé', delai: '30 jours' }
        ]
      }
    ]
  }
}
