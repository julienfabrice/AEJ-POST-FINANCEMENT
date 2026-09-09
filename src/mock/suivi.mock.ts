export type SuiviInstallation = 'Non installé' | 'En cours' | 'Installé'
export type SuiviActivite = 'Bonne marche' | 'En exploitation' | 'En difficulté' | 'Sinistrée'

export interface Suivi {
  id: string
  projetId: string
  projetCode: string
  projetTitre: string
  date: string
  agent: string
  installation: SuiviInstallation | string
  etatActivite: SuiviActivite
  gps: string
  fichiers: string
  obs: string
}

export const MOCK_SUIVIS: Suivi[] = [
  {
    id: 'sv1',
    projetId: 'p6',
    projetCode: 'AGR-2024-0006',
    projetTitre: 'Restaurant Chez Christelle',
    date: '2024-10-12',
    agent: 'Koffi, CIP',
    installation: 'Installé',
    etatActivite: 'Bonne marche',
    gps: '5.3097, -4.0126',
    fichiers: 'rapport_visite_sv1.pdf',
    obs: 'Activité en croissance, clientèle fidèle.',
  },
  {
    id: 'sv3',
    projetId: 'p7',
    projetCode: 'AGR-2024-0007',
    projetTitre: 'Ferme avicole',
    date: '2024-11-05',
    agent: 'Kouassi, CAR',
    installation: 'Installé',
    etatActivite: 'En difficulté',
    gps: '5.3480, -4.0219',
    fichiers: 'rapport_visite_sv3.pdf',
    obs: 'Baisse de commandes ; relance de remboursement effectuée.',
  },
  {
    id: 'sv4',
    projetId: 'p12',
    projetCode: 'MPE-2024-0021',
    projetTitre: 'Atelier de soudure moderne',
    date: '2024-12-10',
    agent: 'Bamba, CIP',
    installation: 'En cours',
    etatActivite: 'En exploitation',
    gps: '6.1234, -5.2341',
    fichiers: 'rapport_visite_sv4.pdf',
    obs: 'Les équipements sont en cours de montage.',
  },
]

export type EmbaucheType = 'Direct' | 'Indirect'
export type EmbaucheSexe = 'Homme' | 'Femme'

export interface Embauche {
  id: string
  projetId: string
  projetCode: string
  projetTitre: string
  typeEmploi: EmbaucheType
  sexe: EmbaucheSexe
  salaire: number
  dateEmbauche: string
  poste: string
}

export const MOCK_EMBAUCHES: Embauche[] = [
  {
    id: 'emb1',
    projetId: 'p6',
    projetCode: 'AGR-2024-0006',
    projetTitre: 'Restaurant Chez Christelle',
    typeEmploi: 'Direct',
    sexe: 'Femme',
    salaire: 60000,
    dateEmbauche: '2024-10-15',
    poste: 'Serveuse'
  },
  {
    id: 'emb2',
    projetId: 'p6',
    projetCode: 'AGR-2024-0006',
    projetTitre: 'Restaurant Chez Christelle',
    typeEmploi: 'Indirect',
    sexe: 'Homme',
    salaire: 25000,
    dateEmbauche: '2024-10-20',
    poste: 'Livreur'
  },
  {
    id: 'emb3',
    projetId: 'p12',
    projetCode: 'MPE-2024-0021',
    projetTitre: 'Atelier de soudure moderne',
    typeEmploi: 'Direct',
    sexe: 'Homme',
    salaire: 90000,
    dateEmbauche: '2024-11-01',
    poste: 'Apprenti soudeur'
  }
]
