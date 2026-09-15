import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useFicheForm} from "@/pages/Indicateurs/hooks/fiches/useFicheForm.tsx";
import * as React from "react";
import {Switch} from "@/components/ui/switch.tsx";

interface Props {
    children?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    editData?: any | null
}

export function FormulaireFormModal({children, open: controlledOpen, onOpenChange, editData} : Props){
    const {
        form,
        onSubmit,
        isPending,
        isEdit,
        open,
        setOpen
    } = useFicheForm(editData, controlledOpen, onOpenChange)
    const cibles = [ 'Bénéficiare', 'Partenaire', 'Agent']

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Modifier formulaire' : 'Ajouter un formulaire'}
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
                                name="libelle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Libellé de la fiche <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Libellé" {...field} />
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
                                        <FormLabel>Public cible </FormLabel>

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
                                                {cibles.map((t) => (
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
                                name="actif"
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