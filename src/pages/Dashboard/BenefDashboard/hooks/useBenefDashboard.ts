import { useAuthStore } from '@/store/useAuthStore'
import { projetsServices } from '@/services/projets.services'
import { useMemo } from 'react'

export function useBenefDashboard() {
  const user = useAuthStore(s => s.user)
  // Assuming the promoteur_id corresponds to user.id for a Beneficiary
  const { data, isLoading } = projetsServices.useGetAll(1, 1, { promoteur_id: String(user?.id || '') })
  
  const projet = useMemo(() => data?.data?.[0], [data])

  return { user, projet, isLoading }
}
