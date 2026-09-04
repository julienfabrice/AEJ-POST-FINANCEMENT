import { useMemo } from 'react'
import {
  cadreResultatServices,
  indicateurCadreResultatServices,
  niveauCadreResultatServices,
} from '@/services/cadreResultat.services'
import { parentsPossibles } from '@/schema/cadre-resultat/cadreSchema'
import type { REFERENTIEL_CADRE_RESULTAT_T, REFERENTIEL_OPTION_T } from '@/types'
import {
  CADRE_RESULTAT_API_PRETE,
  MESSAGE_SELECTEUR_API_NON_BRANCHEE,
  aplatirArbre,
  construireArbre,
} from '../constants'

/**
 * CADRE DE RÉSULTAT — sélecteurs alimentés par les ressources DU MODULE.
 *
 * ══════════════════════════════════════════════════════════════════════
 *  POURQUOI CE FICHIER EXISTE À CÔTÉ DE `referentielsCadreResultat.services`
 * ══════════════════════════════════════════════════════════════════════
 * Les formulaires du module ont besoin de DEUX familles de sélecteurs :
 *
 *  • les référentiels EXTERNES (`programmes`, `structures`, `unites_gestion`,
 *    `partenaires`) — sources inconnues ou à confirmer, traitées dans
 *    `src/services/referentielsCadreResultat.services.ts` ;
 *  • les référentiels INTERNES (niveaux, éléments du cadre, indicateurs) —
 *    sources parfaitement connues, ce sont trois des cinq endpoints du module.
 *    C'est l'objet de ce fichier.
 *
 * Les deux familles produisent le MÊME type (`REFERENTIEL_CADRE_RESULTAT_T`) et
 * se branchent sur le MÊME composant (`ReferentielSelect`). C'est ce qui permet
 * à une modale de traiter uniformément ses six ou sept sélecteurs sans savoir
 * lesquels sont externes — et ce qui garantit qu'aucun d'eux ne se peuplera
 * jamais de valeurs inventées : un référentiel indisponible désactive son
 * sélecteur et en affiche la raison, quelle que soit la famille.
 *
 * ⚠️ `disponible` porte ici `CADRE_RESULTAT_API_PRETE`. Tant que le drapeau est
 * bas, les trois listes sont vides (les `useQuery` sont `enabled: false`) : un
 * sélecteur ACTIF sur une liste vide se lirait comme « ce référentiel ne
 * contient rien », c'est-à-dire comme une information sur les données, alors
 * qu'il ne s'agit que d'un branchement en attente. On le désactive donc en le
 * disant. Le jour du branchement, le drapeau lève les trois sélecteurs d'un
 * coup, sans autre modification.
 */

/* ------------------------------------------------------------------ *
 * Niveaux                                                             *
 * ------------------------------------------------------------------ */

/**
 * Niveaux hiérarchiques (« Axe », « Effet », « Produit »…).
 *
 * Libellé « Libellé (code) » : deux programmes peuvent réutiliser le même
 * `code_number_nsc` (l'unicité est conjointe avec `programme`), et deux
 * libellés identiques sont donc possibles dans la liste. Le code les
 * départage ; l'afficher seul serait au contraire illisible.
 */
export function useNiveauxOptions(): REFERENTIEL_CADRE_RESULTAT_T {
  const { data = [], isLoading } = niveauCadreResultatServices.useGetAll()

  const options = useMemo<REFERENTIEL_OPTION_T[]>(
    () =>
      data
        // Tri sur `nombre_nsc`, qui EST l'ordre hiérarchique du référentiel
        // (« Axe » avant « Effet » avant « Produit ») : l'ordre de la liste
        // reçue n'est pas garanti, et un référentiel de niveaux présenté dans
        // le désordre est difficilement lisible.
        .slice()
        .sort((a, b) => a.nombre_nsc - b.nombre_nsc)
        .map((niveau) => ({
          value: niveau.id_nsc,
          label: `${niveau.libelle_nsc} (${niveau.code_number_nsc})`,
        })),
    [data],
  )

  return {
    options,
    isLoading,
    disponible: CADRE_RESULTAT_API_PRETE,
    messageIndisponible: CADRE_RESULTAT_API_PRETE ? null : MESSAGE_SELECTEUR_API_NON_BRANCHEE,
  }
}

/* ------------------------------------------------------------------ *
 * Éléments du cadre                                                   *
 * ------------------------------------------------------------------ */

/**
 * Éléments du cadre, dans l'ORDRE HIÉRARCHIQUE et non dans l'ordre reçu.
 *
 * `construireArbre` + `aplatirArbre` produisent le parcours préfixe (un parent,
 * puis ses descendants) : c'est le seul ordre dans lequel une liste plate reste
 * lisible pour choisir un rattachement. Le libellé est préfixé de tirets
 * cadratins proportionnels à la profondeur — un `<SelectItem>` ne peut pas
 * porter d'indentation structurelle sans composant sur mesure, et le tiret est
 * la convention textuelle usuelle pour cela.
 *
 * `idElement` permet d'écarter l'élément en cours d'édition ET tous ses
 * descendants (`parentsPossibles`) : c'est la protection RÉELLE contre les
 * cycles, celle qui rend le cycle inchoisissable au lieu de le refuser après
 * coup. `null` en création — l'élément n'existe pas encore, tout est
 * choisissable.
 */
export function useCadresOptions(idElement: number | null = null): REFERENTIEL_CADRE_RESULTAT_T {
  const { data = [], isLoading } = cadreResultatServices.useGetAll()

  const options = useMemo<REFERENTIEL_OPTION_T[]>(() => {
    const ordonnes = aplatirArbre(construireArbre(data))
    return parentsPossibles(ordonnes, idElement).map((element) => {
      // `profondeur` n'existe que sur les nœuds issus de `construireArbre` ;
      // `parentsPossibles` retourne le type de base, d'où la relecture
      // défensive plutôt qu'un transtypage.
      const profondeur =
        'profondeur' in element && typeof element.profondeur === 'number'
          ? element.profondeur
          : 0
      return {
        value: element.id_cs,
        label: `${'— '.repeat(Math.max(0, profondeur))}${element.abgrege_cs} · ${element.intutile_cs}`,
      }
    })
  }, [data, idElement])

  return {
    options,
    isLoading,
    disponible: CADRE_RESULTAT_API_PRETE,
    messageIndisponible: CADRE_RESULTAT_API_PRETE ? null : MESSAGE_SELECTEUR_API_NON_BRANCHEE,
  }
}

/* ------------------------------------------------------------------ *
 * Indicateurs                                                         *
 * ------------------------------------------------------------------ */

/**
 * Indicateurs du cadre — cible des clés étrangères des tables « cibles » et
 * « suivis ».
 *
 * ⚠️ La `value` est `id_indicateur_str` (la CLÉ PRIMAIRE ENTIÈRE) et non
 * `code_indicateur_istr` (le code métier textuel « R002 ») : les colonnes
 * `code_indicateur_istr` des tables 4 et 5 portent un ENTIER référençant
 * `id_indicateur_str`, malgré leur nom identique à celui du code textuel de la
 * table 3. Se tromper de champ ici produirait des rattachements silencieusement
 * faux — c'est le piège de nommage le plus coûteux du schéma.
 *
 * Le libellé montre les deux (« R002 · Intitulé ») : le code est ce que
 * l'utilisateur connaît, l'intitulé ce qui le rend identifiable.
 */
export function useIndicateursOptions(): REFERENTIEL_CADRE_RESULTAT_T {
  const { data = [], isLoading } = indicateurCadreResultatServices.useGetAll()

  const options = useMemo<REFERENTIEL_OPTION_T[]>(
    () =>
      data.map((indicateur) => ({
        value: indicateur.id_indicateur_str,
        label: `${indicateur.code_indicateur_istr} · ${indicateur.intitule_indicateur_istr}`,
      })),
    [data],
  )

  return {
    options,
    isLoading,
    disponible: CADRE_RESULTAT_API_PRETE,
    messageIndisponible: CADRE_RESULTAT_API_PRETE ? null : MESSAGE_SELECTEUR_API_NON_BRANCHEE,
  }
}
