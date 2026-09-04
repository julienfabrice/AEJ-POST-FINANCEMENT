import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { versNombre } from '../utils/format'

/**
 * Champ de saisie d'un NUMERIC(15,2) SIGNÉ — valeur cible, valeur réalisée.
 *
 * ══════════════════════════════════════════════════════════════════════
 *  POURQUOI CE COMPOSANT EXISTE — le `<input type="number">` piloté
 *  détruisait la saisie décimale
 * ══════════════════════════════════════════════════════════════════════
 * Les deux seules valeurs dont dépend TOUT le calcul de taux du module
 * (`tauxAtteinte`) étaient saisies dans un `<input type="number" step="0.01">`
 * contrôlé par `value={field.value}`. Ce montage est cassé dès que la frappe
 * passe par un état transitoirement invalide, ce qui est le cas de TOUT nombre
 * décimal tapé de gauche à droite :
 *
 *  1. l'utilisateur frappe « 12 », puis le séparateur → le contenu du champ
 *     est « 12. », qui n'est pas un « valid floating-point number » ;
 *  2. le getter `value` d'un input numérique renvoie alors la CHAÎNE VIDE
 *     (état « bad input » du HTML), pas « 12. » ;
 *  3. le gestionnaire en déduisait `0` et l'écrivait dans le formulaire ;
 *  4. React réécrivait le DOM (`element.value = "" + value`) et la saisie de
 *     l'utilisateur était REMPLACÉE par « 0 ».
 *
 * ── La correction : le champ n'est plus piloté par un nombre ──
 * Le texte saisi vit dans un état LOCAL, et c'est lui seul qui est affiché.
 * Rien ne peut donc réécrire le champ pendant la frappe. Le nombre est remonté
 * au formulaire à chaque frappe (le formulaire reste toujours à jour, aucune
 * plomberie supplémentaire à la soumission) via `versNombre`, qui accepte
 * indifféremment « 12.5 » et « 12,5 » — et l'espace insécable d'un
 * copier-coller depuis un tableur.
 *
 * ── Pourquoi `type="text"` et non `type="number"` ──
 * Conserver `type="number"` ne suffirait pas : réafficher « 12, » dans un input
 * numérique le VIDERAIT (l'algorithme de sanitisation du HTML remplace toute
 * valeur non conforme par la chaîne vide). `inputMode="decimal"` rétablit le
 * pavé numérique sur mobile, qui était le seul apport réel du type `number`
 * ici — les flèches d'incrément n'ont aucun sens sur une valeur d'indicateur.
 *
 * ── Ce que fait la sortie de champ ──
 * Au `blur`, le texte est réécrit à partir du nombre RÉELLEMENT stocké. C'est
 * le seul moment où l'affichage est normalisé, et il garantit qu'un champ au
 * repos ne montre jamais autre chose que ce qui sera envoyé : « 12, » devient
 * « 12 », une saisie illisible devient « 0 ».
 */

/**
 * Nombre → texte affiché, en notation française (« 12,5 »).
 *
 * La virgule est la notation attendue à l'écran, et `versNombre` la relit sans
 * difficulté : l'aller-retour est donc sans perte. Aucun séparateur de milliers
 * n'est posé ici, contrairement à `formatValeur` : dans un champ de SAISIE, il
 * gênerait la frappe plus qu'il n'aiderait la lecture.
 */
function texteDeNombre(valeur: number): string {
  if (!Number.isFinite(valeur)) return ''
  return String(valeur).replace('.', ',')
}

/**
 * `value` / `onChange` sont retypés en NOMBRE : c'est ce que le formulaire
 * porte. `type` et `inputMode` sont exclus — ce composant les impose, et les
 * laisser surchargeables rouvrirait exactement le défaut corrigé.
 */
type ProprietesInputHeritees = Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange' | 'type' | 'inputMode'
>

interface Props extends ProprietesInputHeritees {
  /** Valeur portée par le formulaire. */
  value: number
  /** Remontée à chaque frappe, jamais `NaN` (cf. `versNombre`). */
  onChange: (valeur: number) => void
}

export function ChampNombreDecimal({ value, onChange, onBlur, ...props }: Props) {
  const [texte, setTexte] = useState(() => texteDeNombre(value))

  /**
   * Dernier nombre que CE champ a remonté au formulaire.
   *
   * Il sert à distinguer les deux origines possibles d'un changement de la
   * prop `value` : la frappe de l'utilisateur (à ignorer — réécrire le texte
   * serait précisément le bug corrigé) et une modification EXTERNE, c'est-à-dire
   * le `form.reset()` de l'ouverture de la modale, qu'il faut au contraire
   * refléter puisque le champ est monté avant que l'enregistrement à éditer
   * n'ait été injecté.
   */
  const derniereValeurRemontee = useRef(value)

  useEffect(() => {
    if (value === derniereValeurRemontee.current) return
    derniereValeurRemontee.current = value
    setTexte(texteDeNombre(value))
  }, [value])

  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      value={texte}
      onChange={(event) => {
        const saisie = event.target.value
        // Le texte est affiché TEL QUEL : c'est ce qui rend « 12, » possible.
        setTexte(saisie)
        const nombre = versNombre(saisie)
        derniereValeurRemontee.current = nombre
        onChange(nombre)
      }}
      onBlur={(event) => {
        setTexte(texteDeNombre(derniereValeurRemontee.current))
        // `field.onBlur` de react-hook-form marque le champ « touché » : le
        // relayer est indispensable, sinon la validation au blur ne part pas.
        onBlur?.(event)
      }}
    />
  )
}
