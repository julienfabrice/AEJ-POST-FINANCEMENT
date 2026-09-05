import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {questionServices} from "@/services/indicateurs/questions.services.ts";
import {type QuestionFormValues, questionSchema} from "@/schema/indicateurs/questionSchema.ts";
import {formulairesServices} from "@/services/indicateurs/formulaires.services.ts";

export function useQuestionForm(
    initialData: any | null, controlledOpen?: boolean, onOpenChange?: (open: boolean) => void
){
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen

    const setOpen = (newOpen: boolean) => {
        if (!isControlled) setInternalOpen(newOpen)
        if (onOpenChange) onOpenChange(newOpen)
    }

    const { mutate: createQuestion, isPending: isCreating } = questionServices.useCreate()
    const { mutate: updateQuestion, isPending: isUpdating } = questionServices.useUpdate()
    const { data: fiches = [] } = formulairesServices.useGetAll()

    const isPending = isCreating || isUpdating
    const isEdit = !!initialData

    const form = useForm<QuestionFormValues>({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            formulaire_id:0,
            code: '',
            libelle: '',
            type_question: '',
            ordre: 0,
            affichage: true,
            obligatoire: true
        }
    })



    useEffect(() => {
        if (open){
            if (initialData){
                form.reset({
                    formulaire_id: initialData.formulaire_id || 0,
                    code: initialData.code || '',
                    libelle: initialData.libelle || '',
                    type_question : initialData.type_question || '',
                    ordre: initialData.ordre || 0,
                    affichage: initialData.affichage || true,
                    obligatoire: initialData.obligatoire || true,
                })
            } else {
                form.reset({
                    code: '',
                    libelle: '',
                    type_question: '',
                    ordre: 0,
                    affichage: true,
                    obligatoire: true
                })
            }
        }
    }, [open, form, initialData]);

    const onSubmit = ( values: QuestionFormValues) => {

        if (initialData){
            updateQuestion({
                id: initialData.id,
                data: values
            }, {
                onSuccess: () => {
                    setOpen(false)
                    toast.success('Question modifiée avec succès !')
                },
                onError: (err: any) => {
                    toast.error("Erreur lors de la modification")
                    console.error(err)
                }
            } )
        } else {

            createQuestion(values, {
                onSuccess: () => {
                    setOpen(false)
                    toast.success('Question ajoutée avec succès !')
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
        fiches
    }
}