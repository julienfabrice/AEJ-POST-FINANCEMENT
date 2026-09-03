import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useFicheForm} from "@/pages/Indicateurs/hooks/fiches/useFicheForm.tsx";

interface FormulaireModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    editData?: any
}

export function FormulaireFormModal({open, onOpenChange, editData}: FormulaireModalProps){
    const {
        form,
        onSubmit,
        isPending,
        isEdit
    } = useFicheForm(open, onOpenChange, editData)
    // console.log("edit data", editData)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Modifier relevé' : 'Ajouter un relevé'}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="libelle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Libelle <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Libelle" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="public_cible"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Public cible <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Public cible" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="indicateur_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Indicateur <span className="text-red-500">*</span></FormLabel>
                                        {/*<Select onValueChange={field.onChange} value={field.value}>*/}
                                        <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value ? String(field.value) : ''}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Sélectionner un rôle" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {indicateurs.map(ind => (
                                                    <SelectItem key={ind.id} value={String(ind.id)}>{ind.nom }</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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