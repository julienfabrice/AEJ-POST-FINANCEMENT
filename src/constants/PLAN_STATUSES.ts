export const STATUT_PLAN: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  SOUMIS:        { label: 'Soumis',        variant: 'secondary' },
  EN_VALIDATION: { label: 'En validation', variant: 'outline' },
  VALIDE:        { label: 'Validé',        variant: 'default' },
  AJOURNE:       { label: 'Ajourné',       variant: 'destructive' },
}

export const STATUT_LIGNE: Record<string, { label: string; color: string }> = {
  PREVU:       { label: 'Prévu',      color: 'text-slate-500 bg-slate-100' },
  AUTORISE:    { label: 'Autorisé',   color: 'text-amber-700 bg-amber-100' },
  EXECUTE:     { label: 'Exécuté',    color: 'text-green-700 bg-green-100' },
}
