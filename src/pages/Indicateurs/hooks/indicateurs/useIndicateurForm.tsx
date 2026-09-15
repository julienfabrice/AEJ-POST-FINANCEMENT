import {useForm} from "react-hook-form";
import {type IndicateurFormValues, indicateurSchema} from "@/schema/indicateurs/indicateurSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {indicateurServices} from "@/services/indicateurs/indicateurs.services.ts";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {projetsServices} from "@/services/projets.services.ts";

export function useIndicateurForm(
    initialData: any | null, controlledOpen?: boolean, onOpenChange?: (open: boolean) => void
){
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen

    const setOpen = (newOpen: boolean) => {
        if (!isControlled) setInternalOpen(newOpen)
        if (onOpenChange) onOpenChange(newOpen)
    }

    const { mutate: createIndicateur, isPending: isCreating } = indicateurServices.useCreate()
    const { mutate: updateIndicateur, isPending: isUpdating } = indicateurServices.useUpdate()
    const { data: microProjets = []} = projetsServices.useFullGetAll()

    const isPending = isCreating || isUpdating
    const isEdit = !!initialData

    const form = useForm<IndicateurFormValues>({
        resolver: zodResolver(indicateurSchema),
        defaultValues: {
            libelle: '',
            description: '',
            type_valeur: '',
            unite: '',
            statut: true,
            valeur_cible: '',
            code: ''

        }
    })


    useEffect(() => {
        if (open){
            if (initialData){
                form.reset({
                    libelle: initialData.libelle || '',
                    description: initialData.description || '',
                    type_valeur: initialData.type_valeur || '',
                    unite: initialData.unite || '',
                    statut: initialData.statut || true,
                    valeur_cible: initialData.valeur_cible || '',
                    micro_projet_id: initialData.micro_projet_id ,
                    code: initialData.code || ''
                })
            } else {
                form.reset({
                    libelle: '',
                    description: '',
                    type_valeur: '',
                    unite: '',
                    statut: true,
                    valeur_cible: '',
                    code: ''
                })
            }
        }
    }, [open, initialData, form]);

    const onSubmit = (values: IndicateurFormValues) => {
        if (isEdit && initialData){
            updateIndicateur({
                id: initialData.id,
                data: values
            }, {
                onSuccess: () => {
                    setOpen(false)
                    toast.success('Indicateur modifié avec succès !')
                },
                onError: (err: any) => {
                    toast.error("Erreur lors de la modification")
                    console.error(err)
                }
            } )
        } else {
            createIndicateur(values, {
                onSuccess: () => {
                    setOpen(false)
                    toast.success('Indicateur ajouté avec succès !')
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
        microProjets
    }
}