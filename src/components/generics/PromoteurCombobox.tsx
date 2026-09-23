import { useMemo, useState, type AriaAttributes } from 'react'
import { promoteursServices } from '@/services/promoteurs.services'
import { AsyncSearchCombobox, type AsyncComboboxOption } from '@/components/generics/VisiteSuiviFormModal/AsyncSearchCombobox'

const PROMOTEURS_SEARCH_PER_PAGE = 25

export interface PromoteurOptionItem {
  id: number
  nom: string
  prenom: string
  matriculeaej?: string | null
}

export interface PromoteurComboboxProps {
  /** `0` = aucune sélection. */
  value: number
  onChange: (id: number) => void
  /** Promoteur déjà lié à la ligne en cours d'édition. */
  promoteurInitial?: PromoteurOptionItem | null
  container?: HTMLElement | null
  disabled?: boolean
  placeholder?: string
  className?: string
  /** Injectés par `<FormControl>` et relayés au `<input>`. */
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: AriaAttributes['aria-invalid']
}

const libellePromoteur = (promoteur: PromoteurOptionItem): string => {
  const identite = `${promoteur.nom ?? ''} ${promoteur.prenom ?? ''}`.trim()
  return promoteur.matriculeaej ? `${identite} · ${promoteur.matriculeaej}` : identite
}

const versOption = (promoteur: PromoteurOptionItem): AsyncComboboxOption => ({
  value: String(promoteur.id),
  label: libellePromoteur(promoteur),
})

/**
 * Sélecteur de promoteur à recherche serveur asynchrone, basé sur Base UI Combobox.
 */
export function PromoteurCombobox({
  value,
  onChange,
  promoteurInitial,
  container,
  disabled,
  placeholder = 'Rechercher un promoteur par nom ou matricule…',
  className,
  id,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}: PromoteurComboboxProps) {
  const [open, setOpen] = useState(false)
  const [terme, setTerme] = useState('')

  const { data, isFetching } = promoteursServices.useGetPromoteurs({
    page: 1,
    perPage: PROMOTEURS_SEARCH_PER_PAGE,
    search: terme.trim() || undefined,
  })

  const options = useMemo<AsyncComboboxOption[]>(() => data?.rows.map(versOption) ?? [], [data])

  const optionInitiale = useMemo<AsyncComboboxOption | null>(
    () => (promoteurInitial ? versOption(promoteurInitial) : null),
    [promoteurInitial],
  )

  return (
    <AsyncSearchCombobox
      options={options}
      optionInitiale={optionInitiale}
      value={value ? String(value) : ''}
      onValueChange={(next) => onChange(next ? Number(next) : 0)}
      onSearchChange={setTerme}
      open={open}
      onOpenChange={setOpen}
      isLoading={isFetching}
      total={data?.total}
      placeholder={placeholder}
      emptyMessage="Aucun promoteur ne correspond."
      disabled={disabled}
      container={container}
      className={className}
      id={id}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
    />
  )
}
