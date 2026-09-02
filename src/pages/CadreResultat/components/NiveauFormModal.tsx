import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProgrammesOptions } from '@/services/referentielsCadreResultat.services'
import type { NIVEAU_CADRE_RESULTAT_T } from '@/types'
import { useNiveauForm } from '../hooks/niveaux/useNiveauForm'
import { ReferentielSelect } from './ReferentielSelect'

/**
 * Modale « Niveau du cadre de résultat » — table `niveaux_cadre_resultat`.
 *
 * C'est le référentiel de tête du module : les niveaux (« Axe », « Effet »,
 * « Produit »…) sont ce à quoi chaque élément du cadre se rattache. D'où un
 * formulaire volontairement court — cinq colonnes, pas une de plus.
 *
 * ── Deux partis pris de saisie, hérités du SQL et non de l'écran ──
 *
 *  • `type_niveau` est une SAISIE TEXTE et non un `<Select>` : le schéma donne
 *    « 1 », « 2 », « 3 » en exemples mais la colonne est un VARCHAR(10).
 *    Proposer une liste fermée inventerait un référentiel que le backend n'a
 *    jamais défini, et interdirait une valeur non numérique que la base
 *    accepte.
 *  • `programme` passe par `ReferentielSelect` : son référentiel n'est pas
 *    connu (cf. `referentielsCadreResultat.services.ts`), le sélecteur se
 *    désactive donc en DISANT pourquoi. La colonne étant nullable, cette
 *    indisponibilité ne bloque pas l'enregistrement.
 */
interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: NIVEAU_CADRE_RESULTAT_T | null
}

export function NiveauFormModal({
  children,
  open: controlledOpen,
  onOpenChange,
  initialData,
}: Props) {
  const { form, onSubmit, isPending, isEdit, open, setOpen } = useNiveauForm(
    initialData ?? null,
    controlledOpen,
    onOpenChange,
  )

  // Un seul référentiel externe ici : on prend le hook unitaire plutôt que
  // l'agrégat `useReferentielsCadreResultat`, qui déclencherait la requête
  // `/organismes` des partenaires sans qu'aucun champ ne l'utilise.
  const programmes = useProgrammesOptions()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      {/* Aucune cible de portail n'est mémorisée ici, contrairement aux modales
          du lot /suivi : tous les sélecteurs de cet écran sont des Radix
          `<Select>`, dont le contenu est porté par Radix lui-même en tenant
          compte de la Dialog modale. Le problème de pointer-events ne concerne
          que les menus PORTÉS DANS <body> par une autre bibliothèque (la
          combobox Base UI de `/suivi`). */}
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier le niveau' : 'Nouveau niveau'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-1"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code_number_nsc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code du niveau</FormLabel>
                    <FormControl>
                      {/* `maxLength` double la borne zod : il EMPÊCHE la frappe
                          au-delà de la colonne au lieu de refuser après coup. */}
                      <Input maxLength={20} placeholder="N1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="libelle_nsc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Libellé</FormLabel>
                    <FormControl>
                      <Input maxLength={100} placeholder="Axe, Effet, Produit…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre_nsc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordre du niveau</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        value={field.value}
                        // Champ vidé → `0` et non `NaN` : un input numérique
                        // piloté par `NaN` repasse en non contrôlé et React s'en
                        // plaint à chaque frappe suivante.
                        onChange={(event) =>
                          field.onChange(event.target.value === '' ? 0 : Number(event.target.value))
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormDescription>
                      Position du niveau dans la hiérarchie : 1 pour le plus haut.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type_niveau"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de niveau</FormLabel>
                    <FormControl>
                      <Input maxLength={10} placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="programme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programme</FormLabel>
                  {/* `<FormControl>` comme partout ailleurs dans le dépôt : le
                      Slot traverse `ReferentielSelect`, qui DÉCLARE `id`,
                      `aria-describedby` et `aria-invalid` et les relaie à son
                      déclencheur. Sans cela, le `htmlFor` du libellé viserait
                      un identifiant inexistant. */}
                  <FormControl>
                    <ReferentielSelect
                      referentiel={programmes}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Sélectionner un programme"
                      libelleAucun="Aucun programme"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
