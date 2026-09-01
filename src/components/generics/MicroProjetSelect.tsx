import { useMemo } from 'react'
import { FilterCombobox, type ComboboxOption } from '@/components/generics/filter-combobox'
import { projetsServices } from '@/services/projets.services'

interface MicroProjetSelectProps {
  value?: number
  onValueChange: (id: number | undefined) => void
  disabled?: boolean
}

/**
 * Sélecteur de micro-projet basé sur le vrai endpoint /projets (confirmé,
 * fusionné depuis la branche du CP). Remplace la saisie manuelle d'ID.
 *
 * FilterCombobox filtre côté CLIENT sur la liste fournie (pas de recherche
 * serveur branchée) — on charge donc une page large une seule fois.
 */
export function MicroProjetSelect({ value, onValueChange, disabled }: MicroProjetSelectProps) {
  const { data, isLoading } = projetsServices.useGetAll(1, 100)

  const options = useMemo<ComboboxOption[]>(() => {
    return (data?.data ?? []).map((p) => ({
      value: String(p.id),
      label: p.promoteur ? `${p.code} — ${p.intitule} (${p.promoteur.prenom} ${p.promoteur.nom})` : `${p.code} — ${p.intitule}`,
    }))
  }, [data])

  return (
    <FilterCombobox
      options={options}
      value={value ? String(value) : ''}
      onValueChange={(v) => onValueChange(v ? Number(v) : undefined)}
      placeholder="Sélectionner un micro-projet…"
      searchPlaceholder="Rechercher par nom, code…"
      disabled={disabled || isLoading}
      allowClear
      clearLabel="Aucun"
    />
  )
}
