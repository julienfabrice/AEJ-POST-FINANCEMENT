import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type {API_RESPONSE_T, QUESTION_T} from '@/types'

export const questionServices = {
    useGetAll: () => {
        return useQuery({
            queryKey: ['questions'],
            queryFn: async () => {
                const { data } = await axiosInstance.get<API_RESPONSE_T<QUESTION_T[]>>('/questions-evaluation')
                return data.data
            }
        })
    },

    useCreate: () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: async (payload: Omit<QUESTION_T, 'id' | 'created_at' | 'updated_at'>) => {
                const response = await axiosInstance.post('/questions-evaluation', payload)
                return response.data
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['questions'] })
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
            mutationFn: async ({ id, data }: { id: number; data: Omit<QUESTION_T, 'id' | 'created_at' | 'updated_at'> }) => {
                const response = await axiosInstance.put(`/questions-evaluation/${id}`, data)
                return response.data
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['questions'] })
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
                await axiosInstance.delete(`/questions-evaluation/${id}`)
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['questions'] })
                toast.success("Élément supprimé avec succès !")
            },
            onError: (error) => {
                toast.error("Erreur lors de la suppression.")
                console.error(error)
            }
        })
    }
}
