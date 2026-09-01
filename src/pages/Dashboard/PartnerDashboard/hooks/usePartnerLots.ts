import { useAuthStore } from '@/store/useAuthStore'
import { projetsServices } from '@/services/projets.services'

export function usePartnerLots() {
  const organismeScope = useAuthStore(s => s.organismeScope())

  const { data, isLoading } = projetsServices.useGetAll(1, 5, {
    organisme_id: organismeScope || undefined
  })

  return { data: data?.data ?? [], isLoading }
}
