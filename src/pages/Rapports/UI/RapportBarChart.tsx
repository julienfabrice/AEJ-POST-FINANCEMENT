import type { RAPPORT_LIGNE_T } from '../hooks/useRapportData'
import { formatEntier, formatMillions } from '../utils/format'

/**
 * BARRES HORIZONTALES — traduction Tailwind de `.hbars/.hbar` de la maquette.
 *
 * Vocabulaire repris de `AdminDashboardCharts.tsx`, la traduction Tailwind DÉJÀ
 * VALIDÉE du dépôt : grille `130px_1fr_60px`, piste `bg-[#eef1f6]` de 11 px,
 * remplissage en dégradé orange → vert, valeur alignée à droite en monospace.
 * (La maquette écrit `130px 1fr 52px` ; le dépôt a arbitré 60 px pour laisser
 * respirer les valeurs longues — on ne réinvente pas ce choix.)
 *
 * ── Largeur des barres ──
 * `valeur / max * 100`, rapportée au PLUS GRAND de l'échantillon et non au
 * total : c'est le comportement de la maquette, et il rend les écarts lisibles
 * même quand une catégorie écrase toutes les autres. Les lignes arrivant déjà
 * triées par mesure décroissante, la première barre vaut toujours 100 %.
 */
interface Props {
  lignes: RAPPORT_LIGNE_T[]
  /** Le rapport porte-t-il un montant ? Décide de la mesure représentée. */
  aMontant: boolean
}

export function RapportBarChart({ lignes, aMontant }: Props) {
  // Mesure représentée : le montant quand l'API en fournit un, le dénombrement
  // sinon. Jamais de repli sur une valeur estimée.
  const mesure = (ligne: RAPPORT_LIGNE_T) => (aMontant ? (ligne.montant ?? 0) : ligne.n)

  // `, 1` : garde-fou de la maquette contre la division par zéro.
  const max = Math.max(...lignes.map(mesure), 1)

  return (
    <div className="flex flex-col gap-[11px]">
      {lignes.map((ligne) => {
        const valeur = mesure(ligne)
        return (
          <div
            key={ligne.cle}
            className="grid grid-cols-[130px_1fr_60px] items-center gap-[12px] text-[12.5px]"
          >
            {/* `title` : le libellé est tronqué par ellipse, l'infobulle native
                restitue la valeur complète (49 secteurs, noms d'agences longs). */}
            <span className="truncate font-semibold text-[#5A6B80]" title={ligne.label}>
              {ligne.label}
            </span>
            {/* `rounded-[20px]` sur la piste ET le remplissage : `.hbar .track`
                et `.hbar .fill` de la maquette posent tous deux
                `border-radius:20px` (l. 1797-1810), et c'est la traduction déjà
                retenue par `AdminDashboardCharts.tsx`. Sur 11 px de haut le
                navigateur ramène le rayon à 5,5 px, mais l'écart redevenait
                visible sur les remplissages très étroits. */}
            <div className="h-[11px] overflow-hidden rounded-[20px] bg-[#eef1f6]">
              <div
                className="h-full rounded-[20px] transition-[width] duration-500"
                style={{
                  width: `${(valeur / max) * 100}%`,
                  background: 'linear-gradient(90deg, #E7722B, #20A83A)',
                }}
              />
            </div>
            <span className="text-right font-mono font-bold text-[#131C29]">
              {aMontant ? formatMillions(valeur) : formatEntier(valeur)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
