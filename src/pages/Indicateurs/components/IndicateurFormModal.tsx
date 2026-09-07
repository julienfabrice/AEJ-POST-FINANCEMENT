import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {useIndicateurForm} from "@/pages/Indicateurs/hooks/indicateurs/useIndicateurForm.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import * as React from "react";
import {Switch} from "@/components/ui/switch.tsx";

interface Props {
    children?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    editData?: any | null
}

export function IndicateurFormModal({children, open: controlledOpen, onOpenChange, editData} : Props){
    const {
        form,
        onSubmit,
        isPending,
        isEdit,
        open,
        setOpen,
        microProjets
    } = useIndicateurForm(editData, controlledOpen, onOpenChange)

    const types = ["numérique", "texte", "pourcentage", "booleen"];

    return (

        <Dialog open={open} onOpenChange={setOpen}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
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
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code<span className="text-red-500">*</span></FormLabel>
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
                                        <FormLabel>Nom de l'indicateur <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nom" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="micro_projet_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Micro-projets <span className="text-red-500">*</span></FormLabel>
                                        <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value ? String(field.value) : ''}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Sélectionner un indicateur" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {microProjets.map(ind => (
                                                    <SelectItem key={ind.id} value={String(ind.id)}>{ind.intitule }</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                        <FormLabel>Type valeur </FormLabel>

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
                                        <FormLabel>Unite </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex. %, FCFA" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="valeur_cible"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valeur cible</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex. %, FCFA" {...field} />
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
                                        <FormLabel>Statut </FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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