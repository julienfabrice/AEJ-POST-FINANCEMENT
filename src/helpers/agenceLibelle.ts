import { agenceRegionaleServices } from '@/services/agences-regionales.services'

export function useAgenceLibelle() {
  const { data: agences = [] } = agenceRegionaleServices.useGetAll()

  return (id: number | string) => {
    return agences.find((a) => a.id.toString() === id.toString())?.nom ?? id.toString()
  }
}
