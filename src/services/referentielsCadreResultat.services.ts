import { useMemo } from 'react'
import { organismeServices } from '@/services/organismes.services'
import type { REFERENTIEL_CADRE_RESULTAT_T, REFERENTIEL_OPTION_T } from '@/types/cadreResultat.types'

/**
 * CADRE DE RÉSULTAT — résolution des RÉFÉRENTIELS EXTERNES.
 *
 * ══════════════════════════════════════════════════════════════════════
 *  POURQUOI CE FICHIER EXISTE, ET POURQUOI IL EST SEUL
 * ══════════════════════════════════════════════════════════════════════
 * Le schéma du cadre de résultat référence quatre tables qui n'existent NI dans
 * l'API actuelle, NI dans ce dépôt : `programmes`, `structures`,
 * `unites_gestion`, `partenaires`. Quatre clés étrangères qu'il faut pourtant
 * afficher et saisir dès aujourd'hui.
 *
 * Deux mauvaises réponses ont été écartées :
 *  • peupler les sélecteurs de valeurs plausibles — ce serait de la donnée
 *    factice, et un utilisateur y verrait un référentiel réel ;
 *  • éparpiller « le référentiel n'est pas connu » dans chaque formulaire — il
 *    y aurait alors quatre à six endroits à retrouver le jour du branchement.
 *
 * La réponse retenue : TOUT passe par ce fichier, et par lui seul. Chaque hook
 * renvoie la même forme (`REFERENTIEL_CADRE_RESULTAT_T`) :
 *
 *    { options, isLoading, disponible, messageIndisponible }
 *
 * `disponible: false` → le sélecteur est DÉSACTIVÉ et affiche
 * `messageIndisponible`. Il n'est jamais peuplé de valeurs inventées, et il ne
 * ment jamais sur la raison de son inactivité.
 *
 * Le jour où les endpoints réels seront connus, il n'y a QUE ce fichier à
 * modifier : brancher le service, passer `disponible` à `true`, mettre
 * `messageIndisponible` à `null`. Aucun formulaire ne bouge.
 */

/**
 * Référentiel dont la SOURCE n'est pas connue.
 *
 * Construit par une fabrique plutôt que recopié quatre fois : la forme du
 * retour doit rester rigoureusement identique entre les référentiels
 * disponibles et les autres, faute de quoi les sélecteurs se mettraient à
 * diverger dans leur gestion du cas indisponible.
 */
const referentielsIndisponibles = new Map<string, REFERENTIEL_CADRE_RESULTAT_T>()

const referentielIndisponible = (messageIndisponible: string): REFERENTIEL_CADRE_RESULTAT_T => {
  // ⚠️ IDENTITÉ STABLE, et ce n'est pas un détail de style.
  //
  // Un objet littéral neuf à chaque appel — donc à chaque rendu — casse toute
  // la chaîne de mémoïsation en aval : les `useMemo` des grilles qui prennent
  // ce référentiel en dépendance (`programmesParId` dans useNiveauxGrid et
  // useCiblesGrid, entre autres) se recalculeraient à chaque rendu, et les
  // `columnDefs` qui en dérivent seraient recréées, ce qu'AG Grid paie en
  // reconstruisant ses colonnes.
  //
  // On mémoïse donc UNE instance par message, au niveau du module. La Map est
  // bornée par le nombre de messages distincts (trois aujourd'hui), pas par le
  // nombre de rendus : aucune fuite possible.
  const existant = referentielsIndisponibles.get(messageIndisponible)
  if (existant) return existant

  const referentiel: REFERENTIEL_CADRE_RESULTAT_T = {
    options: [],
    isLoading: false,
    disponible: false,
    messageIndisponible,
  }
  referentielsIndisponibles.set(messageIndisponible, referentiel)
  return referentiel
}

/* ------------------------------------------------------------------ *
 * Programmes                                                          *
 * ------------------------------------------------------------------ */

/**
 * `programmes` — CONCEPT NOUVEAU.
 *
 * Référencé par trois colonnes du schéma (`niveaux_cadre_resultat.programme`,
 * `indicateurs_cadre_resultat.programme_istr`,
 * `cibles_indicateur_cadre_resultat.code_programme`), mais la table n'existe
 * nulle part : ni endpoint dans l'API, ni type dans le dépôt, ni écran de
 * gestion. Aucune correspondance plausible n'a pu être identifiée — un
 * « programme » n'est ni un dispositif, ni un guichet, ni un projet au sens du
 * dépôt.
 *
 * ⚠️ S'ajoute l'ambiguïté de la clé : le schéma référence tantôt
 * `programmes(id_programme)` (table 1), tantôt `programmes(code_programme)`
 * (table 4). La colonne cible devra être tranchée en même temps que l'endpoint.
 */
export function useProgrammesOptions(): REFERENTIEL_CADRE_RESULTAT_T {
  return referentielIndisponible(
    "Référentiel « Programmes » non disponible : l'API ne l'expose pas encore.",
  )
}

/* ------------------------------------------------------------------ *
 * Structures                                                          *
 * ------------------------------------------------------------------ */

/**
 * `structures` — SOURCE À DÉTERMINER.
 *
 * Référencé par `indicateurs_cadre_resultat.structure_istr`. Aucune table
 * `structures` dans l'API. Le dépôt contient plusieurs référentiels
 * organisationnels (directions, services, agences régionales, organismes) mais
 * aucun ne porte ce nom, et rien dans le schéma ne dit lequel viser : choisir
 * au jugé produirait un sélecteur qui affiche les bons libellés et enregistre
 * les mauvais identifiants — l'erreur la plus coûteuse à rattraper, car
 * invisible à l'écran.
 */
export function useStructuresOptions(): REFERENTIEL_CADRE_RESULTAT_T {
  return referentielIndisponible(
    "Référentiel « Structures » non disponible : la source n'est pas encore déterminée.",
  )
}

/* ------------------------------------------------------------------ *
 * Unités de gestion                                                   *
 * ------------------------------------------------------------------ */

/**
 * `unites_gestion` — CINQ CANDIDATS, AUCUN ARBITRAGE.
 *
 * Référencé par `cibles_indicateur_cadre_resultat.code_ug` et
 * `suivis_indicateur_cadre_resultat.code_ug`. La page « Unités de gestion » du
 * dépôt (`/admin/unites`) regroupe CINQ référentiels distincts — agences
 * régionales, directions, services, fonctions, guichets — et non un référentiel
 * unique nommé « unités de gestion ». `code_ug` désigne forcément l'un des
 * cinq, mais le schéma ne dit pas lequel, et les identifiants des cinq tables
 * se recouvrent (tous commencent à 1) : un mauvais choix ne provoquerait aucune
 * erreur visible, seulement des rattachements faux.
 *
 * ⚠️ La colonne cible est de surcroît `unites_gestion(code_ug)` — un « code »,
 * pas un « id ». À vérifier au branchement, comme pour `programmes`.
 */
export function useUnitesGestionOptions(): REFERENTIEL_CADRE_RESULTAT_T {
  return referentielIndisponible(
    "Référentiel « Unités de gestion » non disponible : la source n'est pas encore arbitrée.",
  )
}

/* ------------------------------------------------------------------ *
 * Partenaires                                                         *
 * ------------------------------------------------------------------ */

/**
 * `partenaires` — CORRESPONDANCE RETENUE : `/organismes`.
 *
 * Référencé par `cadres_resultat.partenaire_cs`. C'est le SEUL des quatre
 * référentiels pour lequel une correspondance s'impose : la page
 * « Partenaires financiers » du dépôt gère la ressource `/organismes`
 * (`ORGANISME_FINANCEMENT_T`), qui est bien le registre des partenaires de
 * l'AEJ. On la branche donc dès maintenant — le sélecteur est actif et
 * fonctionnel avant même que l'API du cadre de résultat n'existe.
 *
 * ⚠️ À CONFIRMER tout de même : c'est une correspondance déduite, pas une
 * information du commanditaire. Si le backend crée une table `partenaires`
 * distincte des organismes de financement, seule cette fonction change.
 *
 * Le libellé reprend la forme des autres sélecteurs d'organismes du dépôt :
 * « Nom (SIGLE) », et le nom seul quand le sigle est absent — un
 * « Nom () » orphelin serait un artefact d'affichage.
 */
export function usePartenairesOptions(): REFERENTIEL_CADRE_RESULTAT_T {
  const { data, isLoading } = organismeServices.useGetAll()

  const options = useMemo<REFERENTIEL_OPTION_T[]>(
    () =>
      (data ?? []).map((organisme) => ({
        value: organisme.id,
        label: organisme.sigle?.trim()
          ? `${organisme.nom} (${organisme.sigle})`
          : organisme.nom,
      })),
    [data],
  )

  return { options, isLoading, disponible: true, messageIndisponible: null }
}

/* ------------------------------------------------------------------ *
 * Agrégat                                                             *
 * ------------------------------------------------------------------ */

/** Les quatre référentiels externes du module, dans une seule structure. */
export interface REFERENTIELS_CADRE_RESULTAT_T {
  programmes: REFERENTIEL_CADRE_RESULTAT_T
  structures: REFERENTIEL_CADRE_RESULTAT_T
  unitesGestion: REFERENTIEL_CADRE_RESULTAT_T
  partenaires: REFERENTIEL_CADRE_RESULTAT_T
}

/**
 * Hook de confort : les quatre référentiels d'un coup.
 *
 * C'est la porte d'entrée normale des formulaires, qui en utilisent souvent
 * deux ou trois. Les hooks unitaires restent exportés pour un formulaire qui
 * n'en voudrait qu'un — appeler les quatre coûterait alors une requête
 * `/organismes` inutile.
 */
export function useReferentielsCadreResultat(): REFERENTIELS_CADRE_RESULTAT_T {
  return {
    programmes: useProgrammesOptions(),
    structures: useStructuresOptions(),
    unitesGestion: useUnitesGestionOptions(),
    partenaires: usePartenairesOptions(),
  }
}

/**
 * Regroupement en objet, à l'image des autres `xxxServices` du dépôt.
 * Même contenu que les fonctions exportées ci-dessus : deux façons d'importer,
 * une seule implémentation.
 */
export const referentielsCadreResultatServices = {
  useProgrammes: useProgrammesOptions,
  useStructures: useStructuresOptions,
  useUnitesGestion: useUnitesGestionOptions,
  usePartenaires: usePartenairesOptions,
  useTous: useReferentielsCadreResultat,
}
