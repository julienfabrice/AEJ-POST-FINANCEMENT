import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {useIndicateurForm} from "@/pages/Indicateurs/hooks/indicateurs/useIndicateurForm.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

interface IndicateurModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    editData?: any
}

export function IndicateurFormModal({open, onOpenChange, editData} : IndicateurModalProps){
    const {
        form,
        onSubmit,
        isPending,
        isEdit
    } = useIndicateurForm(open, onOpenChange, editData)


    const types = ["numérique", "texte", "pourcentage", "booleen"];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Modifier  indicateur' : 'Ajouter un indicateur'}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="nom"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nom" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type_valeur"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type valeur <span className="text-red-500">*</span></FormLabel>

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
                                name="unite"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unite <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Unite" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="statut"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Statut <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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