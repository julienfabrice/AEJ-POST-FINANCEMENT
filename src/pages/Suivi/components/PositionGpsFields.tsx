import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { LoaderCircle, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import type { ExploitationFormValues } from '@/schema/exploitations/exploitationSchema'

/** Ton de la note d'aide (`.geo-note` de la maquette : neutre, verte, rouge). */
type GEO_TON_T = 'neutre' | 'ok' | 'erreur'

interface GEO_NOTE_T {
  texte: string
  ton: GEO_TON_T
}

/**
 * Textes repris MOT POUR MOT de la maquette : ce sont ceux que les agents
 * connaissent.
 *
 * ⚠️ L'écran reproduit ici est le FORMULAIRE de ressource (`fieldHTML`, champ
 * de type 'geo', l.6696-6703), et NON la modale terrain `openVisiteSuivi`
 * (l.9703) : la note par défaut est donc celle du formulaire (l.6703), plus
 * courte. Les messages de recherche, d'échec et de succès, eux, sont produits
 * par `brancherGeoloc` (l.6658) qui est COMMUN aux deux contextes.
 */
const NOTE_PAR_DEFAUT: GEO_NOTE_T = {
  texte: 'Saisissez les coordonnées, ou relevez-les si vous êtes sur le site.',
  ton: 'neutre',
}
const NOTE_INDISPONIBLE: GEO_NOTE_T = {
  texte: "La géolocalisation n'est pas disponible sur cet appareil.",
  ton: 'erreur',
}
const NOTE_RECHERCHE: GEO_NOTE_T = { texte: 'Recherche du signal GPS…', ton: 'neutre' }

/** `GeolocationPositionError.code` → message français. */
const NOTES_ECHEC: Record<number, string> = {
  1: 'Autorisation refusée — saisissez les coordonnées à la main.',
  3: 'Délai dépassé — réessayez ou saisissez les coordonnées à la main.',
}
const NOTE_ECHEC_PAR_DEFAUT = 'Position indisponible — saisissez les coordonnées à la main.'

/** Options de la maquette : haute précision, 10 s de patience, aucun cache. */
const OPTIONS_GEOLOCALISATION: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
}

const CLASSES_NOTE: Record<GEO_TON_T, string> = {
  neutre: 'text-slate-500',
  ok: 'font-semibold text-emerald-700',
  erreur: 'font-semibold text-red-600',
}

interface PositionGpsFieldsProps {
  form: UseFormReturn<ExploitationFormValues>
}

/**
 * Bloc « Position GPS du lieu » : Latitude, Longitude, relevé automatique et
 * note d'aide.
 *
 * ── ARBITRAGE maquette ↔ API ──
 * La maquette a UN champ `gps` « lat, lng » ; l'API a DEUX colonnes décimales.
 * L'API fait autorité sur le fond → deux champs de saisie distincts. La
 * concaténation « lat, lng » ne subsiste qu'à l'AFFICHAGE, dans la grille.
 *
 * ── Pourquoi un composant séparé plutôt que l'état dans le hook de formulaire ──
 * La note et l'indicateur de recherche sont un état d'INTERACTION, qui doit
 * repartir à zéro à chaque ouverture de la modale. Radix démonte le contenu
 * d'une Dialog fermée : en logeant cet état ici, la remise à zéro est obtenue
 * par construction, sans effet de synchronisation à écrire ni à maintenir.
 */
export function PositionGpsFields({ form }: PositionGpsFieldsProps) {
  const [note, setNote] = useState<GEO_NOTE_T>(NOTE_PAR_DEFAUT)
  const [isLocating, setIsLocating] = useState(false)

  /**
   * Relève la position du terminal.
   *
   * En cas d'échec, les champs restent SAISISSABLES et la note explique la
   * cause : l'agent n'est jamais bloqué par un GPS capricieux — règle de la
   * maquette, d'autant plus nécessaire que les visites se font souvent hors
   * couverture.
   */
  const releverPosition = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setNote(NOTE_INDISPONIBLE)
      return
    }

    setIsLocating(true)
    setNote(NOTE_RECHERCHE)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Six décimales, comme la maquette : au-delà de ce qu'un GPS de
        // téléphone garantit, mais sans perte d'information.
        form.setValue('latitude', position.coords.latitude.toFixed(6), { shouldValidate: true })
        form.setValue('longitude', position.coords.longitude.toFixed(6), { shouldValidate: true })
        setIsLocating(false)
        setNote({
          texte: `Position relevée · précision ${Math.round(position.coords.accuracy)} m`,
          ton: 'ok',
        })
      },
      (erreur) => {
        setIsLocating(false)
        setNote({ texte: NOTES_ECHEC[erreur.code] ?? NOTE_ECHEC_PAR_DEFAUT, ton: 'erreur' })
      },
      OPTIONS_GEOLOCALISATION,
    )
  }

  return (
    <>
      <div className="mt-2 border-b border-slate-100 pb-1.5 text-[12.5px] font-bold tracking-wide text-[#131C29] uppercase">
        Position GPS du lieu
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              {/* Placeholder du formulaire de ressource (l.6699), et non
                  l'exemple chiffré de la modale terrain. */}
              <FormControl>
                <Input
                  inputMode="decimal"
                  placeholder="Latitude"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              {/* Placeholder du formulaire de ressource (l.6700). */}
              <FormControl>
                <Input
                  inputMode="decimal"
                  placeholder="Longitude"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center disabled:cursor-progress disabled:opacity-60"
          disabled={isLocating}
          onClick={releverPosition}
        >
          {isLocating ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Localisation en cours…
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Utiliser ma position actuelle
            </>
          )}
        </Button>
        <p className={cn('mt-[7px] text-[11.5px] leading-[1.4]', CLASSES_NOTE[note.ton])}>
          {note.texte}
        </p>
      </div>
    </>
  )
}
