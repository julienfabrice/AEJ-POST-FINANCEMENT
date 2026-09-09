import { useMemo, useState, type AriaAttributes } from 'react'
import { projetsServices } from '@/services/projets.services'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { AsyncSearchCombobox, type AsyncComboboxOption } from './AsyncSearchCombobox'

interface MicroProjetComboboxProps {
  /** `0` = aucune sélection (convention des selects numériques du dépôt). */
  value: number
  onChange: (id: number) => void
  /**
   * Micro-projet DÉJÀ lié à la ligne en cours d'édition.
   *
   * `GET /exploitations` et `GET /embauches` embarquent la relation
   * `micro_projet` : on réaffiche donc le projet sélectionné à partir de la
   * ligne, SANS aucune requête supplémentaire. Sans cela, il faudrait aller
   * chercher le projet par son identifiant à l'ouverture de chaque modale.
   */
  projetInitial?: MICRO_PROJET_T | null
  /** Cible du portail — la Dialog qui contient le formulaire. */
  container?: HTMLElement | null
  disabled?: boolean
  /**
   * Injectés par `<FormControl>` (Slot Radix) et RELAYÉS jusqu'au `<input>` :
   * ce composant est une fonction, sans cette déclaration explicite les trois
   * attributs seraient purement et simplement jetés (libellé sans cible,
   * champ sans nom accessible, erreur non signalée à la saisie).
   */
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: AriaAttributes['aria-invalid']
}

/**
 * Libellé d'un micro-projet — « CODE — Intitulé (Prénom Nom du promoteur) ».
 *
 * Reprend `projetLabel` de la maquette (l.5524). La partie promoteur n'apparaît
 * que lorsque la relation est disponible : `GET /projets` l'embarque, mais la
 * relation `micro_projet` portée par une exploitation ou une embauche ne
 * contient PAS le promoteur. On n'invente pas ce que l'API ne donne pas.
 */
const libelleProjet = (projet: MICRO_PROJET_T): string => {
  const promoteur = projet.promoteur
  const identite = promoteur ? ` (${promoteur.prenom} ${promoteur.nom})` : ''
  return `${projet.code} — ${projet.intitule}${identite}`
}

const versOption = (projet: MICRO_PROJET_T): AsyncComboboxOption => ({
  value: String(projet.id),
  label: libelleProjet(projet),
})

/**
 * Sélecteur de micro-projet à RECHERCHE SERVEUR.
 *
 * ARBITRAGE imposé par l'API : la maquette proposait un `<select>` peuplé avec
 * l'intégralité de `DB.projets`. En production, la table compte ~110 000
 * micro-projets — un select complet est impossible. Seul `?search=` filtre
 * réellement côté serveur (`?code=` et `?intitule=` sont ignorés), d'où cette
 * combobox : saisie débouncée envoyée en `search`, lot modeste
 * (`PROJETS_SEARCH_PER_PAGE`, fixé par le service), et mention du total restant.
 */
export function MicroProjetCombobox({
  value,
  onChange,
  projetInitial,
  container,
  disabled,
  id,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}: MicroProjetComboboxProps) {
  const [open, setOpen] = useState(false)
  const [terme, setTerme] = useState('')

  // Requête coupée tant que la liste n'est pas déployée : ouvrir un formulaire
  // ne doit pas interroger 110 000 lignes pour rien.
  const { data, isFetching } = projetsServices.useSearch(terme, open)

  const options = useMemo<AsyncComboboxOption[]>(() => data?.rows.map(versOption) ?? [], [data])

  /**
   * Le projet déjà lié, simplement CONVERTI en option.
   *
   * Sa réinjection dans la liste (indispensable : sans elle Base UI ne
   * retrouve pas la sélection courante et vide le champ dès que la recherche
   * porte sur autre chose) est faite par `AsyncSearchCombobox`, qui applique
   * la même règle à la dernière sélection de l'utilisateur. Ce wrapper ne fait
   * donc plus que la conversion : la règle n'existe qu'à un seul endroit.
   */
  const optionInitiale = useMemo<AsyncComboboxOption | null>(
    () => (projetInitial ? versOption(projetInitial) : null),
    [projetInitial],
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
      placeholder="Rechercher un micro-projet par code ou intitulé…"
      emptyMessage="Aucun micro-projet ne correspond."
      disabled={disabled}
      container={container}
      id={id}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
    />
  )
}
