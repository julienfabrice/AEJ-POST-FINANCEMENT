import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect} from "react";
import {toast} from "sonner";
import {questionServices} from "@/services/indicateurs/questions.services.ts";
import {type QuestionFormValues, questionSchema} from "@/schema/indicateurs/questionSchema.ts";

export function useQuestionForm(
    open: boolean,
    onOpenChange: (open: boolean) => void,
    editData?: any
){
    const form = useForm<QuestionFormValues>({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            code: '',
            libelle: '',
            type_question: '',
            options: ["interessant"],
            ordre: 0,
            affichage: true,
            obligatoire: true
        }
    })

    const { mutate: createQuestion, isPending: isCreating } = questionServices.useCreate()
    const { mutate: updateQuestion, isPending: isUpdating } = questionServices.useUpdate()

    const isPending = isCreating || isUpdating

    useEffect(() => {
        if (open){
            if (editData){
                form.reset({
                    code: editData.code || '',
                    libelle: editData.libelle || '',
                    type_question : editData.type_question || '',
                    options: editData.options || ["interessant"],
                    ordre: editData.ordre || 0,
                    affichage: editData.affichage || true,
                    obligatoire: editData.obligatoire || true,
                })
            } else {
                form.reset({
                    code: '',
                    libelle: '',
                    type_question: '',
                    obligatoire: true
                })
            }
        }
    }, [open, form, editData]);

    const onSubmit = ( data: QuestionFormValues) => {
        const payload = {
            code: data.code,
            libelle: data.libelle,
            type_question: data.type_question,
            options: data.options,
            ordre: data.ordre,
            affichage: data.affichage,
            obligatoire: data.obligatoire,

        }

        if (editData){
            updateQuestion({
                id: editData.id,
                data: {
                    ...payload
                }
            }, {
                onSuccess: () => {
                    toast.success('Question modifiée avec succès !')
                    onOpenChange(false)
                },
                onError: (err: any) => {
                    toast.error("Erreur lors de la modification")
                    console.error(err)
                }
            } )
        } else {
            createQuestion({
                ...payload
            }, {
                onSuccess: () => {
                    toast.success('Question ajoutée avec succès !')
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