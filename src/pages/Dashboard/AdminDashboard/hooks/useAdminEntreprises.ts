import { dashboardEntreprisesServices } from '@/services/dashboard.services'

export function useAdminEntreprises() {
  const { data: kpis, isLoading: l1 } = dashboardEntreprisesServices.useKpis()
  const { data: emploisSecteur, isLoading: l2 } = dashboardEntreprisesServices.useEmploisSecteur()
  const { data: topRecruteuses, isLoading: l3 } = dashboardEntreprisesServices.useTopRecruteuses()
  const { data: typesEmplois, isLoading: l4 } = dashboardEntreprisesServices.useTypesEmplois()

  const emploisItems = (emploisSecteur || []).map(e => ({
    label: e.secteur || 'Non défini',
    value: e.nombre_emplois,
    meta: `${e.nombre_emplois}`,
  }))

  const typesItems = (typesEmplois || []).map(t => ({
    label: t.type_emploi || 'Non défini',
    value: t.nombre,
    meta: `${t.nombre}`,
  }))

  const topRows = (topRecruteuses || []).map((r, i) => ({
    rang: i + 1,
    entreprise: r.raison_sociale || r.sigle || 'Inconnue',
    secteur: '–', // (L'API ne semble pas renvoyer le secteur directement ici)
    emplois: r.nombre_emplois,
  }))

  return {
    isLoading: l1 || l2 || l3 || l4,
    kpis,
    emploisItems,
    typesItems,
    topRows,
  }
}
