// =========================================================================
// Données exactement tirées de la maquette aej-demo.html
// =========================================================================

// Agences (DB.agences)
export const MOCK_AGENCES_IMPUTATION = [
  { id: 'ag1', libelle: "Agence Régionale d'Abidjan" },
  { id: 'ag2', libelle: 'Agence Régionale de Bouaké' },
  { id: 'ag3', libelle: 'Agence Régionale de Korhogo' },
  { id: 'ag4', libelle: "Agence Régionale de San-Pédro" },
]

// Dossiers en attente d'imputation :
// projets MPE/MEPS + budget approbation APPROUVE + !impute
// D'après la maquette : seul p9 correspond
export interface DossierAImputer {
  id: string
  code: string
  titre: string
  /** prénom nom du jeune */
  jeune: string
  commune: string
  montant_credit: number
  /** rattachement 'via API' | 'par localisation' */
  rattachement: 'via API' | 'par localisation'
  /** agence pré-sélectionnée (d'après la région de la localité) */
  agence_suggestion: string
}

// Dossiers déjà imputés :
// projets MPE/MEPS + impute = true
// D'après la maquette : p10 (agence ag1, plan TRANSMIS_PF)
export interface DossierImpute {
  id: string
  code: string
  titre: string
  gere_par: 'AGENCE' | 'DIRECTION'
  agence_id?: string
  /** label du statut du plan (ex: 'en validation', 'non saisi') */
  plan_label: string
}

// ---- Données statiques ----

export const MOCK_A_IMPUTER: DossierAImputer[] = [
  {
    id: 'p9',
    code: 'MPE-2024-0009',
    titre: 'Unité de recyclage plastique',
    jeune: 'Fatoumata Coulibaly',
    commune: 'Korhogo Centre',
    montant_credit: 3_900_000,
    rattachement: 'par localisation',
    agence_suggestion: 'ag3',
  },
]

export const MOCK_IMPUTES: DossierImpute[] = [
  {
    id: 'p10',
    code: 'MEPS-2024-0010',
    titre: 'Plateforme e-santé régionale',
    gere_par: 'AGENCE',
    agence_id: 'ag1',
    plan_label: 'transmis pf',
  },
]
