import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'

export interface DOCUMENT_T {
  id: number
  name: string
  path: string
  type: string
  size: number
  url: string
  micro_projet_id: number | null
  created_at: string
  updated_at: string
  created_by?: {
    id: number
    nom: string
    prenom: string
    email: string
  }
}

/**
 * GET /documents
 * Récupère la liste des documents, filtrables par micro_projet_id.
 */
export function useGetDocuments(micro_projet_id?: number) {
  return useQuery({
    queryKey: ['documents', micro_projet_id],
    queryFn: async (): Promise<DOCUMENT_T[]> => {
      const { data } = await axiosInstance.get('/documents', {
        params: micro_projet_id ? { micro_projet_id } : undefined,
      })
      return data.data ?? data
    },
  })
}

export function useUploadDocumentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { file: File; folder: string; micro_projet_id?: string | number | null }) => {
      const formData = new FormData()
      formData.append('file', payload.file)
      formData.append('folder', payload.folder)
      
      if (payload.micro_projet_id) {
        formData.append('micro_projet_id', payload.micro_projet_id.toString())
      }

      const res = await axiosInstance.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return res.data
    },
    onSuccess: (_, vars) => {
      toast.success('Document joint et soumis avec succès.')
      if (vars.micro_projet_id) {
        queryClient.invalidateQueries({ queryKey: ['documents', Number(vars.micro_projet_id)] })
      }
      // Invalidates all documents lists globally
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['projets'] })
    },
    onError: (error) => {
      console.error("Erreur lors de l'upload", error)
      toast.error("Une erreur est survenue lors de l'envoi du document.")
    },
  })
}
