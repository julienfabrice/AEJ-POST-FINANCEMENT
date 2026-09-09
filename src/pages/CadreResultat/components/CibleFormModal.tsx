import { useMemo } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  useProgrammesOptions,
  useUnitesGestionOptions,
} from '@/services/referentielsCadreResultat.services'
import type { CIBLE_INDICATEUR_T } from '@/types'
import { useCibleForm } from '../hooks/cibles/useCibleForm'
import { useIndicateursOptions } from '../hooks/useReferentielsInternes'
import { ChampNombreDecimal } from './ChampNombreDecimal'
import { ReferentielSelect } from './ReferentielSelect'

/**
 * Modale « Cible annuelle » — table `cibles_indicateur_cadre_resultat`.
 *
 * ══════════════════════════════════════════════════════════════════════
 *  CONVENTION DE L'ANNÉE — le point à comprendre avant tout le reste
 * ══════════════════════════════════════════════════════════════════════
 * La colonne `annee` est de type DATE (le schéma donne « 2019-01-01 ») alors
 * qu'elle porte un EXERCICE, c'est-à-dire une année. Trois conséquences, et une
 * seule règle :
 *
 *  1. L'écran fait choisir une ANNÉE, jamais une date. Un `<input type="date">`
 *     laisserait saisir « 2019-07-14 » — une valeur que la base accepterait
 *     sans broncher et qui casserait ensuite tous les regroupements par
 *     exercice, silencieusement.
 *  2. La normalisation en « AAAA-01-01 » est faite par `toAnnee()` de
 *     `cadreResultat.services.ts`, à l'écriture. Elle n'est PAS refaite ici :
 *     chaque sens de la traduction vit du côté qui connaît la forme attendue.
 *  3. Le sens inverse (« 2019-01-01 » → 2019) est fait par `anneeDe()` dans
 *     `useCibleForm`, par découpe de chaîne et non via `new Date()` : construire
 *     une date ferait basculer « 2019-01-01T00:00:00Z » sur 2018 dans les
 *     fuseaux négatifs.
 *
 * ⚠️ CONTRAINTE D'UNICITÉ (indicateur, programme, unité de gestion, année) :
 * une seule cible par combinaison. Zod ne voit qu'une ligne et ne peut pas la
 * vérifier — le refus viendra du serveur, l'aide sous le champ y prépare.
 *
 * ⚠️ `code_programme` est REQUIS par la colonne alors que son référentiel n'est
 * pas disponible : le sélecteur est donc désactivé et le formulaire ne pourra
 * pas être validé tant que la source des programmes ne sera pas branchée. C'est
 * assumé — une cible sans programme n'existe pas en base, et assouplir la règle
 * ferait passer la validation côté client pour échouer côté serveur.
 */

/**
 * Amplitude du sélecteur d'années, de part et d'autre de l'année COURANTE.
 *
 * Dix ans en arrière couvrent une reprise d'historique, dix ans en avant une
 * planification pluriannuelle. Rien n'est codé en dur : l'origine est
 * `new Date().getFullYear()`, recalculée à chaque ouverture — une borne fixe
 * écrite aujourd'hui deviendrait fausse l'an prochain, sans que personne ne
 * s'en aperçoive avant de ne plus pouvoir saisir l'exercice en cours.
 */
const ANNEES_AVANT = 10
const ANNEES_APRES = 10

/**
 * Années proposées, ordre décroissant (l'exercice courant et les suivants en
 * tête : ce sont ceux que l'on planifie).
 *
 * `anneeSelectionnee` est réinjectée si elle sort de la plage : une cible
 * ancienne ouverte en édition doit rester affichable, sinon le sélecteur
 * retomberait sur son placeholder et la modification enregistrerait une autre
 * année que celle qui était en base.
 */
function anneesProposees(anneeSelectionnee: number): number[] {
  const courante = new Date().getFullYear()
  const annees = new Set<number>()
  for (let annee = courante + ANNEES_APRES; annee >= courante - ANNEES_AVANT; annee -= 1) {
    annees.add(annee)
  }
  if (anneeSelectionnee > 0) annees.add(anneeSelectionnee)
  return [...annees].sort((a, b) => b - a)
}

interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: CIBLE_INDICATEUR_T | null
}

export function CibleFormModal({
  children,
  open: controlledOpen,
  onOpenChange,
  initialData,
}: Props) {
  const { form, onSubmit, isPending, isEdit, open, setOpen } = useCibleForm(
    initialData ?? null,
    controlledOpen,
    onOpenChange,
  )

  const indicateurs = useIndicateursOptions()
  const programmes = useProgrammesOptions()
  const unitesGestion = useUnitesGestionOptions()

  // `watch` et non `getValues` : la liste doit se recomposer si l'année change
  // (cas d'une cible hors plage remplacée par une année de la plage).
  const anneeSelectionnee = form.watch('annee')
  const annees = useMemo(() => anneesProposees(anneeSelectionnee), [anneeSelectionnee])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier la cible' : 'Nouvelle cible'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-1"
          >
            {/* Pleine largeur : le libellé d'un indicateur (« R002 · Intitulé
                complet ») est long, une demi-colonne le tronquerait. */}
            <FormField
              control={form.control}
              name="code_indicateur_istr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indicateur</FormLabel>
                  {/* FK NOT NULL → aucune option « Aucun ».
                      ⚠️ La valeur portée est `id_indicateur_str` (clé primaire
                      entière) et non le code textuel « R002 », malgré le nom de
                      la colonne : cf. `useIndicateursOptions`. */}
                  <FormControl>
                    <ReferentielSelect
                      referentiel={indicateurs}
                      value={field.value}
                      onChange={(valeur) => field.onChange(valeur ?? 0)}
                      placeholder="Sélectionner un indicateur"
                      autoriserAucun={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="annee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Année (exercice)</FormLabel>
                    <Select
                      value={field.value > 0 ? String(field.value) : ''}
                      onValueChange={(valeur) => field.onChange(Number(valeur))}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner une année" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {annees.map((annee) => (
                          <SelectItem key={annee} value={String(annee)}>
                            {annee}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Une seule cible par indicateur, programme, unité de gestion et année.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valeur_cible_indcateur_istr"
                render={({ field }) => (
                  <FormItem>
                    {/* Libellé rétabli : la colonne s'appelle
                        `valeur_cible_indcateur_istr` (coquille du schéma). */}
                    <FormLabel>Valeur cible</FormLabel>
                    <FormControl>
                      {/* PAS un `<input type="number">` : la colonne est un
                          NUMERIC(15,2) SIGNÉ, et un input numérique piloté par
                          un nombre écrase la frappe dès le séparateur décimal
                          (« 12, » y vaut la chaîne vide, donc `0`). Le détail
                          complet est dans `ChampNombreDecimal`. Le négatif est
                          autorisé — une cible peut mesurer une baisse. */}
                      <ChampNombreDecimal
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
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
                name="code_programme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Programme</FormLabel>
                    {/* FK NOT NULL : pas d'option « Aucun », même si le
                        référentiel est indisponible. Offrir de vider un champ
                        obligatoire ne ferait que déplacer le refus. */}
                    <FormControl>
                      <ReferentielSelect
                        referentiel={programmes}
                        value={field.value}
                        onChange={(valeur) => field.onChange(valeur ?? 0)}
                        placeholder="Sélectionner un programme"
                        autoriserAucun={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code_ug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unité de gestion</FormLabel>
                    <FormControl>
                      <ReferentielSelect
                        referentiel={unitesGestion}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Sélectionner une unité de gestion"
                        libelleAucun="Aucune unité de gestion"
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
