import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { entrepriseServices } from '@/services/entreprises.services'
import { typeEmploiServices } from '@/services/typeEmplois.services'
import type { EMBAUCHE_T } from '@/types'
import { useEmbaucheForm } from '../hooks/embauches/useEmbaucheForm'
import { MicroProjetCombobox } from './MicroProjetCombobox'
import { PromoteurCombobox } from './PromoteurCombobox'

/**
 * Sentinelle « aucune valeur » : Radix réserve la chaîne vide à l'état
 * « rien de sélectionné » et refuse un `SelectItem` de valeur vide. Entreprise
 * et type d'emploi étant NULLABLES côté API, il faut pouvoir les vider.
 */
const AUCUN = '__aucun__'

/**
 * Valeur à donner à un `<Select>` nullable.
 *
 * Retomber sur `''` quand la valeur est `null` réafficherait le placeholder
 * alors que `null` est précisément ce que produit le choix « Aucune
 * entreprise » / « Aucun type » : impossible de distinguer « pas encore
 * choisi » de « choisi : aucun ». On pilote donc le Select avec la sentinelle.
 *
 * Le placeholder n'est conservé que pour le CHARGEMENT du référentiel, où
 * aucune valeur n'est encore résoluble en libellé.
 */
const valeurSelectNullable = (valeur: number | null, chargement: boolean): string => {
  if (chargement) return ''
  return valeur ? String(valeur) : AUCUN
}

interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: EMBAUCHE_T | null
}

export function EmbaucheFormModal({ children, open: controlledOpen, onOpenChange, initialData }: Props) {
  const { form, onSubmit, isPending, isEdit, open, setOpen } = useEmbaucheForm(
    initialData ?? null,
    controlledOpen,
    onOpenChange,
  )

  // Cf. ExploitationFormModal : les menus Base UI doivent être portés DANS la
  // Dialog Radix pour rester cliquables.
  const [portal, setPortal] = useState<HTMLElement | null>(null)

  // Deux petits référentiels : chargement complet acceptable (contrairement
  // aux micro-projets et aux bénéficiaires, cherchés côté serveur).
  const { data: entreprises = [], isLoading: entreprisesLoading } = entrepriseServices.useGetAll()
  const { data: typesEmploi = [], isLoading: typesEmploiLoading } = typeEmploiServices.useGetAll()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent ref={setPortal} className="sm:max-w-[600px]">
        <DialogHeader>
          {/* Gabarit de la maquette : « ${isEdit ? 'Modifier' : 'Nouveau'}
              ${R.sing} » (l.6729), avec `sing` = « emploi » (l.6504). Il
              produit littéralement « Nouveau emploi » / « Modifier emploi » :
              on rétablit l'accord (« Nouvel ») et l'élision (« l'emploi »),
              sans substituer le `label` de la ressource (« Emplois créés ») à
              son `sing`. */}
          <DialogTitle>{isEdit ? "Modifier l'emploi" : 'Nouvel emploi'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid max-h-[70vh] gap-4 overflow-y-auto py-4 pr-1"
          >
            {/* Ligne 1 — pleine largeur. */}
            <FormField
              control={form.control}
              name="micro_projet_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Micro-projet</FormLabel>
                  <FormControl>
                    <MicroProjetCombobox
                      value={field.value}
                      onChange={field.onChange}
                      projetInitial={initialData?.micro_projet ?? null}
                      container={portal}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* ARBITRAGE : la maquette présentait le bénéficiaire comme
                  facultatif ; l'API REFUSE une embauche sans `promoteur_id`.
                  L'API l'emporte, le champ est requis. */}
              <FormField
                control={form.control}
                name="promoteur_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bénéficiaire</FormLabel>
                    <FormControl>
                      <PromoteurCombobox
                        value={field.value}
                        onChange={field.onChange}
                        promoteurInitial={initialData?.promoteur ?? null}
                        container={portal}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="entreprise_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entreprise</FormLabel>
                    <Select
                      disabled={entreprisesLoading}
                      value={valeurSelectNullable(field.value, entreprisesLoading)}
                      onValueChange={(valeur) =>
                        field.onChange(valeur === AUCUN ? null : Number(valeur))
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              entreprisesLoading ? 'Chargement…' : 'Sélectionner une entreprise'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={AUCUN}>Aucune entreprise</SelectItem>
                        {entreprises.map((entreprise) => (
                          <SelectItem key={entreprise.id} value={String(entreprise.id)}>
                            {entreprise.raison_sociale}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type_emploi_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'emploi</FormLabel>
                    <Select
                      disabled={typesEmploiLoading}
                      value={valeurSelectNullable(field.value, typesEmploiLoading)}
                      onValueChange={(valeur) =>
                        field.onChange(valeur === AUCUN ? null : Number(valeur))
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={typesEmploiLoading ? 'Chargement…' : 'Sélectionner un type'}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={AUCUN}>Aucun type</SelectItem>
                        {typesEmploi.map((type) => (
                          <SelectItem key={type.id} value={String(type.id)}>
                            {type.libelle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Requis par l'API (« The poste field is required. »). */}
              <FormField
                control={form.control}
                name="poste"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poste occupé</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex. Gestionnaire de projet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-[#E7722B] text-white hover:bg-[#d6621a]"
                disabled={isPending}
              >
                {isPending ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
