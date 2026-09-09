export interface ReportRow {
  k: string; // key (label)
  n: number; // count
  m: number; // montant
}

export const CHART_COLORS = [
  '#E7722B', '#20A83A', '#2D6BD4', '#E0A106', '#8E44AD', 
  '#0E7490', '#D6453B', '#BE185D', '#0A9A54', '#6B7280'
];

export const MOCK_REPORTS: Record<string, { label: string; dim: string; rows: ReportRow[] }> = {
  par_region: {
    label: "Financement engagé par région",
    dim: "Région",
    rows: [
      { k: "Abidjan", n: 1250, m: 2500000000 },
      { k: "Bouaké", n: 420, m: 840000000 },
      { k: "Yamoussoukro", n: 310, m: 620000000 },
      { k: "Korhogo", n: 215, m: 430000000 },
      { k: "San-Pédro", n: 190, m: 380000000 },
      { k: "Daloa", n: 160, m: 320000000 },
    ].sort((a, b) => b.m - a.m)
  },
  par_statut: {
    label: "Micro-projets par étape du parcours",
    dim: "Étape",
    rows: [
      { k: "En exploitation", n: 850, m: 1700000000 },
      { k: "Montage plan d'affaires", n: 620, m: 1240000000 },
      { k: "Validation comité", n: 430, m: 860000000 },
      { k: "Recherche financement", n: 310, m: 620000000 },
      { k: "Installation", n: 210, m: 420000000 },
      { k: "Sinistré", n: 45, m: 90000000 },
    ].sort((a, b) => b.m - a.m)
  },
  par_secteur: {
    label: "Projets & montants par secteur",
    dim: "Secteur",
    rows: [
      { k: "Agriculture & Élevage", n: 950, m: 1900000000 },
      { k: "Commerce & Distribution", n: 720, m: 1440000000 },
      { k: "Artisanat", n: 410, m: 820000000 },
      { k: "Services", n: 280, m: 560000000 },
      { k: "Nouvelles technologies", n: 130, m: 260000000 },
    ].sort((a, b) => b.m - a.m)
  },
  par_dispositif: {
    label: "Répartition par guichet",
    dim: "Guichet",
    rows: [
      { k: "AGR", n: 1540, m: 1540000000 },
      { k: "MPE", n: 820, m: 3280000000 },
      { k: "MPE-Jeune Fille", n: 185, m: 270000000 },
    ].sort((a, b) => b.m - a.m)
  }
}

export const MOCK_TRENDS = [
  { k: '2025-01', v: 42, lbl: 'jan' },
  { k: '2025-02', v: 65, lbl: 'fév' },
  { k: '2025-03', v: 88, lbl: 'mar' },
  { k: '2025-04', v: 120, lbl: 'avr' },
  { k: '2025-05', v: 145, lbl: 'mai' },
  { k: '2025-06', v: 210, lbl: 'jun' },
  { k: '2025-07', v: 180, lbl: 'jui' },
  { k: '2025-08', v: 135, lbl: 'aoû' },
  { k: '2025-09', v: 95, lbl: 'sep' },
  { k: '2025-10', v: 60, lbl: 'oct' },
]
