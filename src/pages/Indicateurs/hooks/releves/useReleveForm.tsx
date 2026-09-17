import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {indicateurSuiviSchema, type IndicateurSuiviValues} from "@/schema/indicateurs/indicateurSuiviSchema.ts";
import {indicateursSuivisServices} from "@/services/indicateurs/indicateurs-suivis.services.ts";
import {indicateurServices} from "@/services/indicateurs/indicateurs.services.ts";
import {promoteursServices} from "@/services/promoteurs.services.ts";

export function useReleveForm(
    editData: any|null,
    controlledOpen?: boolean,
    onOpenChange?: (open: boolean) => void
){

    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen

    const setOpen = (newOpen: boolean)=> {
        if(!isControlled) setInternalOpen(newOpen)
        if(onOpenChange) onOpenChange(newOpen)
    }

    const { mutate: createIndicateurSuivi, isPending: isCreating } = indicateursSuivisServices.useCreate()
    const { mutate: updateIndicateurSuivi, isPending: isUpdating } = indicateursSuivisServices.useUpdate()
    const { data: indicateurs = [] } = indicateurServices.useGetAll()
    const { data: promoteurs = [] } = promoteursServices.useGetAll()

    const isPending = isCreating || isUpdating
    const isEdit = !!editData

    const form = useForm<IndicateurSuiviValues>({
        resolver: zodResolver(indicateurSuiviSchema),
        defaultValues: {
            indicateur_id: 0,
            valeur: '',
            periode: ''
        }
    })


    useEffect(() => {
        if (open){
            if (editData){
                form.reset({
                    indicateur_id: editData.indicateur_id || '',
                    valeur: editData.valeur|| '',
                    promoteur_id: editData.promoteur_id || 0,
                    periode: editData.periode || ''
                })
            } else {
                form.reset({
                    indicateur_id: 0,
                    valeur: '',
                    periode: ''
                })
            }
        }
    }, [open, form, editData]);

    const onSubmit = (values: IndicateurSuiviValues) => {
        if (editData){
            updateIndicateurSuivi({
                id: editData.id,
                data: values
            }, {
                onSuccess: () => {
                    toast.success('Indicateur suivi modifié avec succès !')
                    setOpen(false)
                },
                onError: (err: any) => {
                    toast.error("Erreur lors de la modification")
                    console.error(err)
                }
            } )
        } else {
            createIndicateurSuivi(values, {
                onSuccess: () => {
                    toast.success('Indicateur suivi ajouté avec succès !')
                    setOpen(false)
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
        isEdit,
        open,
        setOpen,
        indicateurs,
        promoteurs
    }
}