import { useId, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { FileText, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/helpers/age'
import { exploitationServices } from '@/services/exploitations.services'
import { visitePhotoServices } from '@/services/visitePhotos.services'
import { useAuthStore } from '@/store/useAuthStore'
import type { VISITE_PHOTO_T } from '@/types'

/**
 * Pièces jointes d'un rapport de visite — champ `fichiers` de la maquette
 * (« Pièces jointes (rapport, photos…) », RES.suivis.f, l.6467).
 *
 * ARBITRAGE maquette ↔ API (l'API fait autorité sur le FOND) :
 * la maquette prévoyait un simple champ TEXTE contenant un nom de fichier.
 * Côté API ce champ n'existe pas : les pièces jointes sont une COLLECTION
 * (`/visite-photos`) rattachée au rapport par la clé étrangère
 * `exploitation_id`. On n'implémente donc pas un champ texte libre — qui
 * n'aurait nulle part où être stocké — mais la gestion réelle de la
 * collection : liste, ajout, suppression. Le LIBELLÉ de la maquette est
 * conservé tel quel, c'est elle qui fait autorité sur la forme.
 *
 * Conséquence directe de la clé étrangère : une photo ne peut exister
 * qu'attachée à un rapport DÉJÀ enregistré. En CRÉATION, la section n'affiche
 * donc qu'une note ; l'ajout devient possible dès la première ouverture en
 * ÉDITION. (L'alternative — mettre les photos en file d'attente puis les
 * poster après la création du rapport — supposerait de connaître la forme
 * exacte de la réponse du POST /exploitations pour en extraire l'identifiant,
 * ce qui n'est pas vérifié : on ne l'invente pas.)
 */

interface Props {
  /**
   * Identifiant du rapport porteur. `null` en CRÉATION : le rapport n'existe
   * pas encore en base, aucune photo ne peut lui être rattachée.
   */
  exploitationId: number | null
  /**
   * Photos embarquées par la ligne de grille (`GET /exploitations` renvoie
   * déjà la relation `visite_photos`). Sert d'AMORÇAGE : voir `photos`.
   */
  photosInitiales?: VISITE_PHOTO_T[]
}

export function VisitePhotosSection({ exploitationId, photosInitiales }: Props) {
  const champUrlId = useId()
  const champDescriptionId = useId()
  const champDateId = useId()

  /**
   * Auteur du relevé. `prise_par_id` est FACULTATIF côté API et soumis à une
   * règle `exists` : le service transforme déjà toute valeur ≤ 0 ou absente en
   * `null`. En session ouverte, la photo est donc automatiquement horodatée au
   * nom de l'agent connecté, sans lui demander de se désigner lui-même.
   */
  const utilisateurId = useAuthStore((state) => state.user?.id) ?? null

  /**
   * Liste affichée — lue dans le cache de la requête `['exploitations']`, la
   * MÊME que celle de la grille sous-jacente.
   *
   * Aucune requête supplémentaire n'est déclenchée : la grille est montée
   * derrière la modale, la donnée est déjà là, et `staleTime: 30_000`
   * (cf. `src/lib/queryClient.ts`) empêche un re-fetch au montage de cet
   * observateur. Le bénéfice est qu'après un ajout ou une suppression, les
   * services invalident `['exploitations']` : la liste ci-dessous ET le
   * décompte de la colonne « Pièces jointes » se rafraîchissent ensemble,
   * sans état local à resynchroniser à la main.
   *
   * `photosInitiales` reste le repli si la ligne n'est plus dans le cache
   * (cache vidé, ligne supprimée entre-temps).
   */
  const { data: exploitations = [] } = exploitationServices.useGetAll()
  const photos = useMemo<VISITE_PHOTO_T[]>(() => {
    if (exploitationId === null) return []
    const ligne = exploitations.find((exploitation) => exploitation.id === exploitationId)
    return ligne?.visite_photos ?? photosInitiales ?? []
  }, [exploitations, exploitationId, photosInitiales])

  /**
   * Saisie de la nouvelle pièce jointe.
   *
   * État LOCAL et non `react-hook-form` : cette section est rendue À
   * L'INTÉRIEUR du `<form>` du rapport de visite, et un `<form>` imbriqué est
   * invalide en HTML (le navigateur le déplie, la soumission devient
   * imprévisible). Trois champs dont un seul obligatoire ne justifient de
   * toute façon ni résolveur ni schéma.
   */
  const [photoUrl, setPhotoUrl] = useState('')
  const [description, setDescription] = useState('')
  // Par défaut la date du jour : on relève une photo le jour où on la verse.
  const [priseLe, setPriseLe] = useState(() => dayjs().format('YYYY-MM-DD'))

  /** Photo dont la suppression attend confirmation (`null` = aucune). */
  const [idAConfirmer, setIdAConfirmer] = useState<number | null>(null)

  const { mutate: creerPhoto, isPending: ajoutEnCours } = visitePhotoServices.useCreate()
  const { mutate: supprimerPhoto, isPending: suppressionEnCours } = visitePhotoServices.useDelete()

  const urlSaisie = photoUrl.trim()
  const ajoutPossible = exploitationId !== null && urlSaisie.length > 0 && !ajoutEnCours

  const ajouter = () => {
    if (!ajoutPossible || exploitationId === null) return
    creerPhoto(
      {
        exploitation_id: exploitationId,
        photo_url: urlSaisie,
        description,
        prise_le: priseLe,
        prise_par_id: utilisateurId,
      },
      {
        // On ne vide les champs qu'en cas de SUCCÈS : après un rejet de
        // validation, la saisie est conservée pour être corrigée.
        onSuccess: () => {
          setPhotoUrl('')
          setDescription('')
          setPriseLe(dayjs().format('YYYY-MM-DD'))
        },
      },
    )
  }

  /**
   * Entrée clavier dans un champ de cette section.
   *
   * Sans cette interception, « Entrée » sur un `<input>` déclencherait la
   * soumission du formulaire ENGLOBANT (le rapport de visite) : l'utilisateur
   * croirait ajouter une pièce jointe et enregistrerait le rapport.
   */
  const surEntree = (evenement: React.KeyboardEvent<HTMLInputElement>) => {
    if (evenement.key !== 'Enter') return
    evenement.preventDefault()
    ajouter()
  }

  return (
    <div className="rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] p-3">
      {/* Libellé repris MOT POUR MOT de la maquette (l.6467). */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#131C29]">
          Pièces jointes (rapport, photos…)
        </span>
        {photos.length > 0 && (
          <span className="text-[12.5px] text-[#5A6B80]">
            {photos.length} {photos.length > 1 ? 'pièces jointes' : 'pièce jointe'}
          </span>
        )}
      </div>

      {exploitationId === null ? (
        /* CRÉATION : `exploitation_id` est requis par l'API et n'existe pas
           encore. On l'explique plutôt que de proposer un champ inopérant. */
        <p className="mt-2 text-[12.5px] leading-relaxed text-[#5A6B80]">
          Les pièces jointes s'ajoutent après l'enregistrement du rapport : chacune est rattachée au
          rapport de visite, qui doit donc exister au préalable. Enregistrez ce rapport, puis
          rouvrez-le pour y verser le compte rendu et les photos.
        </p>
      ) : (
        <>
          {/* ------------------------------ Liste ------------------------------ */}
          {photos.length === 0 ? (
            <p className="mt-2 text-[12.5px] text-[#5A6B80]">Aucune pièce jointe pour ce rapport.</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {photos.map((photo) => {
                // Formatage confié à `formatDate` (`@/helpers/age`), commun au
                // dépôt ; ne reste local que le choix de N'AFFICHER la ligne
                // « Prise le … » que si la date existe.
                const dateFormatee = photo.prise_le ? formatDate(photo.prise_le) : null
                // `prise_par` n'est renvoyée que par `GET /visite-photos` ;
                // la relation embarquée dans `GET /exploitations` se limite
                // aux colonnes scalaires. On affiche donc l'auteur QUAND il
                // est présent, sans jamais aller le chercher ailleurs.
                const auteur = photo.prise_par
                  ? `${photo.prise_par.prenom} ${photo.prise_par.nom}`
                  : null

                return (
                  <li
                    key={photo.id}
                    className="flex items-start gap-2 rounded-md border border-[#E5EAF1] bg-white px-2.5 py-2"
                  >
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#8595A8]" />

                    <div className="min-w-0 flex-1">
                      {/*
                        Le chemin est affiché TEL QUEL, sans lien cliquable :
                        l'API expose bien une route de lecture
                        (`GET /api/files/{path}`), mais le format exact du
                        segment `path` n'a pas pu être vérifié — fabriquer une
                        URL au jugé produirait des liens morts.
                      */}
                      <p className="truncate font-mono text-[12px] text-[#131C29]" title={photo.photo_url}>
                        {photo.photo_url}
                      </p>
                      {photo.description && (
                        <p className="mt-0.5 truncate text-[12.5px] text-[#5A6B80]">
                          {photo.description}
                        </p>
                      )}
                      {(dateFormatee || auteur) && (
                        <p className="mt-0.5 text-[11.5px] text-[#8595A8]">
                          {dateFormatee && `Prise le ${dateFormatee}`}
                          {dateFormatee && auteur && ' · '}
                          {auteur && `par ${auteur}`}
                        </p>
                      )}
                    </div>

                    {/*
                      Confirmation EN LIGNE plutôt qu'un `AlertDialog` : la
                      section vit déjà à l'intérieur d'une Dialog modale Radix,
                      et empiler un second calque modal (portail, piège de
                      focus, neutralisation des pointer-events) pour une action
                      aussi locale coûte plus qu'il ne rapporte.
                    */}
                    {idAConfirmer === photo.id ? (
                      <div className="flex shrink-0 items-center gap-1">
                        <span className="text-[11.5px] text-[#D6453B]">Supprimer ?</span>
                        <Button
                          type="button"
                          size="xs"
                          className="bg-[#D6453B] text-white hover:bg-[#b93a31]"
                          disabled={suppressionEnCours}
                          onClick={() => {
                            setIdAConfirmer(null)
                            supprimerPhoto(photo.id)
                          }}
                        >
                          Oui
                        </Button>
                        <Button
                          type="button"
                          size="xs"
                          variant="ghost"
                          onClick={() => setIdAConfirmer(null)}
                        >
                          Non
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Supprimer cette pièce jointe"
                        className="shrink-0 text-[#8595A8] hover:bg-[#FBE7E5] hover:text-[#D6453B]"
                        disabled={suppressionEnCours}
                        onClick={() => setIdAConfirmer(photo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}

          {/* ------------------------------ Ajout ------------------------------ */}
          <div className="mt-3 border-t border-[#E5EAF1] pt-3">
            <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <div className="sm:col-span-2">
                <label
                  htmlFor={champUrlId}
                  className="mb-1 block text-[12px] font-medium text-[#5A6B80]"
                >
                  Chemin du fichier *
                </label>
                {/*
                  Saisie MANUELLE du chemin, et non un sélecteur de fichier.
                  L'API expose bien `POST /api/files/upload` (multipart :
                  `file`, `folder`), mais la forme de sa réponse n'est
                  documentée nulle part (aucun exemple enregistré dans la
                  collection Postman) et elle ne peut pas être relevée en live
                  sans écrire sur l'API partagée. Or c'est cette réponse qui
                  fournirait le `photo_url` à poster ici : plutôt que d'inventer
                  un format de retour, on s'en tient au champ que l'API exige
                  RÉELLEMENT. Le téléversement direct pourra être branché ici
                  dès le contrat confirmé, sans rien changer d'autre.
                */}
                <Input
                  id={champUrlId}
                  value={photoUrl}
                  onChange={(evenement) => setPhotoUrl(evenement.target.value)}
                  onKeyDown={surEntree}
                  placeholder="/storage/photos/visite_001.jpg"
                  className="h-9 bg-white font-mono text-[12.5px]"
                />
              </div>

              <div>
                <label
                  htmlFor={champDateId}
                  className="mb-1 block text-[12px] font-medium text-[#5A6B80]"
                >
                  Prise le
                </label>
                <Input
                  id={champDateId}
                  type="date"
                  value={priseLe}
                  onChange={(evenement) => setPriseLe(evenement.target.value)}
                  onKeyDown={surEntree}
                  className="h-9 bg-white text-[12.5px]"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor={champDescriptionId}
                  className="mb-1 block text-[12px] font-medium text-[#5A6B80]"
                >
                  Description
                </label>
                <Input
                  id={champDescriptionId}
                  value={description}
                  onChange={(evenement) => setDescription(evenement.target.value)}
                  onKeyDown={surEntree}
                  placeholder="Compte rendu de visite, photo du site…"
                  className="h-9 bg-white text-[12.5px]"
                />
              </div>

              <div className="flex items-end">
                {/*
                  `type="button"` IMPÉRATIF : à l'intérieur d'un `<form>`, un
                  bouton sans type vaut `submit` et enregistrerait le rapport
                  de visite au lieu d'ajouter la pièce jointe.
                */}
                <Button
                  type="button"
                  size="sm"
                  className="h-9 w-full bg-[#E7722B] text-white hover:bg-[#d6621a] sm:w-auto"
                  disabled={!ajoutPossible}
                  onClick={ajouter}
                >
                  <Plus className="h-4 w-4" />
                  {ajoutEnCours ? 'Ajout…' : 'Ajouter'}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
