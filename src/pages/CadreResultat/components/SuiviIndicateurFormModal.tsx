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
import { useUnitesGestionOptions } from '@/services/referentielsCadreResultat.services'
import type { SUIVI_INDICATEUR_T } from '@/types'
import { useSuiviIndicateurForm } from '../hooks/suivis/useSuiviIndicateurForm'
import { useIndicateursOptions } from '../hooks/useReferentielsInternes'
import { ChampNombreDecimal } from './ChampNombreDecimal'
import { ReferentielSelect } from './ReferentielSelect'

/**
 * Modale « Réalisation » — table `suivis_indicateur_cadre_resultat`.
 *
 * C'est le pendant de la cible : la cible dit ce qui est visé, la réalisation
 * ce qui est mesuré. Le rapprochement des deux donne le taux d'atteinte affiché
 * dans l'onglet de synthèse (`tauxAtteinte`, `utils/format.ts`).
 *
 * ── Ce que la table a d'abîmé, et ce que la modale en fait ──
 *
 *  • `Date_suivi` garde sa MAJUSCULE initiale, seule de tout le schéma. Elle
 *    est reprise telle quelle jusque dans le `name` du champ : le jour du
 *    branchement, c'est le premier point à vérifier, et un renommage
 *    « propre » ici le rendrait introuvable.
 *  • `code_programme` n'a AUCUN champ : la colonne n'est pas déclarée dans la
 *    table, elle n'est exigée que par sa contrainte UNIQUE. La faire saisir
 *    reviendrait à inventer une colonne ; le service l'omet purement et
 *    simplement du corps de la requête tant qu'elle est vide.
 *  • `periode_suivi`, citée par la même contrainte, n'a pas davantage de champ
 *    ni de déclaration — et `Date_suivi` remplit déjà ce rôle.
 *  • `modifier_par` n'a pas de champ non plus : c'est une TRACE (le nom du
 *    dernier modificateur), pas une donnée de la mesure. Le hook préserve la
 *    valeur reçue en édition, ce qui évite de l'effacer sans la faire ressaisir.
 *
 * ── Ce qui n'est volontairement PAS prérempli ──
 * `Date_suivi` s'ouvre VIDE, pas à la date du jour : une réalisation se
 * rattache à la période mesurée, pas au moment de la saisie. Un
 * préremplissage silencieux produirait des mesures mal datées, et donc des
 * taux d'atteinte attribués au mauvais exercice.
 */
interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: SUIVI_INDICATEUR_T | null
}

export function SuiviIndicateurFormModal({
  children,
  open: controlledOpen,
  onOpenChange,
  initialData,
}: Props) {
  const { form, onSubmit, isPending, isEdit, open, setOpen } = useSuiviIndicateurForm(
    initialData ?? null,
    controlledOpen,
    onOpenChange,
  )

  const indicateurs = useIndicateursOptions()
  const unitesGestion = useUnitesGestionOptions()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier la réalisation' : 'Nouvelle réalisation'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-1"
          >
            {/* Pleine largeur : libellé long (« R002 · Intitulé complet »). */}
            <FormField
              control={form.control}
              name="code_indicateur_istr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indicateur</FormLabel>
                  {/* FK NOT NULL → aucune option « Aucun ».
                      ⚠️ Valeur = `id_indicateur_str` (clé primaire entière), pas
                      le code textuel de la table des indicateurs. */}
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
                name="Date_suivi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de suivi</FormLabel>
                    <FormControl>
                      {/* `<input type="date">` n'accepte que « AAAA-MM-JJ » —
                          c'est exactement ce que le schéma zod contrôle, et ce
                          que le hook produit à la relecture (`slice(0, 10)`). */}
                      <Input type="date" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormDescription>Date de la mesure, pas date de la saisie.</FormDescription>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valeur_realisee_istr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valeur réalisée</FormLabel>
                    <FormControl>
                      {/* NUMERIC(15,2) signé, saisie décimale : même champ et
                          même raison que la valeur cible — un
                          `<input type="number">` piloté par un nombre écrase la
                          frappe au séparateur décimal (cf.
                          `ChampNombreDecimal`). Négatif autorisé, une
                          réalisation peut mesurer une variation à la baisse. */}
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

            <FormField
              control={form.control}
              name="commentaire_suivi_istr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Contexte de la mesure, écart constaté, source…"
                      {...field}
                      value={field.value ?? ''}
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
