import { useMemo, type AriaAttributes } from 'react'
import { budgetServices } from '@/services/budgets.services'
import type { BUDGET_T } from '@/types'
import { money } from '@/helpers/money'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { cn } from '@/lib/utils'

export interface BudgetOptionItem {
  value: string
  label: string
  budget: BUDGET_T
}

export interface BudgetComboboxProps {
  /** `0` = aucune sélection. */
  value: number
  onChange: (id: number, budget?: BUDGET_T | null) => void
  /** Budget déjà lié à la ligne en cours d'édition. */
  budgetInitial?: BUDGET_T | null
  /** ID du promoteur pour restreindre ou prioriser les budgets liés. */
  promoteurId?: number
  container?: HTMLElement | null
  disabled?: boolean
  placeholder?: string
  className?: string
  /** Injectés par `<FormControl>` et relayés au `<input>`. */
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: AriaAttributes['aria-invalid']
}

const libelleBudget = (budget: BUDGET_T): string => {
  const parts: string[] = []
  parts.push(budget.intitule || `Budget #${budget.id}`)

  if (budget.micro_projet?.code) {
    parts.push(`[${budget.micro_projet.code}]`)
  }

  const montant = Number(budget.montant_accorde)
  if (!isNaN(montant) && montant > 0) {
    parts.push(`(${money(montant)})`)
  }

  return parts.join(' ')
}

export function BudgetCombobox({
  value,
  onChange,
  budgetInitial,
  promoteurId,
  container,
  disabled = false,
  placeholder = 'Rechercher un budget…',
  className,
  id,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}: BudgetComboboxProps) {
  const { data: rawBudgets, isLoading } = budgetServices.useGetAll()

  const budgetsList = useMemo<BUDGET_T[]>(() => {
    const list = Array.isArray(rawBudgets)
      ? [...rawBudgets]
      : Array.isArray((rawBudgets as any)?.data)
        ? [...(rawBudgets as any).data]
        : []
    return list
  }, [rawBudgets])

  // Filtrage selon le promoteur sélectionné (s'il existe des budgets correspondants)
  const budgetsFiltres = useMemo<BUDGET_T[]>(() => {
    if (!promoteurId) return budgetsList
    const matching = budgetsList.filter((b) => b.micro_projet?.promoteur_id === promoteurId)
    return matching.length > 0 ? matching : budgetsList
  }, [budgetsList, promoteurId])

  const options = useMemo<BudgetOptionItem[]>(() => {
    const list = [...budgetsFiltres]
    if (budgetInitial && !list.some((b) => b.id === budgetInitial.id)) {
      list.unshift(budgetInitial)
    }

    return list.map((b) => ({
      value: String(b.id),
      label: libelleBudget(b),
      budget: b,
    }))
  }, [budgetsFiltres, budgetInitial])

  const selection = useMemo(
    () => options.find((opt) => opt.value === (value ? String(value) : '')) ?? null,
    [options, value],
  )

  const isDisabled = disabled || (isLoading && options.length === 0)

  return (
    <Combobox
      items={options}
      value={selection}
      onValueChange={(next: BudgetOptionItem | null) => {
        const nextId = next?.value ? Number(next.value) : 0
        onChange(nextId, next?.budget ?? null)
      }}
      itemToStringLabel={(item: BudgetOptionItem | null) => item?.label ?? ''}
      disabled={isDisabled}
    >
      <ComboboxInput
        id={id}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        placeholder={isLoading ? 'Chargement des budgets…' : placeholder}
        disabled={isDisabled}
        showClear={!isDisabled && Boolean(value)}
        className={cn('w-full', className)}
      />

      <ComboboxContent container={container}>
        <ComboboxEmpty>
          {isLoading ? 'Chargement en cours…' : 'Aucun budget ne correspond.'}
        </ComboboxEmpty>
        <ComboboxList>
          {(item: BudgetOptionItem) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
