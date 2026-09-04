import * as React from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useQuestionForm} from "@/pages/Indicateurs/hooks/questions/useQuestionForm.ts";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Switch} from "@/components/ui/switch.tsx";

interface Props {
    children?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    editData?: any | null
}

export function QuestionFormModal({children, open: controlledOpen, onOpenChange, editData} : Props) {
    const {
        form,
        onSubmit,
        isPending,
        isEdit,
        open,
        setOpen,
        fiches
    } = useQuestionForm(editData, controlledOpen, onOpenChange)

    const types = ["nombre", "texte", "choix"]

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Modifier  Question' : 'Ajouter un question'}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="formulaire_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Formulaire <span className="text-red-500">*</span></FormLabel>
                                        <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value ? String(field.value) : ''}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Sélectionner un rôle" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {fiches.map(ind => (
                                                    <SelectItem key={ind.id} value={String(ind.id)}>{ind.libelle }</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ordre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ordre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ordre" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="type_question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type </FormLabel>

                                    <Select
                                        onValueChange={
                                            (v) => field.onChange(v)
                                        }
                                        value={field.value ? String(field.value) : ''}

                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full"><SelectValue placeholder="Sélectionner un type" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {types.map((t) => (
                                                <SelectItem key={t} value={String(t)}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="obligatoire"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Active </FormLabel>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isPending} className="bg-[#E7722B] hover:bg-[#C85E18] text-white">
                                {isPending ? 'Enregistrement...' : 'Enregistrer'}
                            </Button>
                        </div>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )

}