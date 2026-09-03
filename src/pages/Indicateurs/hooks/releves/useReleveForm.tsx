import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect} from "react";
import {toast} from "sonner";
import {indicateurSuiviSchema, type IndicateurSuiviValues} from "@/schema/indicateurs/indicateurSuiviSchema.ts";
import {indicateursSuivisServices} from "@/services/indicateurs/indicateurs-suivis.services.ts";
import {indicateurServices} from "@/services/indicateurs/indicateurs.services.ts";

export function useReleveForm(
    open: boolean,
    onOpenChange: (open: boolean) => void,
    editData?: any
){
    const form = useForm<IndicateurSuiviValues>({
        resolver: zodResolver(indicateurSuiviSchema),
        defaultValues: {
            indicateur_id: 0,
            valeur: ''
        }
    })

    const { mutate: createIndicateurSuivi, isPending: isCreating } = indicateursSuivisServices.useCreate()
    const { mutate: updateIndicateurSuivi, isPending: isUpdating } = indicateursSuivisServices.useUpdate()
    const { data: indicateurs = [] } = indicateurServices.useGetAll()

    const isPending = isCreating || isUpdating

    useEffect(() => {
        if (open){
            if (editData){
                form.reset({
                    indicateur_id: editData.indicateur_id || '',
                    valeur: editData.valeur|| '',
                })
            } else {
                form.reset({
                    indicateur_id: 0,
                    valeur: ''
                })
            }
        }
    }, [open, form, editData]);

    const onSubmit = (data: IndicateurSuiviValues) => {
        const payload = {
            indicateur_id: data.indicateur_id,
            valeur: data.valeur
        }

        if (editData){
            updateIndicateurSuivi({
                id: editData.id,
                data: {
                    ...payload
                }
            }, {
                onSuccess: () => {
                    toast.success('Indicateur suivi modifié avec succès !')
                    onOpenChange(false)
                },
                onError: (err: any) => {
                    toast.error("Erreur lors de la modification")
                    console.error(err)
                }
            } )
        } else {
            createIndicateurSuivi({
                ...payload
            }, {
                onSuccess: () => {
                    toast.success('Indicateur suivi ajouté avec succès !')
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
        isEdit: !!editData,
        indicateurs
    }
}