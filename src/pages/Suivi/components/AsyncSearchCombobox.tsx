import { useEffect, useMemo, useRef, useState, type AriaAttributes } from 'react'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { cn } from '@/lib/utils'

export interface AsyncComboboxOption {
  value: string
  label: string
}

interface AsyncSearchComboboxProps {
  /** Lot COURANT renvoyé par le serveur, sélection en cours comprise. */
  options: AsyncComboboxOption[]
  /** `''` = aucune sélection. */
  value: string
  /**
   * Option DÉJÀ liée à la ligne en cours d'édition, convertie par l'appelant
   * depuis la relation embarquée par l'API.
   *
   * Elle n'est PAS concaténée aux `options` par l'appelant : la règle
   * « l'élément sélectionné doit rester dans la liste » est traitée ICI, une
   * seule fois, au même endroit que `derniereSelection` — les deux répondent
   * au même besoin (cf. `optionsAffichees`).
   */
  optionInitiale?: AsyncComboboxOption | null
  onValueChange: (value: string) => void
  /** Appelé avec le terme DÉBOUNCÉ : c'est lui qu'on envoie à l'API. */
  onSearchChange: (term: string) => void
  /** Ouverture pilotée par l'appelant : elle conditionne l'activation de la requête. */
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading?: boolean
  /** Nombre TOTAL de correspondances côté serveur (souvent ≫ `options.length`). */
  total?: number
  placeholder?: string
  emptyMessage?: string
  disabled?: boolean
  /** Cible du portail — à passer quand la combobox vit dans une Dialog Radix. */
  container?: HTMLElement | null
  className?: string
  debounceMs?: number
  /**
   * Attributs injectés par `<FormControl>` (Slot Radix) sur son unique enfant.
   * Un composant FONCTION ne les relaie pas tout seul : sans ces trois props
   * explicitement transmises au `<input>`, le `<FormLabel htmlFor>` pointerait
   * vers un élément inexistant (clic sans effet, champ annoncé sans nom par un
   * lecteur d'écran) et l'état d'erreur n'atteindrait jamais la saisie.
   * Le champ est ainsi associé EXACTEMENT comme les `Input` et `SelectTrigger`
   * du reste du dépôt.
   */
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: AriaAttributes['aria-invalid']
}

/**
 * Combobox de RECHERCHE ASYNCHRONE, posée sur la primitive
 * `components/ui/combobox` (Base UI).
 *
 * ── Pourquoi elle existe ──
 * `FilterCombobox` filtre LOCALEMENT un tableau d'options déjà chargé. Ce
 * contrat est inapplicable ici : `/projets` compte ~110 000 lignes et
 * `/promoteurs` ~109 990. Charger le référentiel pour peupler un select est
 * exclu (≈900 Ko pour 500 lignes seulement). La recherche doit donc partir au
 * SERVEUR, et le filtrage interne de Base UI être neutralisé — d'où
 * `filter={null}` : la liste affiche exactement ce que le serveur a renvoyé,
 * jamais un sous-ensemble re-filtré à tort.
 *
 * ── Débounce ──
 * Porté ici, une fois pour toutes : chaque frappe changerait sinon la clé de
 * cache TanStack Query et déclencherait une requête. 300 ms est le compromis
 * retenu (le temps d'une frappe rapide, sans latence perçue).
 *
 * ── Requête coupée à la fermeture ──
 * `open` remonte à l'appelant, qui s'en sert comme `enabled` de sa requête :
 * un formulaire dont la combobox est fermée n'interroge pas l'API.
 */
export function AsyncSearchCombobox({
  options,
  value,
  optionInitiale = null,
  onValueChange,
  onSearchChange,
  open,
  onOpenChange,
  isLoading = false,
  total,
  placeholder = 'Rechercher…',
  emptyMessage = 'Aucun résultat.',
  disabled = false,
  container,
  className,
  debounceMs = 300,
  id,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}: AsyncSearchComboboxProps) {
  const [saisie, setSaisie] = useState('')

  // La callback est appelée depuis un timer : on la garde dans une ref pour ne
  // pas relancer le débounce à chaque rendu du parent (fonction recréée à
  // l'identique mais avec une nouvelle référence).
  const onSearchChangeRef = useRef(onSearchChange)
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange
  })

  useEffect(() => {
    const timer = setTimeout(() => onSearchChangeRef.current(saisie), debounceMs)
    return () => clearTimeout(timer)
  }, [saisie, debounceMs])

  /**
   * Dernière option choisie par l'utilisateur.
   *
   * Sans elle, le champ se VIDE dès que la recherche suivante ne ramène plus
   * l'élément sélectionné : Base UI résout la sélection en cherchant `value`
   * dans `items`, et le lot renvoyé par le serveur change à chaque frappe.
   * On la conserve donc pour la réinjecter en tête de liste tant qu'elle
   * correspond à la valeur courante.
   */
  const [derniereSelection, setDerniereSelection] = useState<AsyncComboboxOption | null>(null)

  /**
   * Liste réellement affichée : le lot du serveur, précédé au besoin de
   * l'option sélectionnée quand celui-ci ne la contient pas.
   *
   * Deux origines possibles pour cette option, traitées ici ENSEMBLE parce
   * qu'elles servent la même règle : la dernière sélection de l'utilisateur
   * (priorité — c'est son choix le plus récent) et, à défaut, l'option déjà
   * liée à la ligne ouverte en édition (`optionInitiale`). Les deux sont
   * gardées par une égalité avec `value` : une option devenue obsolète n'est
   * jamais réinjectée.
   */
  const optionsAffichees = useMemo(() => {
    if (!value || options.some((option) => option.value === value)) return options

    const selectionnee =
      derniereSelection?.value === value
        ? derniereSelection
        : optionInitiale?.value === value
          ? optionInitiale
          : null

    return selectionnee ? [selectionnee, ...options] : options
  }, [derniereSelection, optionInitiale, options, value])

  const selection = useMemo(
    () => optionsAffichees.find((option) => option.value === value) ?? null,
    [optionsAffichees, value],
  )

  return (
    <Combobox
      items={optionsAffichees}
      value={selection}
      onValueChange={(next: AsyncComboboxOption | null) => {
        setDerniereSelection(next)
        onValueChange(next?.value ?? '')
      }}
      itemToStringLabel={(item: AsyncComboboxOption | null) => item?.label ?? ''}
      // Le serveur a déjà filtré : re-filtrer localement masquerait des
      // résultats légitimes (accents, casse, correspondance sur un champ non
      // affiché dans le libellé).
      filter={null}
      open={open}
      onOpenChange={onOpenChange}
      // On ne retient QUE la frappe de l'utilisateur. Base UI réécrit aussi la
      // valeur du champ à la sélection et à la fermeture (il y remet le libellé
      // de l'élément choisi) : relayer ces réécritures relancerait une recherche
      // sur le libellé complet, qui ne ramènerait plus rien.
      onInputValueChange={(saisieCourante: string, details: { reason: string }) => {
        if (details.reason === 'input-change' || details.reason === 'input-clear') {
          setSaisie(saisieCourante)
        }
      }}
      disabled={disabled}
    >
      <ComboboxInput
        // Attributs de `<FormControl>` relayés jusqu'au `<input>` réel.
        id={id}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        placeholder={placeholder}
        disabled={disabled}
        showClear={!disabled && Boolean(value)}
        className={cn('w-full', className)}
      />

      <ComboboxContent container={container}>
        <ComboboxEmpty>{isLoading ? 'Recherche en cours…' : emptyMessage}</ComboboxEmpty>

        {/* Enfant-fonction : Base UI rend les items de `items` tels quels. */}
        <ComboboxList>
          {(item: AsyncComboboxOption) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>

        {/* On ne montre JAMAIS plus que le lot demandé : le dire évite à
            l'utilisateur de conclure à tort que son résultat n'existe pas. */}
        {typeof total === 'number' && total > optionsAffichees.length && (
          <div className="border-t border-slate-100 px-3 py-2 text-[11.5px] text-slate-500">
            {optionsAffichees.length} premiers résultats sur {total} — affinez votre recherche.
          </div>
        )}
      </ComboboxContent>
    </Combobox>
  )
}
