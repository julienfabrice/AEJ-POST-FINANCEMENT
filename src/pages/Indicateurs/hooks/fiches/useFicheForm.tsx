import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {type FormulaireFormValues, formulaireSchema} from "@/schema/indicateurs/formulaireSchema.ts";
import {formulairesServices} from "@/services/indicateurs/formulaires.services.ts";

export function useFicheForm(
    initialData: any | null, controlledOpen?: boolean, onOpenChange?: (open: boolean) => void
){
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen

    const setOpen = (newOpen: boolean) => {
        if (!isControlled) setInternalOpen(newOpen)
        if (onOpenChange) onOpenChange(newOpen)
    }

    const { mutate: createFormulaire, isPending: isCreating } = formulairesServices.useCreate()
    const { mutate: updateFormulaire, isPending: isUpdating } = formulairesServices.useUpdate()

    const isPending = isCreating || isUpdating
    const isEdit = !!initialData

    const form = useForm<FormulaireFormValues>({
        resolver: zodResolver(formulaireSchema),
        defaultValues: {
            code: '',
            libelle: '',
            public_cible: '',
            actif: true
        }
    })



    useEffect(() => {
        if (open){
            if (initialData){
                form.reset({
                    code: initialData.code || '',
                    libelle: initialData.libelle || '',
                    public_cible: initialData.public_cible || '',
                    actif: initialData.actif|| true
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
    }, [open, form, initialData]);

    const onSubmit = (values: FormulaireFormValues) => {

        if (isEdit && initialData){
            updateFormulaire({
                id: initialData.id,
                data: values
            }, {
                onSuccess: () => {
                    setOpen(false)
                    toast.success('Formulaire modifié avec succès !')

                },
                onError: (err: any) => {
                    toast.error("Erreur lors de la modification")
                    console.error(err)
                }
            } )
        } else {
            createFormulaire(values, {
                onSuccess: () => {
                    setOpen(false)
                    toast.success('Formulaire ajouté avec succès !')
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
        setOpen
    }
}