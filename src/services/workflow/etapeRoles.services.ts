import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { EtapeRoleFormValues } from '@/schema/workflow/etapeRoles.schema'
import type { WORKFLOW_ETAPE_ROLE_T } from '@/types/workflow.types'
import { toast } from 'sonner'

export const workflowRolesKeys = {
  all: ['workflow', 'etape-roles'] as const,
  byEtape: (code: string) => [...workflowRolesKeys.all, code] as const,
}

export const etapeRolesServices = {
  useGetEtapeRoles: (etapeCode?: string) => {
    return useQuery({
      queryKey: workflowRolesKeys.byEtape(etapeCode || ''),
      queryFn: async () => {
        if (!etapeCode) return []
        const { data } = await axiosInstance.get('/workflow/etape-roles')
        const result = data.data || (Array.isArray(data) ? data : [])
        return result.filter((r: WORKFLOW_ETAPE_ROLE_T) => r.etape_code === etapeCode)
      },
      enabled: !!etapeCode
    })
  },

  useCreateEtapeRole: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: EtapeRoleFormValues) => {
        const dataToSend = { ...payload, name: payload.role_code };
        const response = await axiosInstance.post('/workflow/etape-roles', dataToSend)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: workflowRolesKeys.all })
        toast.success("Rôle ajouté avec succès !")
      },
      onError: (error: any) => {
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          Object.values(errors).forEach((messages: any) => {
            if (Array.isArray(messages)) {
              messages.forEach(msg => toast.error(msg));
            }
          });
        } else {
          toast.error(error.response?.data?.message || "Erreur lors de l'ajout du rôle.")
        }
        console.error(error)
      }
    })
  },

  useUpdateEtapeRole: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, ...payload }: EtapeRoleFormValues & { id: number }) => {
        const dataToSend = { ...payload, name: payload.role_code };
        const response = await axiosInstance.put(`/workflow/etape-roles/${id}`, dataToSend)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: workflowRolesKeys.all })
        toast.success("Rôle mis à jour avec succès !")
      },
      onError: (error: any) => {
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          Object.values(errors).forEach((messages: any) => {
            if (Array.isArray(messages)) {
              messages.forEach(msg => toast.error(msg));
            }
          });
        } else {
          toast.error(error.response?.data?.message || "Erreur lors de la modification du rôle.")
        }
        console.error(error)
      }
    })
  },

  useDeleteEtapeRole: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await axiosInstance.delete(`/workflow/etape-roles/${id}`)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: workflowRolesKeys.all })
        toast.success("Rôle supprimé avec succès !")
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Erreur lors de la suppression du rôle.")
        console.error(error)
      }
    })
  }
}
