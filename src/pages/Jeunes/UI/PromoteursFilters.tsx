import { useEffect, useMemo, useState } from 'react'
import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
  FILTER_GROUPS,
  FILTER_KEYS,
  PROMOTEUR_FILTERS,
  type FilterKey,
} from '@/constants/promoteurs.filters'
import type { PROMOTEUR_SEARCH_T } from '@/types/promoteurs.types'
import { usePromoteursSearch } from '../hooks/usePromoteursSearch'
import { PromoteursFilterField } from './PromoteursFilterField'

const SEARCH_DEBOUNCE_MS = 350

/** Filtres catégoriels uniquement — la recherche texte vit hors du panneau. */
type FilterDraft = Partial<Record<FilterKey, string | undefined>>

const draftFromSearch = (search: PROMOTEUR_SEARCH_T): FilterDraft =>
  Object.fromEntries(FILTER_KEYS.map((key) => [key, search[key]])) as FilterDraft

export function PromoteursFilters() {
  const { search, setFilter, resetFilters } = usePromoteursSearch()
  const [open, setOpen] = useState(false)

  // La Dialog est modale (Radix) : elle neutralise les pointer-events hors de son
  // contenu. Les menus des combobox (Base UI, portés dans <body>) doivent donc
  // être portés DANS la Dialog pour rester cliquables. On capture son nœud ici.
  const [portal, setPortal] = useState<HTMLElement | null>(null)

  // SEULE entorse à « l'URL est la source de vérité » côté barre : le tampon de
  // saisie. Sans lui, chaque frappe déclencherait une navigation et une requête.
  const [term, setTerm] = useState(search.search ?? '')

  // Resynchronise quand l'URL change sans passer par le champ (réinitialisation,
  // navigation arrière, lien partagé).
  useEffect(() => {
    setTerm(search.search ?? '')
  }, [search.search])

  useEffect(() => {
    const current = search.search ?? ''
    if (term === current) return

    const timer = setTimeout(() => {
      setFilter({ search: term.trim() || undefined })
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
    // `setFilter` est recréé à chaque rendu : l'inclure relancerait le timer en
    // boucle. Le déclencheur utile est la valeur saisie.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, search.search])

  const applied = useMemo(() => draftFromSearch(search), [search])

  /**
   * Filtres en BROUILLON : les contrôles n'écrivent pas l'URL à chaque
   * changement. « Appliquer » valide le tout en UNE navigation — choisir cinq
   * filtres coûte une requête, pas cinq, et la grille ne s'agite pas sous le
   * panneau pendant que l'utilisateur réfléchit.
   */
  const [draft, setDraft] = useState<FilterDraft>(applied)

  // Réaligne le brouillon à CHAQUE ouverture : sans ça, un panneau fermé par
  // « Annuler » rouvrirait sur les valeurs abandonnées.
  useEffect(() => {
    if (open) setDraft(applied)
  }, [open, applied])

  const activeCount = FILTER_KEYS.filter((key) => applied[key]).length
  const hasAnyFilter = activeCount > 0 || Boolean(search.search)

  const applyDraft = () => {
    setFilter(draft as Partial<PROMOTEUR_SEARCH_T>)
    setOpen(false)
  }

  const clearAll = () => {
    resetFilters()
    setOpen(false)
  }

  return (
    <Card className="flex flex-row items-center justify-between gap-4 bg-white p-4">
      <div className="relative w-full max-w-md">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Rechercher par nom, prénom, email, matricule..."
          className="border-none bg-[#F3F5F8] pl-9"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {/* N'apparaît QUE s'il y a quelque chose à réinitialiser : un bouton
            grisé en permanence est du bruit. */}
        {hasAnyFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="cursor-pointer text-slate-600"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Réinitialiser
          </Button>
        )}

        <Button
          variant={activeCount > 0 ? 'default' : 'outline'}
          size="sm"
          onClick={() => setOpen(true)}
          className={
            activeCount > 0
              ? 'cursor-pointer bg-[#E7722B] font-semibold text-white hover:bg-[#C85E18]'
              : 'cursor-pointer'
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
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        {/* Plus large que les dialogues de formulaire : treize filtres sur deux
            colonnes, avec un corps défilant si la fenêtre est courte. */}
        <DialogContent ref={setPortal} className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-3xl">
          <DialogHeader className="border-b px-6 py-4 text-left">
            <DialogTitle>Filtrer les promoteurs</DialogTitle>
            <DialogDescription>
              Affinez la liste des promoteurs de la plateforme.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
            {FILTER_GROUPS.map((group) => {
              const defs = PROMOTEUR_FILTERS.filter((d) => d.group === group)
              if (!defs.length) return null

              return (
                <section key={group} className="space-y-4">
                  <h3 className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                    {group}
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {defs.map((def) => (
                      <PromoteursFilterField
                        key={def.key}
                        def={def}
                        value={draft[def.key]}
                        onChange={(v) => setDraft((d) => ({ ...d, [def.key]: v }))}
                        container={portal}
                      />
                    ))}
                  </div>
                </section>
              )
            })}
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
    </Card>
  )
}
