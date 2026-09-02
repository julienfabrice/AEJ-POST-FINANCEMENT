import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { REFERENTIEL_CADRE_RESULTAT_T } from '@/types'

/**
 * Sélecteur d'un RÉFÉRENTIEL EXTERNE du cadre de résultat (programme,
 * structure, unité de gestion, partenaire).
 *
 * ── Le point important : il ne ment jamais ──
 * Trois des quatre référentiels du module n'ont pas de source connue (cf.
 * `referentielsCadreResultat.services.ts`). Ce composant est l'endroit UNIQUE
 * où cette indisponibilité devient visible à l'écran :
 *
 *  • `disponible: false` → le déclencheur est DÉSACTIVÉ et affiche la raison
 *    (`messageIndisponible`) en lieu et place du placeholder. Aucune option
 *    n'est proposée, aucune valeur n'est inventée : l'utilisateur voit que le
 *    champ existe, qu'il n'est pas cassé, et pourquoi il ne peut pas encore
 *    servir.
 *  • `disponible: true` mais liste vide → « Aucun élément disponible ». C'est
 *    un cas différent du précédent : la source EST branchée, elle ne renvoie
 *    simplement rien. Les confondre masquerait un référentiel réellement vide.
 *
 * ── Pourquoi la sentinelle `'0'` pour « Aucun » ──
 * Radix Select refuse la chaîne vide comme valeur d'item (elle est réservée à
 * l'état « non sélectionné »). On utilise donc `'0'`, la même convention que le
 * reste du dépôt, traduite en `null` à la remontée — ce que `toCle()` des
 * services attend précisément pour une clé étrangère nullable.
 *
 * ── Pourquoi le composant DÉCLARE `id` et les attributs ARIA ──
 * Il est toujours posé dans un `<FormItem>`, et `<FormLabel>` y rend
 * systématiquement `htmlFor={formItemId}`. Sans un élément portant cet
 * identifiant, le libellé pointe dans le vide : cliquer « Programme » ne fait
 * rien, et un lecteur d'écran annonce une liste déroulante sans jamais dire de
 * quel champ il s'agit. Les trois attributs injectés par `<FormControl>`
 * (`id`, `aria-describedby`, `aria-invalid`) sont donc déclarés ici et relayés
 * au `SelectTrigger` — qui est le vrai contrôle, celui qui porte le rôle
 * `combobox` et le focus. C'est exactement ce que fait le gabarit du dépôt
 * (`ExploitationFormModal`), à ceci près que le Slot y traverse un composant
 * intermédiaire : il faut donc que ce composant accepte les props au lieu de
 * les laisser tomber.
 */

/** Valeur d'item représentant « aucune sélection » (cf. en-tête). */
const AUCUNE_SELECTION = '0'

interface Props {
  referentiel: REFERENTIEL_CADRE_RESULTAT_T
  /** Clé étrangère sélectionnée — `null` quand rien n'est choisi. */
  value: number | null
  onChange: (valeur: number | null) => void
  /** Texte du placeholder quand le référentiel EST disponible. */
  placeholder: string
  /**
   * Autorise l'option « Aucun ». `false` sur une FK NOT NULL : proposer de la
   * vider produirait une erreur serveur systématique.
   */
  autoriserAucun?: boolean
  /** Libellé de l'option « Aucun » — variable selon le champ. */
  libelleAucun?: string
  /**
   * Injecté par `<FormControl>` (cf. en-tête) : identifiant visé par le
   * `htmlFor` du `<FormLabel>`. Optionnel pour un usage hors formulaire.
   */
  id?: string
  /** Injecté par `<FormControl>` : rattache l'aide et le message d'erreur. */
  'aria-describedby'?: string
  /** Injecté par `<FormControl>` : `true` quand le champ est en erreur. */
  'aria-invalid'?: boolean
}

export function ReferentielSelect({
  referentiel,
  value,
  onChange,
  placeholder,
  autoriserAucun = true,
  libelleAucun = 'Aucun',
  id,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}: Props) {
  const { options, isLoading, disponible, messageIndisponible } = referentiel

  // Désactivé tant que la source est inconnue OU pendant le chargement : dans
  // les deux cas, choisir est impossible et laisser le menu ouvrable sur une
  // liste vide n'apporterait rien.
  const desactive = !disponible || isLoading

  const texteDeRepli = !disponible
    ? (messageIndisponible ?? 'Référentiel non disponible.')
    : isLoading
      ? 'Chargement du référentiel…'
      : placeholder

  return (
    <Select
      disabled={desactive}
      value={value !== null && value > 0 ? String(value) : ''}
      onValueChange={(valeur) =>
        onChange(valeur === AUCUNE_SELECTION ? null : Number(valeur))
      }
    >
      {/* Les trois attributs sont posés sur le DÉCLENCHEUR, pas sur la racine
          `<Select>` : Radix n'en rend aucun élément propre, le trigger est le
          seul nœud focalisable et le seul à porter le rôle `combobox`. */}
      <SelectTrigger
        className="w-full"
        id={id}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
      >
        {/* `placeholder` porte le message d'indisponibilité : c'est le seul
            texte visible quand aucune valeur n'est sélectionnée, donc le seul
            endroit où la raison peut réellement être lue. */}
        <SelectValue placeholder={texteDeRepli} />
      </SelectTrigger>
      <SelectContent>
        {autoriserAucun && (
          <SelectItem value={AUCUNE_SELECTION}>{libelleAucun}</SelectItem>
        )}
        {options.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
        {/* Source branchée mais vide : on le DIT, au lieu d'un menu vide muet
            qui se confondrait avec un référentiel indisponible. */}
        {disponible && options.length === 0 && !autoriserAucun && (
          <SelectItem value={AUCUNE_SELECTION} disabled>
            Aucun élément disponible
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}
