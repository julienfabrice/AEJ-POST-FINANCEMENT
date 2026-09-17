import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { FORMULAIRE_T, API_RESPONSE_T } from '@/types'

export const formulairesServices = {
    useGetAll: () => {
        return useQuery({
            queryKey: ['formulaires-evaluation'],
            queryFn: async () => {
                const { data } = await axiosInstance.get<API_RESPONSE_T<FORMULAIRE_T[]>>('/formulaires-evaluation')
                return data.data
            }
        })
    },

    useCreate: () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: async (payload: Omit<FORMULAIRE_T, 'id' | 'created_at' | 'updated_at' | 'questions'>) => {
                const response = await axiosInstance.post('/formulaires-evaluation', payload)
                return response.data
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['formulaires-evaluation'] })
                toast.success("Élément ajouté avec succès !")
            },
            onError: (error) => {
                toast.error("Erreur lors de l'ajout.")
                console.error(error)
            }
        })
    },

    useUpdate: () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: async ({ id, data }: { id: number; data: Omit<FORMULAIRE_T, 'id' | 'created_at' | 'updated_at'| 'questions'> }) => {
                const response = await axiosInstance.put(`/formulaires-evaluation/${id}`, data)
                return response.data
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['formulaires-evaluation'] })
                toast.success("Élément modifié avec succès !")
            },
            onError: (error) => {
                toast.error("Erreur lors de la modification.")
                console.error(error)
            }
        })
    },

    useDelete: () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: async (id: number) => {
                await axiosInstance.delete(`/formulaires-evaluation/${id}`)
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['formulaires-evaluation'] })
                toast.success("Élément supprimé avec succès !")
            },
            onError: (error) => {
                toast.error("Erreur lors de la suppression.")
                console.error(error)
            }
        })
    }
}
