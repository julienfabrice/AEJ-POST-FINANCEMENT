import { useEffect, useMemo, useState } from 'react'
import { Plus, RotateCcw, Search, SlidersHorizontal, Upload } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FilterCombobox, type ComboboxOption } from '@/components/generics/filter-combobox'
import {
  BUDGET_FILTER_KEYS,
  STATUT_APPROBATION_OPTIONS,
  CONVENTION_OPTIONS,
  DEBLOCAGE_OPTIONS,
  ACTE_CREDIT_OPTIONS,
  TRANCHE_MONTANT_OPTIONS,
  STADE_PROJET_OPTIONS,
  TYPE_PROJET_OPTIONS,
  type BudgetFiltersState,
  type FilterOption,
} from '@/constants/budgets.filters'

const SEARCH_DEBOUNCE_MS = 350

interface BudgetsFiltersProps {
  filters: BudgetFiltersState
  onFiltersChange: (newFilters: BudgetFiltersState) => void
  onReset: () => void
  totalCount: number
  filteredCount: number
  isLoading?: boolean
  onAddNew: () => void
  onImport?: () => void
  organismes: Array<{ id: number; nom?: string | null; sigle?: string | null }>
  guichets: Array<{ id: number; nom?: string | null; code?: string | null }>
  secteurs: Array<{ id: number; libelle?: string | null; nom?: string | null }>
  agences: Array<{ id: number; nom?: string | null; libelle?: string | null }>
}

export function BudgetsFilters({
  filters,
  onFiltersChange,
  onReset,
  totalCount,
  filteredCount,
  isLoading,
  onAddNew,
  onImport,
  organismes,
  guichets,
  secteurs,
  agences,
}: BudgetsFiltersProps) {
  const [open, setOpen] = useState(false)
  const [portal, setPortal] = useState<HTMLElement | null>(null)
  const [term, setTerm] = useState(filters.search ?? '')
  const [prevSearch, setPrevSearch] = useState(filters.search)

  if (filters.search !== prevSearch) {
    setPrevSearch(filters.search)
    setTerm(filters.search ?? '')
  }

  useEffect(() => {
    const current = filters.search ?? ''
    if (term === current) return

    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: term.trim() || undefined })
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [term, filters, onFiltersChange])

  // Draft filters inside the dialog
  const [draft, setDraft] = useState<BudgetFiltersState>(filters)

  const handleOpenDialog = () => {
    setDraft(filters)
    setOpen(true)
  }

  const activeCount = useMemo(() => {
    return BUDGET_FILTER_KEYS.filter((key) => Boolean(filters[key])).length
  }, [filters])

  const hasAnyFilter = activeCount > 0 || Boolean(filters.search)

  const applyDraft = () => {
    onFiltersChange({ ...draft, search: filters.search })
    setOpen(false)
  }

  const clearAll = () => {
    onReset()
    setDraft({})
    setOpen(false)
  }

  // Convert referential lists to combobox options
  const organismeOptions = useMemo<ComboboxOption[]>(() => {
    return organismes.map((o) => ({
      value: String(o.id),
      label: o.sigle ? `${o.sigle} - ${o.nom ?? ''}` : (o.nom ?? `Organisme #${o.id}`),
    }))
  }, [organismes])

  const guichetOptions = useMemo<ComboboxOption[]>(() => {
    return guichets.map((g) => ({
      value: String(g.id),
      label: g.code ? `${g.code} - ${g.nom ?? ''}` : (g.nom ?? `Guichet #${g.id}`),
    }))
  }, [guichets])

  const secteurOptions = useMemo<ComboboxOption[]>(() => {
    return secteurs.map((s) => ({
      value: String(s.id),
      label: s.libelle ?? s.nom ?? `Secteur #${s.id}`,
    }))
  }, [secteurs])

  const agenceOptions = useMemo<ComboboxOption[]>(() => {
    return agences.map((a) => ({
      value: String(a.id),
      label: a.nom ?? a.libelle ?? `Agence #${a.id}`,
    }))
  }, [agences])

  const renderSelect = (
    label: string,
    value: string | undefined,
    options: FilterOption[],
    onChange: (val: string | undefined) => void,
  ) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-slate-600">{label}</Label>
      <Select
        value={value || '__all__'}
        onValueChange={(v) => onChange(v === '__all__' ? undefined : v)}
      >
        <SelectTrigger className="h-9 w-full bg-white cursor-pointer">
          <SelectValue placeholder="Tous" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Tous</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  const renderCombobox = (
    label: string,
    value: string | undefined,
    options: ComboboxOption[],
    onChange: (val: string | undefined) => void,
    placeholder = 'Tous',
  ) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-slate-600">{label}</Label>
      <FilterCombobox
        className="cursor-pointer"
        container={portal}
        options={options}
        value={value}
        onValueChange={(v) => onChange(v || undefined)}
        placeholder={placeholder}
        searchPlaceholder={label.toLowerCase()}
        clearLabel="Tous"
      />
    </div>
  )

  return (
    <>
      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border-slate-200">
        <div className="relative w-full max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Rechercher par code, projet, partenaire, source..."
            className="border-none bg-[#F3F5F8] pl-9 h-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="text-[12.5px] text-slate-500 mr-2">
            {isLoading
              ? 'Chargement...'
              : hasAnyFilter
              ? `${filteredCount} sur ${totalCount} budget(s)`
              : `${totalCount} budget(s)`}
          </span>

          {hasAnyFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="cursor-pointer text-slate-600 h-9"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
          )}

          <Button
            variant={activeCount > 0 ? 'default' : 'outline'}
            size="sm"
            onClick={handleOpenDialog}
            className={
              activeCount > 0
                ? 'cursor-pointer bg-[#E7722B] font-semibold text-white hover:bg-[#C85E18] h-9'
                : 'cursor-pointer h-9'
            }
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filtres
            {activeCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 h-5 min-w-5 justify-center rounded-full bg-white/25 px-1.5 text-white"
              >
                {activeCount}
              </Badge>
            )}
          </Button>

          {onImport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onImport}
              className="h-9 cursor-pointer border-slate-300 hover:bg-slate-50"
            >
              <Upload className="w-4 h-4 mr-2 text-slate-600" />
              Importer
            </Button>
          )}

          <Button onClick={onAddNew} className="h-9 cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau budget
          </Button>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={(isOpen) => { if (isOpen) handleOpenDialog(); else setOpen(false); }}>
        <DialogContent ref={setPortal} className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-3xl">
          <DialogHeader className="border-b px-6 py-4 text-left">
            <DialogTitle>Filtrer les budgets accordés</DialogTitle>
            <DialogDescription>
              Affinez la liste des budgets et financements accordés.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
            {/* 1. Statut & Circuit */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                Statut & Circuit
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {renderSelect(
                  "Statut d'approbation",
                  draft.statut,
                  STATUT_APPROBATION_OPTIONS,
                  (v) => setDraft((d) => ({ ...d, statut: v })),
                )}
                {renderSelect(
                  'Signature convention',
                  draft.signature_convention,
                  CONVENTION_OPTIONS,
                  (v) => setDraft((d) => ({ ...d, signature_convention: v })),
                )}
                {renderSelect(
                  'Déblocage des fonds',
                  draft.deblocage,
                  DEBLOCAGE_OPTIONS,
                  (v) => setDraft((d) => ({ ...d, deblocage: v })),
                )}
                {renderSelect(
                  'Acte de crédit',
                  draft.reception_acte_credit,
                  ACTE_CREDIT_OPTIONS,
                  (v) => setDraft((d) => ({ ...d, reception_acte_credit: v })),
                )}
              </div>
            </section>

            {/* 2. Financement & Partenaires */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                Financement & Partenaires
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {renderCombobox(
                  'Partenaire financier',
                  draft.organisme_id,
                  organismeOptions,
                  (v) => setDraft((d) => ({ ...d, organisme_id: v })),
                )}
                {renderCombobox(
                  'Guichet',
                  draft.guichet_id,
                  guichetOptions,
                  (v) => setDraft((d) => ({ ...d, guichet_id: v })),
                )}
                {renderSelect(
                  'Tranche de montant',
                  draft.tranche_montant,
                  TRANCHE_MONTANT_OPTIONS,
                  (v) => setDraft((d) => ({ ...d, tranche_montant: v })),
                )}
              </div>
            </section>

            {/* 3. Projet & Localisation */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                Projet & Localisation
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {renderSelect(
                  'Stade du projet',
                  draft.stade_projet,
                  STADE_PROJET_OPTIONS,
                  (v) => setDraft((d) => ({ ...d, stade_projet: v })),
                )}
                {renderSelect(
                  'Type de projet',
                  draft.type_projet,
                  TYPE_PROJET_OPTIONS,
                  (v) => setDraft((d) => ({ ...d, type_projet: v })),
                )}
                {renderCombobox(
                  "Secteur d'activité",
                  draft.secteuractivite_id,
                  secteurOptions,
                  (v) => setDraft((d) => ({ ...d, secteuractivite_id: v })),
                )}
                {renderCombobox(
                  'Agence régionale',
                  draft.agenceregionale_id,
                  agenceOptions,
                  (v) => setDraft((d) => ({ ...d, agenceregionale_id: v })),
                )}
              </div>
            </section>
          </div>

          <DialogFooter className="flex-row justify-between gap-2 border-t px-6 py-4">
            <Button
              type="button"
              variant="ghost"
              onClick={clearAll}
              disabled={activeCount === 0}
              className="cursor-pointer text-slate-600"
            >
              Tout effacer
            </Button>

            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="cursor-pointer">
                  Annuler
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={applyDraft}
                className="cursor-pointer bg-[#E7722B] font-semibold text-white hover:bg-[#C85E18]"
              >
                Appliquer
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
