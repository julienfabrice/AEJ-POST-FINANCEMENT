export const MOCK_DISPOSITIFS = [
  { id: 'agr', libelle: 'AGR Classique' },
  { id: 'meps', libelle: 'MEPS' },
  { id: 'mpe', libelle: 'MPE' }
]

export const MOCK_WORKFLOWS: Record<string, any> = {
  'agr': {
    code: 'AGR',
    cycles: [
      {
        n: 1,
        code: 'AGR.1',
        t: 'Soumission du micro-projet',
        subs: [
          { t: 'Création du dossier par le promoteur', acteurs: 'Promoteur', liv: 'Dossier de candidature', delai: '' },
          { t: 'Vérification administrative', acteurs: 'Conseiller', liv: 'Fiche de contrôle', delai: '3 jours' }
        ]
      },
      {
        n: 2,
        code: 'AGR.2',
        t: 'Analyse et certification',
        subs: [
          { t: 'Analyse technique et financière', acteurs: 'Analyste', liv: 'Note d\'analyse', delai: '7 jours' },
          { t: 'Avis du comité de certification', acteurs: 'Comité de crédit', liv: 'PV de validation', delai: '2 jours' }
        ]
      },
      {
        n: 3,
        code: 'AGR.3',
        t: 'Financement et décaissement',
        subs: [
          { t: 'Transmission au partenaire financier', acteurs: 'Agent AEJ', liv: 'Convention signée', delai: '1 jour' },
          { t: 'Décaissement des fonds', acteurs: 'Partenaire Financier', liv: 'Preuve de virement', delai: '5 jours' }
        ]
      }
    ]
  },
  'meps': {
    code: 'MEPS',
    cycles: [
      {
        n: 1,
        code: 'MEPS.1',
        t: 'Candidature spontanée',
        subs: [
          { t: 'Enregistrement en ligne', acteurs: 'Promoteur', liv: '', delai: '' }
        ]
      },
      {
        n: 2,
        code: 'MEPS.2',
        t: 'Formation obligatoire',
        subs: [
          { t: 'Participation aux ateliers', acteurs: 'Formateur', liv: 'Attestation', delai: '14 jours' }
        ]
      }
    ]
  },
  'mpe': {
    code: 'MPE',
    cycles: []
  }
}
