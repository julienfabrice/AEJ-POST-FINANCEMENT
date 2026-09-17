import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { LOT_IMPORTATION_T, API_RESPONSE_T } from '@/types'

export const lotsImportationServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['lots-importation'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<LOT_IMPORTATION_T[]>>('/lots-importation')
        return data.data
      },
    })
  },
  /**
   * Pas de toast ici volontairement : cette création est déclenchée en boucle
   * (une par ligne du fichier Excel importé) par useComposerLot, qui gère
   * lui-même le feedback global de l'import plutôt qu'un toast par ligne.
   */
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<LOT_IMPORTATION_T, 'id'>) => {
        const response = await axiosInstance.post<API_RESPONSE_T<LOT_IMPORTATION_T>>('/lots-importation', payload)
        return response.data.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lots-importation'] })
      },
    })
  },
}