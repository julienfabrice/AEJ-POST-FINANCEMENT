import {useForm} from "react-hook-form";
import {type IndicateurFormValues, indicateurSchema} from "@/schema/indicateurs/indicateurSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {indicateurServices} from "@/services/indicateurs/indicateurs.services.ts";
import {useEffect} from "react";
import {toast} from "sonner";

export function useIndicateurForm(
    open: boolean,
    onOpenChange: (open: boolean) => void,
    editData?: any
){
    const form = useForm<IndicateurFormValues>({
        resolver: zodResolver(indicateurSchema),
        defaultValues: {
            nom: '',
            description: '',
            type_valeur: '',
            unite: '',
            statut: true
        }
    })

    const { mutate: createIndicateur, isPending: isCreating } = indicateurServices.useCreate()
    const { mutate: updateIndicateur, isPending: isUpdating } = indicateurServices.useUpdate()

    const isPending = isCreating || isUpdating

    useEffect(() => {
        if (open){
            if (editData){
                form.reset({
                    nom: editData.nom || '',
                    description: editData.description || '',
                    type_valeur: editData.type_valeur || '',
                    unite: editData.unite || '',
                    statut: editData.statut || true
                })
            } else {
                form.reset({
                    nom: '',
                    description: '',
                    type_valeur: '',
                    unite: '',
                    statut: true
                })
            }
        }
    }, [open, form, editData]);

    const onSubmit = (data: IndicateurFormValues) => {
        const payload = {
            nom: data.nom,
            description: data.description,
            type_valeur: data.type_valeur,
            unite: data.unite,
            statut: data.statut
        }

        console.log(" after ", editData)

        if (editData){
            updateIndicateur({
                id: editData.id,
                data: {
                    ...payload
                }
            }, {
                onSuccess: () => {
                    toast.success('Indicateur modifié avec succès !')
                    onOpenChange(false)
                },
                onError: (err: any) => {
                    toast.error("Erreur lors de la modification")
                    console.error(err)
                }
            } )
        } else {
            createIndicateur({
                ...payload
            }, {
                onSuccess: () => {
                    toast.success('Indicateur ajouté avec succès !')
                    onOpenChange(false)
                },
                onError: (err: any)=> {
                    toast.error("Erreur lors de l'ajout")
                    console.error(err)
                }
            })
        }
    }
    return {
        form,
        onSubmit,
        isPending,
        isEdit: !!editData
    }
}