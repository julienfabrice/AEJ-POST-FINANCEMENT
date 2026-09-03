import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect} from "react";
import {toast} from "sonner";
import {type FormulaireFormValues, formulaireSchema} from "@/schema/indicateurs/formulaireSchema.ts";
import {formulairesServices} from "@/services/indicateurs/formulaires.services.ts";

export function useFicheForm(
    open: boolean,
    onOpenChange: (open: boolean) => void,
    editData?: any
){
    const form = useForm<FormulaireFormValues>({
        resolver: zodResolver(formulaireSchema),
        defaultValues: {
            code: '',
            libelle: '',
            public_cible: '',
            actif: true
        }
    })

    const { mutate: createFormulaire, isPending: isCreating } = formulairesServices.useCreate()
    const { mutate: updateFormulaire, isPending: isUpdating } = formulairesServices.useUpdate()

    const isPending = isCreating || isUpdating

    useEffect(() => {
        if (open){
            if (editData){
                form.reset({
                    code: editData.code || '',
                    libelle: editData.libelle || '',
                    public_cible: editData.public_cible || '',
                    actif: editData.actif|| true
                })
            } else {
                form.reset({
                    code: '',
                    libelle: '',
                    public_cible: '',
                    actif: true
                })
            }
        }
    }, [open, form, editData]);

    const onSubmit = (data: FormulaireFormValues) => {
        const payload = {
            code: data.code,
            libelle: data.libelle,
            public_cible: data.public_cible,
            actif: data.actif
        }

        if (editData){
            updateFormulaire({
                id: editData.id,
                data: {
                    ...payload
                }
            }, {
                onSuccess: () => {
                    toast.success('Formulaire modifié avec succès !')
                    onOpenChange(false)
                },
                onError: (err: any) => {
                    toast.error("Erreur lors de la modification")
                    console.error(err)
                }
            } )
        } else {
            createFormulaire({
                ...payload
            }, {
                onSuccess: () => {
                    toast.success('Formulaire ajouté avec succès !')
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