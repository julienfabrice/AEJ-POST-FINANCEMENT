import { useMemo, useState, type AriaAttributes } from 'react'
import { promoteursServices } from '@/services/promoteurs.services'
import type { PROMOTEUR_EMBAUCHE_T } from '@/types'
import { AsyncSearchCombobox, type AsyncComboboxOption } from './AsyncSearchCombobox'

/** Même lot que la recherche de micro-projets : une combobox n'affiche pas plus. */
const PROMOTEURS_SEARCH_PER_PAGE = 25

interface PromoteurComboboxProps {
  /** `0` = aucune sélection. */
  value: number
  onChange: (id: number) => void
  /**
   * Bénéficiaire DÉJÀ lié à la ligne en cours d'édition — `GET /embauches`
   * embarque la relation `promoteur`, on la réutilise plutôt que de refaire
   * une requête pour retrouver un nom qu'on a déjà.
   */
  promoteurInitial?: PROMOTEUR_EMBAUCHE_T | null
  container?: HTMLElement | null
  disabled?: boolean
  /** Injectés par `<FormControl>` et relayés au `<input>` (cf. `MicroProjetCombobox`). */
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: AriaAttributes['aria-invalid']
}

/**
 * Libellé d'un bénéficiaire — « Prénom Nom · MATRICULE ».
 *
 * La maquette affichait « Prénoms Nom ». Le matricule AEJ est ajouté parce que
 * l'API en compte ~109 990 : deux homonymes sont probables, et le matricule est
 * le seul discriminant que l'utilisateur reconnaisse.
 */
const libellePromoteur = (promoteur: { nom: string; prenom: string; matriculeaej?: string }): string => {
  const identite = `${promoteur.prenom} ${promoteur.nom}`.trim()
  return promoteur.matriculeaej ? `${identite} · ${promoteur.matriculeaej}` : identite
}

const versOption = (promoteur: {
  id: number
  nom: string
  prenom: string
  matriculeaej?: string
}): AsyncComboboxOption => ({
  value: String(promoteur.id),
  label: libellePromoteur(promoteur),
})

/**
 * Sélecteur de bénéficiaire à RECHERCHE SERVEUR.
 *
 * Même raison que pour les micro-projets : `/promoteurs` compte ~109 990
 * lignes, un `<select>` complet est exclu. On réutilise
 * `promoteursServices.useGetPromoteurs`, qui filtre et pagine DÉJÀ côté serveur
 * — aucun nouveau hook de service n'est introduit.
 */
export function PromoteurCombobox({
  value,
  onChange,
  promoteurInitial,
  container,
  disabled,
  id,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}: PromoteurComboboxProps) {
  const [open, setOpen] = useState(false)
  const [terme, setTerme] = useState('')

  // ⚠️ `useGetPromoteurs` n'expose pas de levier `enabled` : contrairement à la
  // recherche de micro-projets, la requête part dès le montage. C'est assumé —
  // elle ne ramène qu'UNE page de 25 lignes, et on préfère cet unique appel à
  // l'introduction d'un hook de service concurrent hors périmètre.
  const { data, isFetching } = promoteursServices.useGetPromoteurs({
    page: 1,
    perPage: PROMOTEURS_SEARCH_PER_PAGE,
    search: terme.trim() || undefined,
  })

  const options = useMemo<AsyncComboboxOption[]>(() => data?.rows.map(versOption) ?? [], [data])

  /** Conversion seule : la réinjection est centralisée dans `AsyncSearchCombobox`. */
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
      placeholder="Rechercher un bénéficiaire par nom ou matricule…"
      emptyMessage="Aucun bénéficiaire ne correspond."
      disabled={disabled}
      container={container}
      id={id}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
    />
  )
}
