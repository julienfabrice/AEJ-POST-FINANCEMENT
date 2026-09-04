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
import {
  useProgrammesOptions,
  useStructuresOptions,
} from '@/services/referentielsCadreResultat.services'
import type { INDICATEUR_CADRE_RESULTAT_T } from '@/types'
import { useIndicateurCadreForm } from '../hooks/indicateurs/useIndicateurCadreForm'
import { useCadresOptions } from '../hooks/useReferentielsInternes'
import { ReferentielSelect } from './ReferentielSelect'

/**
 * Modale « Indicateur du cadre de résultat » — table
 * `indicateurs_cadre_resultat`.
 *
 * ⚠️ À NE PAS CONFONDRE avec le formulaire de `/indicateurs` (module
 * « Indicateurs & suivi ») : deux tables distinctes, aux colonnes disjointes.
 *
 * ── Trois choix de saisie qui méritent d'être connus ──
 *
 *  • `code_indicateur_istr` est un CODE MÉTIER TEXTUEL (« R002 »), saisi à la
 *    main. Dans les tables « cibles » et « suivis », une colonne du MÊME NOM
 *    porte au contraire un ENTIER pointant vers `id_indicateur_str` : c'est le
 *    piège de nommage le plus coûteux du schéma, et la raison pour laquelle ce
 *    champ-ci est un `<Input>` texte là où les deux autres modales ont un
 *    sélecteur.
 *  • `niveau_istr` est une SAISIE NUMÉRIQUE LIBRE et non un sélecteur de
 *    niveaux : le schéma pose lui-même la question « FK vers
 *    `niveaux_cadre_resultat` ou simple entier ? » sans la trancher. Un
 *    sélecteur préjugerait de la réponse et rendrait impossible la saisie d'une
 *    valeur légitime dans l'hypothèse « simple entier ».
 *  • `periodicite_iop` est un texte libre borné à 30 caractères : proposer
 *    « Mensuel / Trimestriel / Semestriel / Annuel » inventerait un référentiel
 *    de périodicités que le backend n'a pas défini.
 */
interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: INDICATEUR_CADRE_RESULTAT_T | null
}

export function IndicateurCadreFormModal({
  children,
  open: controlledOpen,
  onOpenChange,
  initialData,
}: Props) {
  const { form, onSubmit, isPending, isEdit, open, setOpen } = useIndicateurCadreForm(
    initialData ?? null,
    controlledOpen,
    onOpenChange,
  )

  // Aucun argument : ce sélecteur désigne l'élément AUQUEL l'indicateur se
  // rattache, pas un parent. La question du cycle ne se pose donc pas — la
  // liste complète du cadre est légitime, dans son ordre hiérarchique.
  const cadres = useCadresOptions()
  const programmes = useProgrammesOptions()
  const structures = useStructuresOptions()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier l'indicateur" : 'Nouvel indicateur'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-1"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code_indicateur_istr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code de l'indicateur</FormLabel>
                    <FormControl>
                      <Input maxLength={30} placeholder="R002" {...field} />
                    </FormControl>
                    <FormDescription>Unique sur l'ensemble des indicateurs.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code_istr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Élément du cadre</FormLabel>
                    {/* FK NOT NULL → aucune option « Aucun ». */}
                    <FormControl>
                      <ReferentielSelect
                        referentiel={cadres}
                        value={field.value}
                        onChange={(valeur) => field.onChange(valeur ?? 0)}
                        placeholder="Sélectionner un élément"
                        autoriserAucun={false}
                      />
                    </FormControl>
                    {/* Le CASCADE est une conséquence que celui qui remplit ce
                        formulaire doit connaître : il n'existe nulle part
                        ailleurs dans l'écran. */}
                    <FormDescription>
                      Supprimer cet élément supprimera aussi ses indicateurs, leurs cibles et
                      leurs réalisations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="intitule_indicateur_istr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intitulé</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Intitulé complet de l'indicateur…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description_istr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    {/* `?? ''` : colonne nullable + champ optionnel côté zod ;
                        un `<textarea>` piloté par `undefined` ou `null`
                        basculerait en non contrôlé. */}
                    <Textarea
                      rows={3}
                      placeholder="Mode de calcul, périmètre, précisions…"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="niveau_istr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step={1}
                        placeholder="—"
                        // Colonne NULLABLE : un champ vidé vaut `null`, pas
                        // `0` — `0` serait une valeur SAISIE, que le service
                        // transmettrait comme telle.
                        value={field.value ?? ''}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value === '' ? null : Number(event.target.value),
                          )
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="periodicite_iop"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Périodicité</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={30}
                        placeholder="Trimestriel"
                        {...field}
                        value={field.value ?? ''}
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
                name="programme_istr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Programme</FormLabel>
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
              <FormField
                control={form.control}
                name="structure_istr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Structure</FormLabel>
                    <FormControl>
                      <ReferentielSelect
                        referentiel={structures}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Sélectionner une structure"
                        libelleAucun="Aucune structure"
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
                name="responsable_istr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsable</FormLabel>
                    <FormControl>
                      {/* Texte libre, PAS une clé étrangère vers `personnels` :
                          la colonne stocke un nom. Y brancher un sélecteur
                          d'agent enregistrerait un nombre là où la base attend
                          une chaîne. */}
                      <Input
                        maxLength={100}
                        placeholder="Nom du responsable du suivi"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="source_istr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source de la donnée</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={150}
                        placeholder="Enquête, registre, rapport…"
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
