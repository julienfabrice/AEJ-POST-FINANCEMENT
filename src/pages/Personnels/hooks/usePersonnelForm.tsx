import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { personnelsServices } from '@/services/personnels.services'
import { fonctionServices } from '@/services/fonctions.services'
import { rolesServices } from '@/services/roles.services'
import { personnelSchema, type PersonnelFormValues } from '@/schema/personnels/personnel.schema'

export function usePersonnelForm(open: boolean, onOpenChange: (open: boolean) => void, editData?: any) {
  const form = useForm<PersonnelFormValues>({
    resolver: zodResolver(personnelSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      mot_de_passe: '',
      role_id: '',
      fonction_id: '',
    },
  })

  const { data: roles = [] } = rolesServices.useGetAll()
  const { data: fonctions = [] } = fonctionServices.useGetAll()

  const { mutate: createPersonnel, isPending: isCreating } = personnelsServices.useCreate()
  const { mutate: updatePersonnel, isPending: isUpdating } = personnelsServices.useUpdate()
  
  const isPending = isCreating || isUpdating

  useEffect(() => {
    if (open) {
      if (editData) {
        form.reset({
          nom: editData.nom || '',
          prenom: editData.prenom || '',
          email: editData.email || '',
          telephone: editData.telephone || '',
          adresse: editData.adresse || '',
          mot_de_passe: '', 
          role_id: editData.role_id ? String(editData.role_id) : (editData.role?.id ? String(editData.role.id) : ''),
          fonction_id: editData.fonction_id ? String(editData.fonction_id) : (editData.fonction?.id ? String(editData.fonction.id) : ''),
        })
      } else {
        form.reset({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          adresse: '',
          mot_de_passe: '',
          role_id: '',
          fonction_id: '',
        })
      }
    }
  }, [open, form, editData])

  const onSubmit = (data: PersonnelFormValues) => {
    const payload = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      telephone: data.telephone ?? null,
      adresse: data.adresse ?? null,
      role_id: Number(data.role_id),
      fonction_id: Number(data.fonction_id),
    }

    if (editData) {
      updatePersonnel({
        id: editData.id,
        payload: {
          ...payload,
          mot_de_passe: data.mot_de_passe ? data.mot_de_passe : undefined
        }
      }, {
        onSuccess: () => {
          toast.success('Personnel modifié avec succès !')
          onOpenChange(false)
        },
        onError: (err: any) => {
          toast.error("Erreur lors de la modification")
          console.error(err)
        }
      })
    } else {
      createPersonnel({
        ...payload,
        mot_de_passe: data.mot_de_passe ?? '',
        profile_picture: undefined,
        organisme_id: null,
        agence_regionale_id: null,
      }, {
        onSuccess: () => {
          toast.success('Personnel ajouté avec succès !')
          onOpenChange(false)
        },
        onError: (err: any) => {
          toast.error("Erreur lors de l'ajout")
          console.error(err)
        }
      })
    }
  }

  return {
    form,
    onSubmit,
    roles,
    fonctions,
    isPending,
    isEdit: !!editData,
  }
}
