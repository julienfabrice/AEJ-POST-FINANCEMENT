import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useReleveForm} from "@/pages/Indicateurs/hooks/releves/useReleveForm.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import * as React from "react";

interface Props {
    children?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    editData?: any | null
}

export function IndicateurSuiviFormModal({children, open: controlledOpen, onOpenChange, editData} : Props){
    const {
        form,
        onSubmit,
        isPending,
        isEdit,
        indicateurs,
        open,
        setOpen
    } = useReleveForm(editData, controlledOpen, onOpenChange)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
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
                                name="indicateur_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Indicateur <span className="text-red-500">*</span></FormLabel>
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
                            <FormField
                                control={form.control}
                                name="valeur"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valeur <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Valeur" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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