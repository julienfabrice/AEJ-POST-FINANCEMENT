import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { EtapeFormValues } from '@/schema/workflow'

export const etapesServices = {
  useCreateEtape: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: EtapeFormValues & { workflow_version: string }) => {
        const response = await axiosInstance.post('/workflow/etapes', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['workflow', 'versions'] })
        toast.success("Étape ajoutée avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de l'ajout de l'étape.")
        console.error(error)
      }
    })
  },

  useUpdateEtape: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, ...payload }: EtapeFormValues & { id: number }) => {
        const response = await axiosInstance.put(`/workflow/etapes/${id}`, payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['workflow', 'versions'] })
        toast.success("Étape mise à jour avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de la modification de l'étape.")
        console.error(error)
      }
    })
  },

  useDeleteEtape: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await axiosInstance.delete(`/workflow/etapes/${id}`)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['workflow', 'versions'] })
        toast.success("Étape supprimée avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de la suppression de l'étape.")
        console.error(error)
      }
    })
  }
}
