import { z } from 'zod'
import type { CADRE_RESULTAT_T } from '@/types/cadreResultat.types'

/**
 * Formulaire « Élément du cadre de résultat » — table `cadres_resultat`.
 *
 * C'est le seul des cinq formulaires du module qui porte une règle
 * STRUCTURELLE : l'élément étant hiérarchique par auto-référence (`parent_cs`),
 * rien dans le SQL n'empêche de fabriquer un cycle. La défense est en DEUX
 * temps, volontairement :
 *
 *  1. `parentsPossibles()` retire de la liste des parents l'élément courant ET
 *     tous ses descendants → le cycle devient INCHOISISSABLE dans l'écran.
 *     C'est la vraie protection : on ne propose pas une option pour la refuser
 *     ensuite.
 *  2. le `.superRefine` ci-dessous refuse l'auto-parentage → filet de sécurité
 *     si une valeur arrivait par un autre chemin (édition d'URL, restauration
 *     d'un brouillon, régression dans la construction de la liste).
 *
 * La protection ultime — un cycle déjà présent en base — est traitée à
 * l'affichage par `construireArbre()` (`src/pages/CadreResultat/constants.ts`).
 */
export const cadreSchema = z
  .object({
    /**
     * Identifiant de l'élément en cours d'ÉDITION — `null` en création.
     *
     * ⚠️ Ce champ n'est PAS une donnée du formulaire et n'est PAS envoyé à
     * l'API (`CADRE_RESULTAT_PAYLOAD_T` ne le contient pas). Il est présent
     * dans les valeurs pour une seule raison : sans lui, le `.superRefine`
     * ci-dessous n'aurait aucun moyen de savoir quel élément on modifie, et la
     * règle « un élément ne peut pas être son propre parent » serait
     * invérifiable au niveau du schéma. Le formulaire le renseigne en champ
     * caché à l'ouverture en édition.
     */
    id_cs: z.number().int().nullable(),
    /**
     * VARCHAR(20) NOT NULL. Ex. « OS1 ».
     * ⚠️ Coquille du schéma conservée : « abgrege » pour « abrégé ».
     */
    abgrege_cs: z
      .string()
      .trim()
      .min(1, "L'abrégé est requis.")
      .max(20, "L'abrégé ne peut pas dépasser 20 caractères."),
    /**
     * VARCHAR(20) NOT NULL UNIQUE. Ex. « S01 ».
     *
     * L'unicité est SIGNALÉE dans le message, pas vérifiée : zod ne voit
     * qu'une ligne. Le refus définitif viendra du serveur ; le message prépare
     * l'utilisateur à le comprendre.
     */
    code_cs: z
      .string()
      .trim()
      .min(1, 'Le code est requis.')
      .max(20, 'Le code ne peut pas dépasser 20 caractères.'),
    /**
     * TEXT NOT NULL — aucune longueur maximale en base, donc aucune ici : la
     * borner inventerait une contrainte que la base ne pose pas.
     * ⚠️ Coquille du schéma conservée : « intutile » pour « intitulé ».
     */
    intutile_cs: z.string().trim().min(1, "L'intitulé est requis."),
    /**
     * DATE NOT NULL DEFAULT CURRENT_DATE.
     *
     * Facultative dans le formulaire : laissée vide, c'est le DEFAULT de la
     * base qui s'applique. L'exiger obligerait à ressaisir une date que le
     * serveur connaît déjà.
     */
    date_enregistrement: z.string().optional(),
    /**
     * VARCHAR(30) NULL — valeurs NON DOCUMENTÉES par le schéma.
     *
     * Saisie texte libre, sans liste d'options : proposer un `<Select>`
     * « Actif / Clôturé / … » fabriquerait un référentiel que le backend n'a
     * jamais défini. Seule la longueur de la colonne est contrôlée.
     */
    etat: z.string().trim().max(30, "L'état ne peut pas dépasser 30 caractères.").optional(),
    /** FK → `niveaux_cadre_resultat(id_nsc)`, NOT NULL. */
    niveau_cs: z
      .number({ message: 'Le niveau est requis.' })
      .int()
      .positive('Le niveau est requis.'),
    /**
     * FK auto-référencée, NULLABLE.
     * `null` = élément RACINE — une valeur métier signifiante, pas une absence
     * de saisie.
     */
    parent_cs: z.number().int().nullable(),
    /**
     * FK → partenaires, NULLABLE.
     * ⚠️ Correspondance retenue : `/organismes` (à confirmer, cf.
     * `referentielsCadreResultat.services.ts`).
     */
    partenaire_cs: z.number().int().nullable(),
  })
  .superRefine((values, ctx) => {
    // Un élément ne peut pas être son propre parent : c'est le cycle le plus
    // court possible, et le seul que le schéma puisse détecter seul (les
    // cycles plus longs demandent de connaître toute la hiérarchie, d'où
    // `parentsPossibles`).
    if (values.id_cs !== null && values.parent_cs !== null && values.parent_cs === values.id_cs) {
      ctx.addIssue({
        code: 'custom',
        path: ['parent_cs'],
        message: 'Un élément ne peut pas être son propre parent.',
      })
    }
  })

export type CadreFormValues = z.infer<typeof cadreSchema>

/**
 * Valeurs initiales du formulaire — mêmes raisons qu'ailleurs de ne pas passer
 * par des `.default()` zod (cf. `NIVEAU_FORM_DEFAULTS`).
 */
export const CADRE_FORM_DEFAULTS: CadreFormValues = {
  id_cs: null,
  abgrege_cs: '',
  code_cs: '',
  intutile_cs: '',
  date_enregistrement: '',
  etat: '',
  niveau_cs: 0,
  parent_cs: null,
  partenaire_cs: null,
}

/* ------------------------------------------------------------------ *
 * Utilitaires de hiérarchie — réutilisables par les écrans            *
 * ------------------------------------------------------------------ */

/**
 * Tous les DESCENDANTS d'un élément (enfants, petits-enfants, etc.).
 *
 * L'élément lui-même n'est PAS inclus : la fonction répond à « qui est en
 * dessous de lui ? », et c'est `parentsPossibles` qui décide d'y ajouter
 * l'élément courant.
 *
 * ⚠️ Parcours en LARGEUR ITÉRATIF avec ensemble de visités. Ce n'est pas une
 * précaution de style : les données peuvent contenir un cycle (aucune
 * contrainte SQL ne l'interdit sur une auto-référence), et une descente
 * récursive naïve boucherait indéfiniment — dans un formulaire, cela fige
 * l'onglet sans le moindre message.
 */
export function collecterDescendants(
  elements: CADRE_RESULTAT_T[],
  idElement: number,
): Set<number> {
  // Index parent → enfants, construit une fois : sans lui, chaque niveau de
  // descente reparcourrait toute la liste.
  const enfantsParParent = new Map<number, number[]>()
  for (const element of elements) {
    if (element.parent_cs === null || element.parent_cs === undefined) continue
    const fratrie = enfantsParParent.get(element.parent_cs)
    if (fratrie) fratrie.push(element.id_cs)
    else enfantsParParent.set(element.parent_cs, [element.id_cs])
  }

  const descendants = new Set<number>()
  const aExplorer: number[] = [idElement]
  // `vus` inclut l'élément de départ : si un cycle ramène jusqu'à lui, on
  // s'arrête au lieu de repartir pour un tour.
  const vus = new Set<number>([idElement])

  while (aExplorer.length > 0) {
    const courant = aExplorer.pop()
    if (courant === undefined) break
    for (const enfant of enfantsParParent.get(courant) ?? []) {
      if (vus.has(enfant)) continue
      vus.add(enfant)
      descendants.add(enfant)
      aExplorer.push(enfant)
    }
  }

  return descendants
}

/**
 * Liste des éléments RÉELLEMENT choisissables comme parent.
 *
 * Trois exclusions, et pas une de plus :
 *  • l'élément courant lui-même (auto-parentage) ;
 *  • tous ses descendants (choisir son propre petit-fils comme parent
 *    fabriquerait un cycle : le sous-arbre se détacherait de la racine et
 *    disparaîtrait de l'affichage) ;
 *  • rien d'autre — en particulier, un élément d'un niveau « inférieur » reste
 *    proposé : le schéma n'impose AUCUNE règle de cohérence entre `niveau_cs`
 *    et la profondeur réelle, et en inventer une interdirait des hiérarchies
 *    que la base accepte.
 *
 * `idElement` vaut `null` en CRÉATION : l'élément n'existe pas encore, il n'a
 * ni descendants ni identité, donc tout est choisissable.
 *
 * L'ordre de la liste reçue est conservé : c'est celui que l'appelant a choisi
 * (souvent la sortie d'`aplatirArbre`, qui donne l'ordre hiérarchique lisible).
 */
export function parentsPossibles(
  elements: CADRE_RESULTAT_T[],
  idElement: number | null,
): CADRE_RESULTAT_T[] {
  if (idElement === null) return elements
  const exclus = collecterDescendants(elements, idElement)
  return elements.filter((element) => element.id_cs !== idElement && !exclus.has(element.id_cs))
}
