import { moisAbrege, moisLabel } from '../constants'
import { nombreSur } from '../hooks/useRapportData'
import { formatEntier, montantF } from '../utils/format'
import type { EVOLUTION_REMBOURSEMENT_T } from '@/types/dashboard.types'

/**
 * TENDANCE MENSUELLE — barres verticales `.bars/.b/.bar` de la maquette.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ARBITRAGE MAQUETTE ↔ API : ce n'est PAS la tendance de la maquette
 * ══════════════════════════════════════════════════════════════════════════
 * La maquette (`trendBars`, l. 8016) compte les SOUMISSIONS par mois en
 * parcourant `DB.projets` côté client : `p.cree.slice(0,7)`. Intransposable en
 * production pour deux raisons cumulatives, vérifiées en live le 30/08/2026 :
 *   1. il faudrait charger les 110 000 micro-projets (~200 Mo) pour lire une
 *      seule colonne de date ;
 *   2. `/projets` n'accepte NI `date_debut` NI `date_fin`, et aucun endpoint
 *      n'agrège les micro-projets par mois — il n'y a donc pas non plus de
 *      version « comptée » à 12 requêtes.
 * La SEULE série mensuelle réellement agrégée par l'API est
 * `/dashboard/partenaires/evolution-remboursements`. La carte affiche donc
 * cette série, sous son VRAI nom (« Évolution mensuelle des remboursements ») :
 * on préfère une donnée juste correctement étiquetée à une donnée inventée sous
 * l'étiquette de la maquette.
 *
 * Le RENDU, lui, reste celui de la maquette : hauteur `12 + n / max * 80` %
 * (plancher de 12 % pour qu'un mois à une seule opération reste visible,
 * plafond à 92 %), valeur au-dessus, mois abrégé en français en dessous, barres
 * vertes (la maquette pose toujours la classe `g` sur `.bar`).
 */
interface Props {
  points: EVOLUTION_REMBOURSEMENT_T[]
  /** Titre de la carte porteuse — sert de nom accessible à la zone défilable. */
  titre: string
}

export function RapportTrend({ points, titre }: Props) {
  // Normalisation défensive : Laravel sérialise `nombre_operations` tantôt en
  // nombre, tantôt en chaîne, et `montant_recupere` toujours en chaîne décimale.
  const series = points
    .map((p) => ({
      mois: p.mois,
      operations: nombreSur(p.nombre_operations),
      montant: nombreSur(p.montant_recupere),
    }))
    // Tri chronologique : `"YYYY-MM"` se trie alphabétiquement, comme dans la
    // maquette (`Object.keys(by).sort()`). L'API renvoie déjà trié, mais rien
    // ne le garantit contractuellement.
    .sort((a, b) => a.mois.localeCompare(b.mois))

  const max = Math.max(...series.map((p) => p.operations), 1)

  return (
    /**
     * Zone à défilement horizontal ATTEIGNABLE AU CLAVIER. Elle ne contient
     * aucun élément focusable : sans `tabIndex`, les mois sortis du cadre
     * étaient inaccessibles à qui n'utilise pas de souris (WCAG 2.1.1).
     * `role="region"` + `aria-label` lui donnent un nom, sans quoi le lecteur
     * d'écran annoncerait un groupe anonyme.
     */
    <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={titre}>
      <div className="flex h-[130px] min-w-full items-end gap-[10px] pt-[10px]">
        {series.map((point) => (
          <div
            key={point.mois}
            /* `min-w-[34px]` : la maquette laissait ses barres se comprimer sans
               limite (`flex:1` seul) parce qu'elle en affichait au plus six.
               L'API renvoie une série ouverte — un mois par opération de
               récupération, sans plafond — où la valeur et l'étiquette
               deviendraient illisibles au-delà d'une douzaine de colonnes. D'où
               ce plancher, et le défilement horizontal du conteneur. */
            className="flex h-full min-w-[34px] flex-1 flex-col items-center justify-end gap-[7px]"
            // Le montant récupéré ne tient pas dans une colonne de 38 px : il
            // est porté par l'infobulle native plutôt que sacrifié.
            title={`${moisLabel(point.mois)} — ${formatEntier(point.operations)} opération(s) · ${montantF(point.montant)} récupérés`}
          >
            <span className="text-[11px] font-bold text-[#131C29]">
              {formatEntier(point.operations)}
            </span>
            {/* `rounded-t-[6px]` : `.bars .b .bar` de la maquette pose
                `border-radius:6px 6px 0 0` (l. 1757-1765), et c'est ce que
                traduit déjà `AdminDashboardCharts.tsx`. Sur une barre de 38 px
                de large, l'écart avec 3 px était directement perceptible. */}
            <div
              className="w-full max-w-[38px] rounded-t-[6px] transition-[height] duration-500"
              style={{
                height: `${12 + (point.operations / max) * 80}%`,
                background: 'linear-gradient(#20A83A, #178A2E)',
              }}
            />
            <span className="text-center text-[11px] leading-[1.2] text-[#5A6B80]">
              {/* Mois abrégé SEUL, comme le `.blab` de la maquette (l. 8016).
                  L'année ne tient pas dans une colonne de 38 px : elle est
                  portée par l'infobulle du groupe ci-dessus (`moisLabel`), donc
                  deux janviers consécutifs restent distinguables. */}
              {moisAbrege(point.mois)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
