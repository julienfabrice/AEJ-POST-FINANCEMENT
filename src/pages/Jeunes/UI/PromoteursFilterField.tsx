import { FilterCombobox } from '@/components/generics/filter-combobox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ALL_VALUE,
  isReferentialFilter,
  type FilterDef,
  type FilterOption,
} from '@/constants/promoteurs.filters'
import { useReferentialOptions } from '@/hooks/referentials.hooks'

interface PromoteursFilterFieldProps {
  def: FilterDef
  value?: string
  onChange: (value: string | undefined) => void
  /** Cible du portail — la Dialog des filtres (voir PromoteursFilters). */
  container?: HTMLElement | null
}

/**
 * Rend UN filtre à partir de sa définition.

 */
export function PromoteursFilterField({ def, value, onChange, container }: PromoteursFilterFieldProps) {
 
  const referential = useReferentialOptions(isReferentialFilter(def) ? def.ref : '')

  const isRef = isReferentialFilter(def)
  const options: FilterOption[] = isRef ? referential.options : (def.options ?? [])


  const isEmpty = options.length === 0
  const placeholder = isRef && referential.isLoading ? 'Chargement…' : isEmpty ? 'Aucune option' : 'Tous'

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-slate-600">{def.label}</Label>

      {def.control === 'combobox' ? (
        <FilterCombobox
          className='cursor-pointer'
          container={container}
          options={options}
          value={value}
          onValueChange={(v) => onChange(v || undefined)}
          disabled={isEmpty}
          placeholder={placeholder}
          searchPlaceholder={`${def.label.toLowerCase()}`}
          clearLabel="Tous"
        />
      ) : (
        <Select
          value={value ?? ALL_VALUE}
          onValueChange={(v) => onChange(v === ALL_VALUE ? undefined : v)}
          disabled={isEmpty}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE} className="cursor-pointer">
              Tous
            </SelectItem>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value} className="cursor-pointer">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
