import { useMemo } from 'react'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { cn } from '@/lib/utils'

export interface ComboboxOption {
  value: string
  label: string
}

interface FilterComboboxProps {
  options: ComboboxOption[]
  value?: string
  /** Émet `''` quand l'utilisateur efface la sélection. */
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  /** Ajoute une entrée « aucun filtre » en tête de liste. */
  allowClear?: boolean
  clearLabel?: string
  className?: string
  /** Cible du portail du menu — le passer quand la combobox vit dans une Dialog
   *  Radix (modale) pour que le menu reste cliquable dans le calque de la Dialog. */
  container?: HTMLElement | null
}

/**
 * Combobox à contrat SIMPLE (`options` / `value` / `onValueChange`), posée sur
 * la primitive composable `components/ui/combobox`.
 *
 * Pourquoi une couche de plus : les filtres sont générés à partir d'un tableau
 * de définitions. Ils ont besoin d'un composant qui se pilote par des données,
 * pas d'un assemblage de sous-composants à répéter treize fois.
 *
 * ⚠️ Le champ est DÉSACTIVÉ tant qu'il n'y a pas d'options — un menu vide qui
 * s'ouvre sur rien est pire qu'un contrôle visiblement inerte.
 */
export function FilterCombobox({
  options, value, onValueChange,
  placeholder = 'Sélectionner…', searchPlaceholder = 'Rechercher…',
  disabled, allowClear = true, clearLabel = 'Tous', className, container,
}: FilterComboboxProps) {
  const isDisabled = disabled || options.length === 0

  // Clear is a REAL item (value: '') so Base UI filters/manages it like any other.
  const items = useMemo<ComboboxOption[]>(
    () => (allowClear ? [{ value: '', label: clearLabel }, ...options] : options),
    [allowClear, clearLabel, options],
  )
  const selected = useMemo(
    () => items.find((o) => o.value === value && o.value !== '') ?? null,
    [items, value],
  )

  return (
    <Combobox
      items={items}
      value={selected}
      onValueChange={(next: ComboboxOption | null) => onValueChange(next?.value ?? '')}
      itemToStringLabel={(item: ComboboxOption | null) => item?.label ?? ''}
      disabled={isDisabled}
    >
      <ComboboxInput
        placeholder={isDisabled ? placeholder : searchPlaceholder}
        disabled={isDisabled}
        showClear={!isDisabled && Boolean(value)}
        className={cn('w-full', className)}
      />

      <ComboboxContent container={container}>
        <ComboboxEmpty>Aucun résultat.</ComboboxEmpty>
        {/* function child → Base UI renders the FILTERED items (this is the fix) */}
        <ComboboxList>
          {(item: ComboboxOption) => (
            <ComboboxItem key={item.value || '__all__'} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
