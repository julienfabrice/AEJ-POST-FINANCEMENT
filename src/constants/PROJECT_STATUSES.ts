export const PROJECT_STATUSES = [
  { key: 'BROUILLON', label: 'Brouillon', color: 'bg-slate-100 text-slate-800' },
  { key: 'EN_SOUMISSION', label: 'En Soumission', color: 'bg-indigo-100 text-indigo-800' },
  { key: 'EN_COURS', label: 'En Cours', color: 'bg-blue-100 text-blue-800' },
  { key: 'EN_ANALYSE', label: 'En Analyse', color: 'bg-purple-100 text-purple-800' },
  { key: 'EN_ATTENTE', label: 'En Attente', color: 'bg-orange-100 text-orange-800' },
  { key: 'ANNULE', label: 'Annulé', color: 'bg-red-100 text-red-800' },
  { key: 'NON_APPROUVE', label: 'Non Approuvé', color: 'bg-red-200 text-red-900' },
  { key: 'APPROUVE', label: 'Approuvé', color: 'bg-teal-100 text-teal-800' },
  { key: 'EN_FORMATION', label: 'En Formation', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'EN_FINANCEMENT', label: 'En Financement', color: 'bg-amber-100 text-amber-800' },
  { key: 'EN_DECAISSEMENT', label: 'En Décaissement', color: 'bg-cyan-100 text-cyan-800' },
  { key: 'EN_SUIVI', label: 'En Suivi', color: 'bg-emerald-100 text-emerald-800' },
  { key: 'EN_REMBOURSEMENT', label: 'En Remboursement', color: 'bg-green-100 text-green-800' },
  { key: 'TERMINE', label: 'Terminé', color: 'bg-gray-200 text-gray-800' },
] as const;

export type ProjectStatusId = (typeof PROJECT_STATUSES)[number]['key'];
