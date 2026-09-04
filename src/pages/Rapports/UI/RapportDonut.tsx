import { useMemo } from 'react'
import { CHART_COLORS } from '../constants'
import type { RAPPORT_LIGNE_T } from '../hooks/useRapportData'
import { centreDonut, formatEntier, formatMillions, partPourcent } from '../utils/format'

/**
 * DONUT SVG + LÉGENDE — portage fidèle de `donutSVG(data)` (maquette l. 8010).
 *
 * Le SVG est écrit à la main, INLINE : aucune librairie de graphiques n'est
 * ajoutée au projet (contrainte « aucune dépendance nouvelle »), et un anneau
 * de segments se dessine parfaitement avec un `stroke-dasharray` sur des
 * cercles concentriques.
 *
 * Géométrie reprise au caractère près :
 *   • `viewBox="0 0 140 140"` rendu en 146 × 146 ;
 *   • segments : `r=54`, `stroke-width=20`, donc l'anneau va de r=44 à r=64 ;
 *   • `transform="rotate(-90 70 70)"` → le premier segment démarre à 12 h ;
 *   • `stroke-dasharray="{longueur} {reste}"` et `stroke-dashoffset="{-cumul}"`,
 *     arrondis à deux décimales comme la maquette ;
 *   • disque blanc `r=44` posé APRÈS les segments pour évider l'anneau.
 *
 * ── ARBITRAGE MESURE ──
 * La maquette titre la carte « Répartition (part du montant) » et alimente le
 * donut avec `r.m`. L'API n'agrège AUCUN montant par dimension aujourd'hui :
 * le donut représente alors la part en NOMBRE, et le titre de la carte suit
 * (cf. `RapportsPage`). On ne fabrique pas un montant pour sauver un libellé.
 */
interface Props {
  lignes: RAPPORT_LIGNE_T[]
  aMontant: boolean
  /** Total de la mesure représentée — sert au centre et aux pourcentages. */
  total: number
  /** Ce qui est dénombré (« dossiers », « emplois ») — pour le nom accessible. */
  uniteN: string
}

/** Circonférence du cercle de rayon 54 — la constante `C` de la maquette. */
const CIRCONFERENCE = 2 * Math.PI * 54

export function RapportDonut({ lignes, aMontant, total, uniteN }: Props) {
  const mesure = (ligne: RAPPORT_LIGNE_T) => (aMontant ? (ligne.montant ?? 0) : ligne.n)

  // `|| 1` de la maquette : un total nul produit un anneau vide plutôt qu'un NaN.
  const denominateur = total || 1
  const centre = centreDonut(total, aMontant)

  /**
   * Géométrie des segments, calculée AVANT le rendu.
   *
   * La maquette accumulait `start` directement dans le `.map()` qui produit le
   * SVG. Transposé tel quel en React, ce cumul est une réaffectation d'une
   * variable extérieure depuis une fonction de rendu : le compilateur React
   * l'interdit (règle `react-hooks/immutability`), et à raison — la valeur
   * survivrait au rendu et fausserait les décalages au rendu suivant. Le cumul
   * est donc fait ici, dans une boucle locale dont rien ne s'échappe.
   */
  const segments = useMemo(() => {
    const resultat: { cle: string; longueur: number; decalage: number; couleur: string }[] = []
    let cumul = 0
    for (let i = 0; i < lignes.length; i++) {
      // Mesure relue ici plutôt que via la fermeture `mesure` : le calcul ne
      // dépend alors que de valeurs listées en dépendances du `useMemo`.
      const valeur = aMontant ? (lignes[i].montant ?? 0) : lignes[i].n
      const longueur = (valeur / denominateur) * CIRCONFERENCE
      resultat.push({
        cle: lignes[i].cle,
        longueur,
        // Décalage NÉGATIF et cumulé : chaque segment démarre là où le
        // précédent s'arrête (comportement de `stroke-dashoffset`).
        decalage: -cumul,
        couleur: CHART_COLORS[i % CHART_COLORS.length],
      })
      cumul += longueur
    }
    return resultat
  }, [lignes, aMontant, denominateur])

  /**
   * NOM ACCESSIBLE du graphique. `role="img"` fait du SVG un nœud TERMINAL pour
   * les technologies d'assistance : son contenu interne — dont les deux `<text>`
   * qui portent le total et son sous-titre — devient inatteignable. Sans
   * `aria-label`, le lecteur d'écran n'annonçait qu'une image anonyme
   * (violation axe-core `role-img-alt`), et le total central n'était restitué
   * NULLE PART : la légende adjacente ne donne que le détail ligne à ligne.
   * Le libellé est construit depuis les données déjà calculées — aucune valeur
   * n'est reformulée ni arrondie différemment de ce qui est affiché.
   */
  const uniteAccessible = centre.sousTitre === 'MILLIONS F' ? ' millions de francs' : ''
  const nomAccessible =
    `Répartition ${aMontant ? 'du montant engagé' : `des ${uniteN}`} ` +
    `en ${lignes.length} catégorie${lignes.length > 1 ? 's' : ''} — ` +
    `total ${centre.valeur}${uniteAccessible}.`

  return (
    <div className="flex flex-wrap items-center gap-[22px]">
      <svg
        viewBox="0 0 140 140"
        width={146}
        height={146}
        className="shrink-0"
        role="img"
        aria-label={nomAccessible}
      >
        {segments.map((segment) => (
          <circle
            key={segment.cle}
            cx={70}
            cy={70}
            r={54}
            fill="none"
            stroke={segment.couleur}
            strokeWidth={20}
            strokeDasharray={`${segment.longueur.toFixed(2)} ${(CIRCONFERENCE - segment.longueur).toFixed(2)}`}
            strokeDashoffset={segment.decalage.toFixed(2)}
            transform="rotate(-90 70 70)"
          />
        ))}
        <circle cx={70} cy={70} r={44} fill="#fff" />
        <text
          x={70}
          y={66}
          textAnchor="middle"
          fontWeight={800}
          fontSize={centre.valeur.length > 7 ? 17 : 22}
          fill="#131C29"
        >
          {/* Taille réduite au-delà de 7 caractères — repli VALIDÉ par le
              commanditaire : la maquette figeait 22 px sur des totaux à trois
              chiffres ; un « 110 000 » réel déborderait du disque évidé de
              88 px de diamètre. Le seuil est le nombre de caractères et non la
              valeur, parce que c'est la LARGEUR rendue qui contraint, séparateurs
              de milliers compris. */}
          {centre.valeur}
        </text>
        <text x={70} y={83} textAnchor="middle" fontSize={8.5} fill="#8595A8" letterSpacing={1}>
          {centre.sousTitre}
        </text>
      </svg>

      {/* Légende : même index de couleur que le segment correspondant. */}
      <div className="flex min-w-[180px] flex-1 flex-col gap-[9px]">
        {lignes.map((ligne, i) => {
          const valeur = mesure(ligne)
          return (
            <div key={ligne.cle} className="flex items-center gap-[9px] text-[12.5px]">
              <span
                className="inline-block h-[11px] w-[11px] shrink-0 rounded-[3px]"
                style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span
                className="flex-1 truncate font-semibold text-[#243244]"
                title={ligne.label}
              >
                {ligne.label}
              </span>
              {/* Sans montant, la légende affiche le dénombrement : elle ne
                  laisse jamais une case vide là où la maquette montrait « X.XXM ». */}
              <b className="font-mono">
                {aMontant ? formatMillions(valeur) : formatEntier(valeur)}
              </b>
              <span className="w-[36px] text-right text-[11.5px] font-semibold text-[#5A6B80]">
                {partPourcent(valeur, total)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
