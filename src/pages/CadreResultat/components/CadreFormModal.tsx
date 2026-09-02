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
import { Textarea } from '@/components/ui/textarea'
import { usePartenairesOptions } from '@/services/referentielsCadreResultat.services'
import type { CADRE_RESULTAT_T } from '@/types'
import { useCadreForm } from '../hooks/cadres/useCadreForm'
import { useCadresOptions, useNiveauxOptions } from '../hooks/useReferentielsInternes'
import { ReferentielSelect } from './ReferentielSelect'

/**
 * Modale « Élément du cadre de résultat » — table `cadres_resultat`.
 *
 * C'est la plus délicate des cinq, pour une seule raison : l'élément est
 * HIÉRARCHIQUE par auto-référence (`parent_cs`), et rien dans le SQL n'empêche
 * de fabriquer un cycle (A parent de B, B parent de A). Un cycle ne produit pas
 * une erreur : il fait DISPARAÎTRE un sous-arbre entier de l'affichage, ou fige
 * l'onglet si la construction de l'arbre n'est pas défensive.
 *
 * ── Comment le cycle est rendu impossible ICI ──
 * La liste des parents proposés vient de `useCadresOptions(idElement)`, à qui
 * l'on passe l'identifiant de l'élément en cours d'édition. Ce hook applique
 * `parentsPossibles()` (`src/schema/cadre-resultat/cadreSchema.ts`), qui écarte
 * l'élément lui-même ET tous ses descendants (via `collecterDescendants`). La
 * règle n'est donc écrite NULLE PART dans cette modale : elle vit dans le
 * schéma, à côté du `.superRefine` qui lui sert de filet, et la modale se
 * contente de lui fournir l'identifiant sans lequel elle serait inapplicable.
 * En CRÉATION, `null` : l'élément n'existe pas encore, tout est choisissable.
 *
 * ── Ce qui n'a délibérément PAS de champ ──
 *  • `id_cs` — présent dans les valeurs du formulaire uniquement pour que le
 *    `.superRefine` du schéma sache quel élément est modifié. Il est posé par
 *    `useCadreForm` à l'ouverture et retiré de la charge utile par son
 *    `versPayload` : aucun `<input type="hidden">` n'est nécessaire, la valeur
 *    vit dans l'état de react-hook-form, pas dans le DOM.
 *  • `date_enregistrement` — DATE NOT NULL DEFAULT CURRENT_DATE, posée par le
 *    serveur. Exposer un champ obligerait à ressaisir une date que la base
 *    connaît déjà ; en édition, la valeur reçue est simplement réémise telle
 *    quelle par le hook, donc jamais écrasée.
 */
interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: CADRE_RESULTAT_T | null
}

export function CadreFormModal({
  children,
  open: controlledOpen,
  onOpenChange,
  initialData,
}: Props) {
  const { form, onSubmit, isPending, isEdit, open, setOpen } = useCadreForm(
    initialData ?? null,
    controlledOpen,
    onOpenChange,
  )

  const niveaux = useNiveauxOptions()
  // ⚠️ L'ARGUMENT EST LE CŒUR DE LA PROTECTION ANTI-CYCLE (cf. en-tête) :
  // sans lui, l'élément courant et ses descendants resteraient proposés comme
  // parents et le cycle serait à un clic.
  const cadres = useCadresOptions(initialData?.id_cs ?? null)
  const partenaires = usePartenairesOptions()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      {/* Cf. `NiveauFormModal` : tous les sélecteurs sont des Radix `<Select>`,
          dont le contenu porté reste cliquable dans une Dialog modale sans
          qu'aucune cible de portail ne doive lui être fournie. */}
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier l'élément" : 'Nouvel élément'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-1"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="abgrege_cs"
                render={({ field }) => (
                  <FormItem>
                    {/* Libellé RÉTABLI en français correct : la colonne
                        s'appelle `abgrege_cs` (coquille du schéma, conservée
                        côté code parce que c'est la clé que l'API produira),
                        mais l'écran n'a aucune raison de la propager. */}
                    <FormLabel>Abrégé</FormLabel>
                    <FormControl>
                      <Input maxLength={20} placeholder="OS1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code_cs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input maxLength={20} placeholder="S01" {...field} />
                    </FormControl>
                    <FormDescription>Unique sur l'ensemble du cadre.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pleine largeur : la colonne est un TEXT sans longueur maximale,
                un champ d'une demi-ligne inviterait à écrire trop court. */}
            <FormField
              control={form.control}
              name="intutile_cs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intitulé</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Intitulé complet de l'élément du cadre…"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="niveau_cs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau</FormLabel>
                    {/* `autoriserAucun={false}` : FK NOT NULL. Proposer de vider
                        le champ produirait un refus serveur systématique. */}
                    <FormControl>
                      <ReferentielSelect
                        referentiel={niveaux}
                        value={field.value}
                        onChange={(valeur) => field.onChange(valeur ?? 0)}
                        placeholder="Sélectionner un niveau"
                        autoriserAucun={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parent_cs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Élément parent</FormLabel>
                    <FormControl>
                      <ReferentielSelect
                        referentiel={cadres}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Sélectionner un parent"
                        // `null` n'est pas une absence de saisie mais une valeur
                        // métier : l'élément est une RACINE du cadre.
                        libelleAucun="Aucun (élément racine)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="partenaire_cs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partenaire</FormLabel>
                    <FormControl>
                      <ReferentielSelect
                        referentiel={partenaires}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Sélectionner un partenaire"
                        libelleAucun="Aucun partenaire"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="etat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>État</FormLabel>
                    <FormControl>
                      {/* SAISIE LIBRE et non `<Select>` : le schéma ne documente
                          AUCUNE valeur pour cette colonne. Une liste « Actif /
                          Clôturé / … » fabriquerait un référentiel inexistant.
                          `?? ''` : le champ est optionnel côté zod, et un
                          `<input>` piloté par `undefined` bascule en non
                          contrôlé. */}
                      <Input
                        maxLength={30}
                        placeholder="En cours"
                        {...field}
                        value={field.value ?? ''}
                      />
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
