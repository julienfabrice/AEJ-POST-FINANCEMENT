import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'

export function useUploadDocumentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { file: File; folder: string; micro_projet_id: string }) => {
      const formData = new FormData()
      formData.append('file', payload.file)
      formData.append('folder', payload.folder)
      formData.append('micro_projet_id', payload.micro_projet_id)

      const res = await axiosInstance.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return res.data
    },
    onSuccess: () => {
      toast.success("Document joint et soumis avec succès.")
      queryClient.invalidateQueries({ queryKey: ['projets'] })
    },
    onError: (error) => {
      console.error("Erreur lors de l'upload", error)
      toast.error("Une erreur est survenue lors de l'envoi du document.")
    },
  })
}
