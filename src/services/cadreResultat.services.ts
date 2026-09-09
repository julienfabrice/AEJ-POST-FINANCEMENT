import { useMutation, useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axiosInstance } from '@/constants/axiosInstance'
import { toDateOnly } from '@/helpers/age'
import {
  CADRE_RESULTAT_API_PRETE,
  CADRE_RESULTAT_ENDPOINTS,
  CADRE_RESULTAT_QUERY_ROOT,
  MESSAGE_ECRITURE_INDISPONIBLE,
} from '@/pages/CadreResultat/constants'
import type { API_RESPONSE_T } from '@/types'
import type {
  CADRE_RESULTAT_T,
  CIBLE_INDICATEUR_T,
  INDICATEUR_CADRE_RESULTAT_T,
  NIVEAU_CADRE_RESULTAT_T,
  SUIVI_INDICATEUR_T,
} from '@/types/cadreResultat.types'

/**
 * CADRE DE RÉSULTAT — services des cinq ressources.
 *
 * ══════════════════════════════════════════════════════════════════════
 *  API NON ENCORE BRANCHÉE — implémentation du dispositif
 * ══════════════════════════════════════════════════════════════════════
 * Le drapeau `CADRE_RESULTAT_API_PRETE` (défini dans
 * `src/pages/CadreResultat/constants.ts`, avec sa justification complète) est
 * lu ICI et NULLE PART AILLEURS dans la couche données. Les appels axios sont
 * écrits en entier, exactement comme s'ils fonctionnaient : le jour du
 * branchement, passer le drapeau à `true` suffit.
 *
 *  • LECTURES  (`useListeCadreResultat`, `useDetailCadreResultat`) —
 *    `enabled: CADRE_RESULTAT_API_PRETE`. TanStack Query n'émet alors AUCUNE
 *    requête : pas de 404 en rafale dans la console, pas de retry, pas d'état
 *    d'erreur. Une donnée initiale de tableau vide est fournie dans ce cas
 *    précis, pour que les grilles reçoivent `[]` plutôt qu'`undefined` et
 *    affichent leur état vide normal plutôt qu'un squelette qui ne s'arrête
 *    jamais.
 *
 *  • ÉCRITURES (`useCreationCadreResultat`, `useModificationCadreResultat`,
 *    `useSuppressionCadreResultat`) — la `mutationFn` sort AVANT axios, affiche
 *    un toast d'information et renvoie `null`. `onSuccess` reconnaît ce `null`
 *    et n'invalide RIEN : aucun cache n'est touché, aucune ligne fantôme
 *    n'apparaît dans la grille.
 *
 * Les cinq objets exportés (`niveauCadreResultatServices`,
 * `cadreResultatServices`, `indicateurCadreResultatServices`,
 * `cibleIndicateurServices`, `suiviIndicateurServices`) suivent la forme
 * habituelle du dépôt : `useGetAll / useGetOne / useCreate / useUpdate /
 * useDelete`, invalidations + toasts sonner en français.
 */

/* ------------------------------------------------------------------ *
 * Clés de cache                                                       *
 * ------------------------------------------------------------------ */

/**
 * Toutes les clés du module sont préfixées par `'cadre-resultat'` : les cinq
 * ressources s'invalident indépendamment, mais restent invalidables d'un bloc.
 */
export const CADRE_RESULTAT_QUERY_KEYS = {
  niveaux: [CADRE_RESULTAT_QUERY_ROOT, 'niveaux'] as const,
  cadres: [CADRE_RESULTAT_QUERY_ROOT, 'cadres'] as const,
  indicateurs: [CADRE_RESULTAT_QUERY_ROOT, 'indicateurs'] as const,
  cibles: [CADRE_RESULTAT_QUERY_ROOT, 'cibles'] as const,
  suivis: [CADRE_RESULTAT_QUERY_ROOT, 'suivis'] as const,
} as const

/* ------------------------------------------------------------------ *
 * Normalisations communes aux cinq ressources                         *
 * ------------------------------------------------------------------ */

/**
 * Texte optionnel → texte élagué ou `null`.
 *
 * Même règle que dans `exploitations.services.ts` : un champ laissé vide est
 * une ABSENCE de valeur, pas une chaîne vide. Sans cela la grille afficherait
 * « » là où le « — » est attendu, et une colonne NULLABLE se remplirait de
 * chaînes vides indiscernables d'une saisie réelle.
 */
const toTexte = (valeur: string | null | undefined): string | null => {
  const elague = valeur?.trim()
  return elague ? elague : null
}

/**
 * Valeur numérique saisie → nombre ou `null`.
 *
 * La virgule décimale est acceptée : c'est le séparateur naturel d'une saisie
 * francophone (« 1 250,50 »). Les espaces — y compris l'espace insécable que
 * produit un copier-coller depuis un tableur formaté en français — sont retirés
 * avant conversion, faute de quoi « 1 250 » deviendrait `NaN`.
 */
const toNombre = (valeur: string | number | null | undefined): number | null => {
  if (valeur === null || valeur === undefined) return null
  if (typeof valeur === 'number') return Number.isFinite(valeur) ? valeur : null
  const normalise = valeur.replace(/[\s\u00A0\u202F]/g, '').replace(',', '.')
  if (!normalise) return null
  const converti = Number(normalise)
  return Number.isFinite(converti) ? converti : null
}

/**
 * Clé étrangère saisie → identifiant ou `null`.
 *
 * Les `<Select>` du dépôt utilisent `0` comme valeur « aucune sélection ». Un
 * `0` envoyé à une règle Laravel `exists:` serait refusé ; on le convertit donc
 * en `null`, seule forme acceptable pour une FK nullable.
 */
const toCle = (valeur: number | null | undefined): number | null =>
  valeur !== null && valeur !== undefined && Number.isFinite(valeur) && valeur > 0 ? valeur : null

/**
 * Année saisie → date du 1er janvier (« AAAA-01-01 »), ou `null`.
 *
 * Pourquoi cette conversion existe : la colonne `annee` de
 * `cibles_indicateur_cadre_resultat` est de type DATE, pas INTEGER — le schéma
 * donne « 2019-01-01 » en exemple. Or ce que l'utilisateur saisit et ce que la
 * grille affiche, c'est une ANNÉE. La traduction entre les deux appartient au
 * service, jamais au formulaire : c'est le seul endroit qui connaît la forme
 * exigée par l'API.
 *
 * Les deux formes sont acceptées en entrée : une année seule (« 2019 », 2019)
 * et une date déjà complète, que la relecture d'une ligne renverra au format
 * ISO (« 2019-01-01T00:00:00.000000Z ») — auquel cas on se contente d'en
 * extraire la partie calendaire.
 */
const toAnnee = (valeur: string | number | null | undefined): string | null => {
  if (valeur === null || valeur === undefined) return null
  const brut = String(valeur).trim()
  if (!brut) return null
  if (/^\d{4}$/.test(brut)) return `${brut}-01-01`
  return toDateOnly(brut)
}

/* ------------------------------------------------------------------ *
 * Fabriques génériques — le dispositif « API non branchée » vit ici   *
 * ------------------------------------------------------------------ */

/**
 * Liste d'une ressource du module.
 *
 * `enabled` porte le drapeau : aucune requête n'est émise tant que l'API n'est
 * pas branchée. `initialData` fournit alors `[]`, et retourne `undefined` une
 * fois le drapeau levé — TanStack Query traite `undefined` comme « pas de
 * donnée initiale » et déclenche le chargement normal. Le comportement bascule
 * donc entièrement sur la valeur du drapeau, sans autre modification.
 */
function useListeCadreResultat<T>(queryKey: QueryKey, chemin: string) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await axiosInstance.get<API_RESPONSE_T<T[]>>(chemin)
      return data.data
    },
    enabled: CADRE_RESULTAT_API_PRETE,
    initialData: () => (CADRE_RESULTAT_API_PRETE ? undefined : ([] as T[])),
  })
}

/**
 * Détail d'une ressource du module.
 *
 * Double condition sur `enabled` : le drapeau ET un identifiant non nul —
 * exactement le `enabled: !!id` des autres services du dépôt, auquel s'ajoute
 * la garde du module.
 */
function useDetailCadreResultat<T>(queryKey: QueryKey, chemin: string, id: number | null) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await axiosInstance.get<API_RESPONSE_T<T>>(`${chemin}/${id}`)
      return data.data
    },
    enabled: CADRE_RESULTAT_API_PRETE && !!id,
  })
}

/** Messages de toast d'une ressource — un jeu par ressource, en français. */
interface MESSAGES_MUTATION_T {
  succesCreation: string
  succesModification: string
  succesSuppression: string
  erreurCreation: string
  erreurModification: string
  erreurSuppression: string
}

/**
 * Sentinelle renvoyée par une mutation qui n'a PAS appelé l'API.
 *
 * Un objet dédié plutôt qu'un simple `null` : `onSuccess` doit distinguer sans
 * ambiguïté « l'API n'est pas branchée, ne touche à rien » d'une réponse
 * serveur vide (204), qui, elle, doit bien invalider le cache.
 */
const ECRITURE_IGNOREE = { __cadreResultatApiNonBranchee: true } as const
type EcritureIgnoree = typeof ECRITURE_IGNOREE

const estEcritureIgnoree = (resultat: unknown): resultat is EcritureIgnoree =>
  typeof resultat === 'object' &&
  resultat !== null &&
  '__cadreResultatApiNonBranchee' in resultat

/**
 * Création d'une ressource du module.
 *
 * Tant que le drapeau est bas : aucun appel axios, un toast d'information, et
 * `onSuccess` qui n'invalide RIEN. La saisie de l'utilisateur n'est pas
 * silencieusement perdue — elle est explicitement annoncée comme différée.
 */
function useCreationCadreResultat<P>(options: {
  queryKey: QueryKey
  chemin: string
  normaliser: (payload: P) => Record<string, unknown>
  messages: MESSAGES_MUTATION_T
}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: P) => {
      if (!CADRE_RESULTAT_API_PRETE) {
        toast.info(MESSAGE_ECRITURE_INDISPONIBLE)
        return ECRITURE_IGNOREE
      }
      const response = await axiosInstance.post(options.chemin, options.normaliser(payload))
      return response.data
    },
    onSuccess: (resultat) => {
      if (estEcritureIgnoree(resultat)) return
      queryClient.invalidateQueries({ queryKey: options.queryKey })
      toast.success(options.messages.succesCreation)
    },
    onError: (error) => {
      toast.error(options.messages.erreurCreation)
      console.error(error)
    },
  })
}

/** Modification d'une ressource du module — même dispositif que la création. */
function useModificationCadreResultat<P>(options: {
  queryKey: QueryKey
  chemin: string
  normaliser: (payload: P) => Record<string, unknown>
  messages: MESSAGES_MUTATION_T
}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: P }) => {
      if (!CADRE_RESULTAT_API_PRETE) {
        toast.info(MESSAGE_ECRITURE_INDISPONIBLE)
        return ECRITURE_IGNOREE
      }
      const response = await axiosInstance.put(
        `${options.chemin}/${id}`,
        options.normaliser(data),
      )
      return response.data
    },
    onSuccess: (resultat) => {
      if (estEcritureIgnoree(resultat)) return
      queryClient.invalidateQueries({ queryKey: options.queryKey })
      toast.success(options.messages.succesModification)
    },
    onError: (error) => {
      toast.error(options.messages.erreurModification)
      console.error(error)
    },
  })
}

/** Suppression d'une ressource du module — même dispositif que la création. */
function useSuppressionCadreResultat(options: {
  queryKey: QueryKey
  chemin: string
  messages: MESSAGES_MUTATION_T
}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      if (!CADRE_RESULTAT_API_PRETE) {
        toast.info(MESSAGE_ECRITURE_INDISPONIBLE)
        return ECRITURE_IGNOREE
      }
      await axiosInstance.delete(`${options.chemin}/${id}`)
      return null
    },
    onSuccess: (resultat) => {
      if (estEcritureIgnoree(resultat)) return
      queryClient.invalidateQueries({ queryKey: options.queryKey })
      toast.success(options.messages.succesSuppression)
    },
    onError: (error) => {
      toast.error(options.messages.erreurSuppression)
      console.error(error)
    },
  })
}

/* ================================================================== *
 * 1. Niveaux du cadre de résultat                                     *
 * ================================================================== */

/**
 * Charge utile d'écriture d'un niveau.
 *
 * Plus tolérante que la ressource : le formulaire produit des chaînes, y
 * compris pour `nombre_nsc`, que `<input type="number">` renvoie en texte dès
 * que le champ est vidé puis ressaisi. `toApiPayload` remet tout en forme.
 */
export interface NIVEAU_CADRE_RESULTAT_PAYLOAD_T {
  code_number_nsc: string
  libelle_nsc: string
  nombre_nsc: number | string
  /** Référentiel inconnu (cf. types) : reste facultatif côté formulaire. */
  programme?: number | null
  type_niveau: string
}

/**
 * `type_niveau` est envoyé en CHAÎNE et non converti en nombre : la colonne est
 * un VARCHAR(10), et le schéma n'en donne que des exemples numériques (« 1 »,
 * « 2 »). Convertir imposerait une contrainte que la base ne pose pas.
 */
function toNiveauApiPayload(payload: NIVEAU_CADRE_RESULTAT_PAYLOAD_T): Record<string, unknown> {
  return {
    code_number_nsc: payload.code_number_nsc.trim(),
    libelle_nsc: payload.libelle_nsc.trim(),
    nombre_nsc: toNombre(payload.nombre_nsc) ?? 0,
    programme: toCle(payload.programme),
    type_niveau: payload.type_niveau.trim(),
  }
}

const MESSAGES_NIVEAU: MESSAGES_MUTATION_T = {
  succesCreation: 'Niveau enregistré avec succès !',
  succesModification: 'Niveau modifié avec succès !',
  succesSuppression: 'Niveau supprimé avec succès !',
  erreurCreation: "Erreur lors de l'enregistrement du niveau.",
  erreurModification: 'Erreur lors de la modification du niveau.',
  erreurSuppression: 'Erreur lors de la suppression du niveau.',
}

export const niveauCadreResultatServices = {
  useGetAll: () =>
    useListeCadreResultat<NIVEAU_CADRE_RESULTAT_T>(
      CADRE_RESULTAT_QUERY_KEYS.niveaux,
      CADRE_RESULTAT_ENDPOINTS.niveaux,
    ),
  useGetOne: (id: number | null) =>
    useDetailCadreResultat<NIVEAU_CADRE_RESULTAT_T>(
      [...CADRE_RESULTAT_QUERY_KEYS.niveaux, id],
      CADRE_RESULTAT_ENDPOINTS.niveaux,
      id,
    ),
  useCreate: () =>
    useCreationCadreResultat<NIVEAU_CADRE_RESULTAT_PAYLOAD_T>({
      queryKey: CADRE_RESULTAT_QUERY_KEYS.niveaux,
      chemin: CADRE_RESULTAT_ENDPOINTS.niveaux,
      normaliser: toNiveauApiPayload,
      messages: MESSAGES_NIVEAU,
    }),
  useUpdate: () =>
    useModificationCadreResultat<NIVEAU_CADRE_RESULTAT_PAYLOAD_T>({
      queryKey: CADRE_RESULTAT_QUERY_KEYS.niveaux,
      chemin: CADRE_RESULTAT_ENDPOINTS.niveaux,
      normaliser: toNiveauApiPayload,
      messages: MESSAGES_NIVEAU,
    }),
  useDelete: () =>
    useSuppressionCadreResultat({
      queryKey: CADRE_RESULTAT_QUERY_KEYS.niveaux,
      chemin: CADRE_RESULTAT_ENDPOINTS.niveaux,
      messages: MESSAGES_NIVEAU,
    }),
}

/* ================================================================== *
 * 2. Éléments du cadre de résultat                                    *
 * ================================================================== */

/**
 * Charge utile d'écriture d'un élément du cadre.
 *
 * `date_modification` n'y figure PAS : le schéma la décrit comme la date de
 * modification de la ligne, donc une donnée SERVEUR. La laisser saisir
 * permettrait d'antidater une modification.
 *
 * `date_enregistrement` reste facultative : la base a un
 * `DEFAULT CURRENT_DATE`, mais une reprise d'historique peut vouloir la fixer.
 */
export interface CADRE_RESULTAT_PAYLOAD_T {
  /** ⚠️ Coquille du schéma conservée : « abgrege » pour « abrégé ». */
  abgrege_cs: string
  code_cs: string
  /** ⚠️ Coquille du schéma conservée : « intutile » pour « intitulé ». */
  intutile_cs: string
  date_enregistrement?: string | null
  etat?: string | null
  niveau_cs: number
  parent_cs?: number | null
  partenaire_cs?: number | null
}

function toCadreApiPayload(payload: CADRE_RESULTAT_PAYLOAD_T): Record<string, unknown> {
  return {
    abgrege_cs: payload.abgrege_cs.trim(),
    code_cs: payload.code_cs.trim(),
    intutile_cs: payload.intutile_cs.trim(),
    date_enregistrement: toDateOnly(payload.date_enregistrement),
    etat: toTexte(payload.etat),
    niveau_cs: payload.niveau_cs,
    // `null` = élément RACINE : c'est une valeur métier signifiante, pas une
    // absence de saisie. Elle doit donc être envoyée explicitement.
    parent_cs: toCle(payload.parent_cs),
    partenaire_cs: toCle(payload.partenaire_cs),
  }
}

const MESSAGES_CADRE: MESSAGES_MUTATION_T = {
  succesCreation: 'Élément du cadre enregistré avec succès !',
  succesModification: 'Élément du cadre modifié avec succès !',
  succesSuppression: 'Élément du cadre supprimé avec succès !',
  erreurCreation: "Erreur lors de l'enregistrement de l'élément du cadre.",
  erreurModification: "Erreur lors de la modification de l'élément du cadre.",
  erreurSuppression: "Erreur lors de la suppression de l'élément du cadre.",
}

export const cadreResultatServices = {
  useGetAll: () =>
    useListeCadreResultat<CADRE_RESULTAT_T>(
      CADRE_RESULTAT_QUERY_KEYS.cadres,
      CADRE_RESULTAT_ENDPOINTS.cadres,
    ),
  useGetOne: (id: number | null) =>
    useDetailCadreResultat<CADRE_RESULTAT_T>(
      [...CADRE_RESULTAT_QUERY_KEYS.cadres, id],
      CADRE_RESULTAT_ENDPOINTS.cadres,
      id,
    ),
  useCreate: () =>
    useCreationCadreResultat<CADRE_RESULTAT_PAYLOAD_T>({
      queryKey: CADRE_RESULTAT_QUERY_KEYS.cadres,
      chemin: CADRE_RESULTAT_ENDPOINTS.cadres,
      normaliser: toCadreApiPayload,
      messages: MESSAGES_CADRE,
    }),
  useUpdate: () =>
    useModificationCadreResultat<CADRE_RESULTAT_PAYLOAD_T>({
      queryKey: CADRE_RESULTAT_QUERY_KEYS.cadres,
      chemin: CADRE_RESULTAT_ENDPOINTS.cadres,
      normaliser: toCadreApiPayload,
      messages: MESSAGES_CADRE,
    }),
  useDelete: () =>
    useSuppressionCadreResultat({
      queryKey: CADRE_RESULTAT_QUERY_KEYS.cadres,
      chemin: CADRE_RESULTAT_ENDPOINTS.cadres,
      messages: MESSAGES_CADRE,
    }),
}

/* ================================================================== *
 * 3. Indicateurs du cadre de résultat                                 *
 * ================================================================== */

export interface INDICATEUR_CADRE_RESULTAT_PAYLOAD_T {
  /** VARCHAR(30) UNIQUE — code métier TEXTUEL (« R002 »), pas un identifiant. */
  code_indicateur_istr: string
  intitule_indicateur_istr: string
  description_istr?: string | null
  /** FK vers l'élément du cadre (`cadres_resultat.id_cs`). */
  code_istr: number
  /** ⚠️ FK ou simple entier ? Question ouverte du schéma : saisie numérique. */
  niveau_istr?: number | string | null
  programme_istr?: number | null
  structure_istr?: number | null
  periodicite_iop?: string | null
  responsable_istr?: string | null
  source_istr?: string | null
}

/**
 * `niveau_istr` passe par `toNombre` et non par `toCle` : tant que la question
 * « FK ou simple entier ? » n'est pas tranchée, rien ne dit qu'un `0` y soit
 * illégitime. On convertit donc sans filtrer sur la positivité — seul le vide
 * devient `null`.
 */
function toIndicateurApiPayload(
  payload: INDICATEUR_CADRE_RESULTAT_PAYLOAD_T,
): Record<string, unknown> {
  return {
    code_indicateur_istr: payload.code_indicateur_istr.trim(),
    intitule_indicateur_istr: payload.intitule_indicateur_istr.trim(),
    description_istr: toTexte(payload.description_istr),
    code_istr: payload.code_istr,
    niveau_istr: toNombre(payload.niveau_istr),
    programme_istr: toCle(payload.programme_istr),
    structure_istr: toCle(payload.structure_istr),
    periodicite_iop: toTexte(payload.periodicite_iop),
    responsable_istr: toTexte(payload.responsable_istr),
    source_istr: toTexte(payload.source_istr),
  }
}

const MESSAGES_INDICATEUR: MESSAGES_MUTATION_T = {
  succesCreation: 'Indicateur enregistré avec succès !',
  succesModification: 'Indicateur modifié avec succès !',
  succesSuppression: 'Indicateur supprimé avec succès !',
  erreurCreation: "Erreur lors de l'enregistrement de l'indicateur.",
  erreurModification: "Erreur lors de la modification de l'indicateur.",
  erreurSuppression: "Erreur lors de la suppression de l'indicateur.",
}

export const indicateurCadreResultatServices = {
  useGetAll: () =>
    useListeCadreResultat<INDICATEUR_CADRE_RESULTAT_T>(
      CADRE_RESULTAT_QUERY_KEYS.indicateurs,
      CADRE_RESULTAT_ENDPOINTS.indicateurs,
    ),
  useGetOne: (id: number | null) =>
    useDetailCadreResultat<INDICATEUR_CADRE_RESULTAT_T>(
      [...CADRE_RESULTAT_QUERY_KEYS.indicateurs, id],
      CADRE_RESULTAT_ENDPOINTS.indicateurs,
      id,
    ),
  useCreate: () =>
    useCreationCadreResultat<INDICATEUR_CADRE_RESULTAT_PAYLOAD_T>({
      queryKey: CADRE_RESULTAT_QUERY_KEYS.indicateurs,
      chemin: CADRE_RESULTAT_ENDPOINTS.indicateurs,
      normaliser: toIndicateurApiPayload,
      messages: MESSAGES_INDICATEUR,
    }),
  useUpdate: () =>
    useModificationCadreResultat<INDICATEUR_CADRE_RESULTAT_PAYLOAD_T>({
      queryKey: CADRE_RESULTAT_QUERY_KEYS.indicateurs,
      chemin: CADRE_RESULTAT_ENDPOINTS.indicateurs,
      normaliser: toIndicateurApiPayload,
      messages: MESSAGES_INDICATEUR,
    }),
  useDelete: () =>
    useSuppressionCadreResultat({
      queryKey: CADRE_RESULTAT_QUERY_KEYS.indicateurs,
      chemin: CADRE_RESULTAT_ENDPOINTS.indicateurs,
      messages: MESSAGES_INDICATEUR,
    }),
}

/* ================================================================== *
 * 4. Cibles annuelles                                                 *
 * ================================================================== */

export interface CIBLE_INDICATEUR_PAYLOAD_T {
  /** Année saisie (« 2019 » ou 2019) — convertie en date par le service. */
  annee: string | number
  /** ⚠️ Coquille du schéma conservée : « indcateur » pour « indicateur ». */
  valeur_cible_indcateur_istr: string | number
  /** FK NUMÉRIQUE vers `indicateurs_cadre_resultat.id_indicateur_str`. */
  code_indicateur_istr: number
  /** ⚠️ Cible de FK ambiguë (id_programme / code_programme) : cf. types. */
  code_programme: number
  code_ug?: number | null
}

function toCibleApiPayload(payload: CIBLE_INDICATEUR_PAYLOAD_T): Record<string, unknown> {
  return {
    annee: toAnnee(payload.annee),
    // La colonne est NOT NULL : un champ vide vaut 0, pas `null`, sans quoi
    // l'API refuserait la ligne sans que l'utilisateur comprenne pourquoi.
    valeur_cible_indcateur_istr: toNombre(payload.valeur_cible_indcateur_istr) ?? 0,
    code_indicateur_istr: payload.code_indicateur_istr,
    code_programme: payload.code_programme,
    code_ug: toCle(payload.code_ug),
  }
}

const MESSAGES_CIBLE: MESSAGES_MUTATION_T = {
  succesCreation: 'Cible enregistrée avec succès !',
  succesModification: 'Cible modifiée avec succès !',
  succesSuppression: 'Cible supprimée avec succès !',
  erreurCreation: "Erreur lors de l'enregistrement de la cible.",
  erreurModification: 'Erreur lors de la modification de la cible.',
  erreurSuppression: 'Erreur lors de la suppression de la cible.',
}

export const cibleIndicateurServices = {
  useGetAll: () =>
    useListeCadreResultat<CIBLE_INDICATEUR_T>(
      CADRE_RESULTAT_QUERY_KEYS.cibles,
      CADRE_RESULTAT_ENDPOINTS.cibles,
    ),
  useGetOne: (id: number | null) =>
    useDetailCadreResultat<CIBLE_INDICATEUR_T>(
      [...CADRE_RESULTAT_QUERY_KEYS.cibles, id],
      CADRE_RESULTAT_ENDPOINTS.cibles,
      id,
    ),
  useCreate: () =>
    useCreationCadreResultat<CIBLE_INDICATEUR_PAYLOAD_T>({
      queryKey: CADRE_RESULTAT_QUERY_KEYS.cibles,
      chemin: CADRE_RESULTAT_ENDPOINTS.cibles,
      normaliser: toCibleApiPayload,
      messages: MESSAGES_CIBLE,
    }),
  useUpdate: () =>
    useModificationCadreResultat<CIBLE_INDICATEUR_PAYLOAD_T>({
      queryKey: CADRE_RESULTAT_QUERY_KEYS.cibles,
      chemin: CADRE_RESULTAT_ENDPOINTS.cibles,
      normaliser: toCibleApiPayload,
      messages: MESSAGES_CIBLE,
    }),
  useDelete: () =>
    useSuppressionCadreResultat({
      queryKey: CADRE_RESULTAT_QUERY_KEYS.cibles,
      chemin: CADRE_RESULTAT_ENDPOINTS.cibles,
      messages: MESSAGES_CIBLE,
    }),
}

/* ================================================================== *
 * 5. Suivis / réalisations                                            *
 * ================================================================== */

export interface SUIVI_INDICATEUR_PAYLOAD_T {
  code_indicateur_istr: number
  /** ⚠️ Majuscule initiale du schéma conservée. */
  Date_suivi: string
  code_ug?: number | null
  valeur_realisee_istr: string | number
  commentaire_suivi_istr?: string | null
  modifier_par?: string | null
  /**
   * ⚠️ Colonne NON DÉCLARÉE dans la table mais exigée par sa contrainte UNIQUE
   * (cf. `SUIVI_INDICATEUR_T`). Facultative, et surtout OMISE du payload
   * lorsqu'elle n'est pas renseignée — voir `toSuiviApiPayload`.
   */
  code_programme?: number | null
}

/**
 * `code_programme` n'est ajouté au corps de la requête QUE s'il est renseigné.
 *
 * Pourquoi cette exception au principe « chaîne vide → null » appliqué partout
 * ailleurs : la colonne n'existe peut-être pas. Envoyer `code_programme: null`
 * à un backend qui ne la connaît pas déclencherait, selon sa configuration, un
 * 422 « unknown field » ou un plantage à l'INSERT — un échec incompréhensible
 * sur un champ que l'utilisateur n'a pas rempli. L'omettre est neutre dans les
 * deux hypothèses : si la colonne existe et qu'elle est requise, le backend le
 * dira clairement, et c'est cette réponse-là qui tranchera la question.
 */
function toSuiviApiPayload(payload: SUIVI_INDICATEUR_PAYLOAD_T): Record<string, unknown> {
  const codeProgramme = toCle(payload.code_programme)
  return {
    code_indicateur_istr: payload.code_indicateur_istr,
    Date_suivi: toDateOnly(payload.Date_suivi),
    code_ug: toCle(payload.code_ug),
    // Colonne NOT NULL : même raisonnement que pour la valeur cible.
    valeur_realisee_istr: toNombre(payload.valeur_realisee_istr) ?? 0,
    commentaire_suivi_istr: toTexte(payload.commentaire_suivi_istr),
    modifier_par: toTexte(payload.modifier_par),
    ...(codeProgramme !== null ? { code_programme: codeProgramme } : {}),
  }
}

const MESSAGES_SUIVI: MESSAGES_MUTATION_T = {
  succesCreation: 'Réalisation enregistrée avec succès !',
  succesModification: 'Réalisation modifiée avec succès !',
  succesSuppression: 'Réalisation supprimée avec succès !',
  erreurCreation: "Erreur lors de l'enregistrement de la réalisation.",
  erreurModification: 'Erreur lors de la modification de la réalisation.',
  erreurSuppression: 'Erreur lors de la suppression de la réalisation.',
}

export const suiviIndicateurServices = {
  useGetAll: () =>
    useListeCadreResultat<SUIVI_INDICATEUR_T>(
      CADRE_RESULTAT_QUERY_KEYS.suivis,
      CADRE_RESULTAT_ENDPOINTS.suivis,
    ),
  useGetOne: (id: number | null) =>
    useDetailCadreResultat<SUIVI_INDICATEUR_T>(
      [...CADRE_RESULTAT_QUERY_KEYS.suivis, id],
      CADRE_RESULTAT_ENDPOINTS.suivis,
      id,
    ),
  useCreate: () =>
    useCreationCadreResultat<SUIVI_INDICATEUR_PAYLOAD_T>({
      queryKey: CADRE_RESULTAT_QUERY_KEYS.suivis,
      chemin: CADRE_RESULTAT_ENDPOINTS.suivis,
      normaliser: toSuiviApiPayload,
      messages: MESSAGES_SUIVI,
    }),
  useUpdate: () =>
    useModificationCadreResultat<SUIVI_INDICATEUR_PAYLOAD_T>({
      queryKey: CADRE_RESULTAT_QUERY_KEYS.suivis,
      chemin: CADRE_RESULTAT_ENDPOINTS.suivis,
      normaliser: toSuiviApiPayload,
      messages: MESSAGES_SUIVI,
    }),
  useDelete: () =>
    useSuppressionCadreResultat({
      queryKey: CADRE_RESULTAT_QUERY_KEYS.suivis,
      chemin: CADRE_RESULTAT_ENDPOINTS.suivis,
      messages: MESSAGES_SUIVI,
    }),
}
