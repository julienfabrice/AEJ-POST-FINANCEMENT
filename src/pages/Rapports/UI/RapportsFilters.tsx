import type { ReactNode } from 'react'
import { Download, FileText, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PROJECT_STATUSES } from '@/constants/PROJECT_STATUSES'
import type { AGENCE_REGIONALE_T, DISPOSITIF_T } from '@/types'
import {
  FILTRE_LABELS,
  RAPPORTS,
  filtreEstApplicable,
  raisonFiltreDesactive,
  type RAPPORT_CLE_T,
  type RAPPORT_FILTRE_T,
  type RAPPORT_TYPE_T,
} from '../constants'
import type { RAPPORT_FILTRES_T } from '../hooks/useRapportData'

/**
 * BARRE DE FILTRES — carte pleine largeur de la maquette (l. 8039-8047).
 *
 * Ordre des champs conservé : Type de rapport · Guichet · Région · Statut, puis
 * un ressort (`flex-1`) qui pousse les deux boutons à droite.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * RÈGLE STRUCTURANTE : aucun filtre n'est SILENCIEUSEMENT ignoré
 * ══════════════════════════════════════════════════════════════════════════
 * La maquette propose les trois mêmes filtres pour ses six rapports, parce
 * qu'elle filtrait un tableau JavaScript en mémoire. Les endpoints réels, eux,
 * n'honorent pas les mêmes paramètres (vérifié un par un en live) :
 *   • `/dashboard/agences/projets-statut` accepte `statut` et `agence_id`,
 *     mais IGNORE `dispositif_id` (réponse strictement identique) ;
 *   • `/dashboard/agences/{projets,financement}-agence` n'acceptent rien ;
 *   • `/dashboard/entreprises/*` ne connaissent pas le parcours de financement ;
 *   • `/projets?…&per_page=1` honore statut, agence, dispositif, stade, type.
 * Chaque type de rapport déclare donc ses `filtresApplicables` dans le
 * catalogue. Un filtre non applicable est GRISÉ, marqué d'une icône
 * d'information, et son infobulle explique en français POURQUOI. Le laisser
 * actif reviendrait à mentir : l'utilisateur croirait filtrer, l'écran
 * afficherait les mêmes chiffres.
 */

/**
 * Radix interdit `value=""` sur un `SelectItem` (la chaîne vide sert à effacer
 * la sélection). L'option neutre porte donc une valeur sentinelle, traduite en
 * chaîne vide — la convention « Tous » de la maquette — au moment du `onChange`.
 */
const VALEUR_TOUS = '__TOUS__'

/** Groupes du select « Type de rapport », dans l'ordre du catalogue. */
const GROUPES = RAPPORTS.reduce<{ label: string; items: RAPPORT_TYPE_T[] }[]>((acc, r) => {
  const existant = acc.find((g) => g.label === r.groupeLabel)
  if (existant) existant.items.push(r)
  else acc.push({ label: r.groupeLabel, items: [r] })
  return acc
}, [])

/**
 * Style commun des déclencheurs de select — `.field select` de la maquette
 * (l. 1051 : `border-radius:9px`, bordure de 1,5 px, 13,5 px de texte).
 */
const TRIGGER_CLASS =
  'w-full rounded-[9px] border-[1.5px] border-[#E5EAF1] bg-white px-3 text-[13.5px] text-[#131C29] shadow-none data-[placeholder]:text-[#8595A8] focus-visible:border-[#E7722B] focus-visible:ring-[3px] focus-visible:ring-[#E7722B]/15 disabled:cursor-not-allowed disabled:bg-[#F6F8FB] disabled:opacity-100 disabled:text-[#8595A8]'

/**
 * Largeurs minimales de la maquette (l. 8041-8044) : 220 px pour « Type de
 * rapport », 160 px pour les trois filtres.
 */
const LARGEUR_TYPE = 'min-w-[220px] flex-1 sm:flex-none'
const LARGEUR_FILTRE = 'min-w-[160px] flex-1 sm:flex-none'

/** Identifiant du texte d'explication d'un filtre grisé — cf. `aria-describedby`. */
const idRaison = (f: RAPPORT_FILTRE_T) => `rapport-filtre-${f}-raison`

interface ChampProps {
  label: string
  /** Explication du grisage, ou `null` quand le champ est actif. */
  raison: string | null
  /** Identifiant à donner au texte d'explication, pour l'associer au champ. */
  idExplication?: string
  largeur: string
  children: ReactNode
}

/**
 * Un champ de filtre : libellé + contrôle, avec infobulle lorsqu'il est inactif.
 *
 * ── Accessibilité du motif de grisage ──
 * L'infobulle est portée par le `div` ENGLOBANT et non par le déclencheur
 * lui-même : un `<button disabled>` ne reçoit aucun événement de survol, le
 * message d'explication serait donc invisible là où il est le plus utile.
 * Mais ce `div` n'est pas focusable par nature, et le seul élément focusable
 * qu'il contient est justement le select DÉSACTIVÉ, donc hors séquence de
 * tabulation : au clavier seul, l'explication restait TOTALEMENT inatteignable.
 * Deux corrections :
 *   1. `tabIndex={0}` sur le porteur de l'infobulle — Radix ouvre le tooltip au
 *      focus autant qu'au survol, l'explication devient donc lisible au clavier ;
 *   2. la même explication est dupliquée dans un texte réservé aux lecteurs
 *      d'écran (`sr-only`) et RATTACHÉE au champ par `aria-describedby` : elle
 *      est alors annoncée avec le champ, sans dépendre de l'ouverture du
 *      tooltip.
 */
function ChampFiltre({ label, raison, idExplication, largeur, children }: ChampProps) {
  const interieur = (
    <>
      <div className="mb-[6px] flex items-center gap-[5px]">
        <span
          className={`text-[12.5px] font-semibold ${raison ? 'text-[#8595A8]' : 'text-[#243244]'}`}
        >
          {label}
        </span>
        {/* Marqueur visuel du grisage : l'icône signale qu'une explication est
            disponible au survol, plutôt que de laisser un champ mort sans motif.
            `aria-hidden` : elle n'apporte rien à un lecteur d'écran, qui reçoit
            déjà le texte complet ci-dessous. */}
        {raison && (
          <Info aria-hidden className="h-[13px] w-[13px] shrink-0 text-[#8595A8]" />
        )}
      </div>
      {children}
      {raison && (
        <span id={idExplication} className="sr-only">
          {raison}
        </span>
      )}
    </>
  )

  if (!raison) return <div className={largeur}>{interieur}</div>

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* `tabIndex={0}` : rend le motif du grisage atteignable au clavier. */}
        <div className={largeur} tabIndex={0}>
          {interieur}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[320px] text-left leading-snug">
        {raison}
      </TooltipContent>
    </Tooltip>
  )
}

interface Props {
  rapport: RAPPORT_TYPE_T
  filtres: RAPPORT_FILTRES_T
  onTypeChange: (cle: RAPPORT_CLE_T) => void
  onFiltresChange: (patch: RAPPORT_FILTRES_T) => void
  dispositifs: DISPOSITIF_T[]
  agences: AGENCE_REGIONALE_T[]
  onExportCsv: () => void
  onGenererFiche: () => void
  /** Vrai tant que les données ne sont pas prêtes : les deux sorties sont alors sans objet. */
  actionsDesactivees: boolean
}

export function RapportsFilters({
  rapport,
  filtres,
  onTypeChange,
  onFiltresChange,
  dispositifs,
  agences,
  onExportCsv,
  onGenererFiche,
  actionsDesactivees,
}: Props) {
  const raison = (f: RAPPORT_FILTRE_T) => raisonFiltreDesactive(rapport, f)
  const actif = (f: RAPPORT_FILTRE_T) => filtreEstApplicable(rapport, f)

  /**
   * ══════════════════════════════════════════════════════════════════════════
   * Un filtre DÉSACTIVÉ affiche la valeur NEUTRE, jamais la valeur précédente
   * ══════════════════════════════════════════════════════════════════════════
   * L'état des filtres est conservé d'un rapport à l'autre (revenir au rapport
   * précédent y retrouve sa sélection), mais un champ grisé qui continuerait
   * d'afficher « ABENGOUROU » laisserait croire à un périmètre restreint qui
   * n'est PAS appliqué : le moteur n'émet aucun filtre non applicable, et la
   * fiche de synthèse écrit « Non applicable à ce rapport » sur ce même champ.
   * L'écran, le CSV et la fiche doivent dire la même chose — l'affichage suit
   * donc l'APPLICABILITÉ, pas l'état brut.
   */
  const valeurAffichee = (f: RAPPORT_FILTRE_T, valeur: string | undefined) =>
    actif(f) ? valeur || VALEUR_TOUS : VALEUR_TOUS

  /** Explication du grisage à rattacher au champ, ou `undefined` s'il est actif. */
  const decritPar = (f: RAPPORT_FILTRE_T) => (raison(f) ? idRaison(f) : undefined)

  return (
    <TooltipProvider delayDuration={150}>
      <Card className="gap-0 rounded-[7px] border-[#E5EAF1] py-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          {/* 1 — Type de rapport. Toujours actif : c'est lui qui pilote tout le
              reste. Pas d'option « Tous » : un rapport est forcément d'un type. */}
          <ChampFiltre label="Type de rapport" raison={null} largeur={LARGEUR_TYPE}>
            <Select value={rapport.cle} onValueChange={(v) => onTypeChange(v as RAPPORT_CLE_T)}>
              <SelectTrigger className={TRIGGER_CLASS} aria-label="Type de rapport">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GROUPES.map((groupe) => (
                  <SelectGroup key={groupe.label}>
                    <SelectLabel className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#8595A8]">
                      {groupe.label}
                    </SelectLabel>
                    {groupe.items.map((r) => (
                      <SelectItem key={r.cle} value={r.cle}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </ChampFiltre>

          {/* 2 — Guichet (`dispositif_id`). Référentiel `/dispositifs`. */}
          <ChampFiltre
            label={FILTRE_LABELS.dispositif}
            raison={raison('dispositif')}
            idExplication={idRaison('dispositif')}
            largeur={LARGEUR_FILTRE}
          >
            <Select
              value={valeurAffichee('dispositif', filtres.dispositifId)}
              disabled={!actif('dispositif')}
              onValueChange={(v) =>
                onFiltresChange({ dispositifId: v === VALEUR_TOUS ? '' : v })
              }
            >
              <SelectTrigger
                className={TRIGGER_CLASS}
                aria-label={FILTRE_LABELS.dispositif}
                aria-describedby={decritPar('dispositif')}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VALEUR_TOUS}>Tous</SelectItem>
                {dispositifs.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.intitule}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ChampFiltre>

          {/* 3 — Région. Dans ce système « région » ≡ « agence régionale » :
              `/aej/agences-regionales` et `/aej/division-regionale` renvoient
              les mêmes 33 entrées. On interroge donc le référentiel des agences,
              et le paramètre émis est `agence_id`. */}
          <ChampFiltre
            label={FILTRE_LABELS.region}
            raison={raison('region')}
            idExplication={idRaison('region')}
            largeur={LARGEUR_FILTRE}
          >
            <Select
              value={valeurAffichee('region', filtres.agenceId)}
              disabled={!actif('region')}
              onValueChange={(v) => onFiltresChange({ agenceId: v === VALEUR_TOUS ? '' : v })}
            >
              <SelectTrigger
                className={TRIGGER_CLASS}
                aria-label={FILTRE_LABELS.region}
                aria-describedby={decritPar('region')}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VALEUR_TOUS}>Toutes</SelectItem>
                {agences.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ChampFiltre>

          {/* 4 — Statut. Les 14 clés de `PROJECT_STATUSES` correspondent
              EXACTEMENT aux `statut` renvoyés par `/dashboard/agences/projets-statut`. */}
          <ChampFiltre
            label={FILTRE_LABELS.statut}
            raison={raison('statut')}
            idExplication={idRaison('statut')}
            largeur={LARGEUR_FILTRE}
          >
            <Select
              value={valeurAffichee('statut', filtres.statut)}
              disabled={!actif('statut')}
              onValueChange={(v) => onFiltresChange({ statut: v === VALEUR_TOUS ? '' : v })}
            >
              <SelectTrigger
                className={TRIGGER_CLASS}
                aria-label={FILTRE_LABELS.statut}
                aria-describedby={decritPar('statut')}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VALEUR_TOUS}>Tous</SelectItem>
                {PROJECT_STATUSES.map((s) => (
                  <SelectItem key={s.key} value={s.key}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ChampFiltre>

          {/* Ressort : pousse les actions à droite, comme le `flex:1` inline de
              la maquette. */}
          <div className="hidden flex-1 lg:block" />

          <Button
            variant="outline"
            onClick={onExportCsv}
            disabled={actionsDesactivees}
            /* `rounded-[9px]` : `.btn` de la maquette (l. 679). */
            className="h-9 rounded-[9px] border-[#E5EAF1] text-[13px] font-semibold text-[#131C29] hover:border-[#cdd6e2] hover:bg-[#fbfcfe]"
          >
            <Download className="h-4 w-4" />
            Exporter CSV
          </Button>
          <Button
            onClick={onGenererFiche}
            disabled={actionsDesactivees}
            /* `rounded-[9px]` : `.btn.pri` hérite du rayon de `.btn` (l. 679). */
            className="h-9 rounded-[9px] bg-[#E7722B] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(238,123,26,0.28)] hover:bg-[#C85E18]"
          >
            <FileText className="h-4 w-4" />
            Générer le rapport
          </Button>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
