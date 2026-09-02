import { CHART_COLORS } from '../constants'
import type { RAPPORT_LIGNE_T } from '../hooks/useRapportData'
import { enteteNb, formatEntier, montantF, partPourcent } from '../utils/format'

/**
 * DÉTAIL CHIFFRÉ — traduction du `.tbl-wrap` de la maquette (l. 8037).
 *
 * Structure conservée : en-têtes en petites capitales grises sur `#fafbfd`,
 * pastille de couleur en tête de ligne (même index que le donut et la légende),
 * ligne « Total général » DANS le `<tbody>` avec fond `#fafbfd` et part figée à
 * `100%`. Le tableau est collé au bord de la carte, sans padding interne :
 * c'est délibéré dans la maquette (`${table}` posé juste après le `.hd`).
 *
 * ── COLONNES ADAPTATIVES (arbitrage API) ──
 * La maquette affiche toujours quatre colonnes : dimension · Nb projets ·
 * Montant engagé · Part. Les DEUX colonnes de mesure sont ici conditionnées à
 * leur disponibilité réelle :
 *   • « Montant engagé » n'apparaît que si `aMontant` — aucune source de l'API
 *     ne sait sommer un montant par statut, par secteur, par guichet ou par
 *     type d'emploi ;
 *   • « Nb … » n'apparaît que si `aNombre` — cas de bord des rapports « par
 *     agence » / « par région », seuls à fusionner deux agrégats distincts,
 *     dont celui du dénombrement peut manquer quand celui des montants répond.
 * Dans les deux cas, afficher une colonne de zéros laisserait croire à un
 * financement nul ou à un portefeuille vide, alors qu'il s'agit d'une mesure
 * indisponible. La colonne disparaît, et « Part » porte sur celle qui reste.
 */
interface Props {
  lignes: RAPPORT_LIGNE_T[]
  aMontant: boolean
  /** L'API a-t-elle fourni un dénombrement ? Cf. `aNombre` dans `useRapportData`. */
  aNombre: boolean
  totalN: number
  totalMontant: number
  /** En-tête de la première colonne : « Étape », « Région », « Secteur »… */
  libelleDimension: string
  /** Ce qui est dénombré : « dossiers », « emplois ». */
  uniteN: string
  /** Titre de la carte porteuse — sert de nom accessible à la zone défilable. */
  titre: string
}

export function RapportTable({
  lignes,
  aMontant,
  aNombre,
  totalN,
  totalMontant,
  libelleDimension,
  uniteN,
  titre,
}: Props) {
  // Le pourcentage porte sur la mesure principale, exactement comme les barres
  // et le donut : les trois représentations doivent raconter la même chose.
  const total = aMontant ? totalMontant : totalN
  const mesure = (ligne: RAPPORT_LIGNE_T) => (aMontant ? (ligne.montant ?? 0) : ligne.n)

  const thClass =
    'text-left text-[11px] tracking-[0.05em] uppercase text-[#8595A8] font-bold py-[11px] px-[14px] border-b border-[#E5EAF1] whitespace-nowrap bg-[#fafbfd]'
  const tdClass = 'py-[12px] px-[14px] border-b border-[#EEF2F7] text-[13px] align-middle'

  return (
    /**
     * Zone à défilement horizontal ATTEIGNABLE AU CLAVIER. Le tableau ne
     * contient aucun élément focusable : sans `tabIndex`, les colonnes sorties
     * du cadre sur petit écran — « Montant engagé » et « Part » — étaient
     * inaccessibles à qui n'utilise pas de souris (WCAG 2.1.1).
     * `role="region"` + `aria-label` lui donnent un nom, sans quoi le lecteur
     * d'écran annoncerait un groupe anonyme.
     */
    <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={titre}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th scope="col" className={thClass}>{libelleDimension}</th>
            {aNombre && <th scope="col" className={thClass}>{enteteNb(uniteN)}</th>}
            {aMontant && <th scope="col" className={thClass}>Montant engagé</th>}
            <th scope="col" className={thClass}>Part</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne, i) => (
            <tr key={ligne.cle} className="transition-colors hover:bg-[#fafbfe]">
              <td className={tdClass}>
                <span
                  className="mr-[3px] inline-block h-[9px] w-[9px] shrink-0 rounded-[2px] align-middle"
                  style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                />{' '}
                <b className="font-semibold text-[#131C29]">{ligne.label}</b>
              </td>
              {aNombre && (
                <td className={`${tdClass} font-mono`}>{formatEntier(ligne.n)}</td>
              )}
              {aMontant && (
                <td className={`${tdClass} font-mono`}>{montantF(ligne.montant ?? 0)}</td>
              )}
              <td className={`${tdClass} font-mono text-[12.5px] text-[#5A6B80]`}>
                {partPourcent(mesure(ligne), total)}%
              </td>
            </tr>
          ))}

          {/* Total général : dans le `<tbody>` comme la maquette, fond `#fafbfd`,
              part figée à 100 % (jamais recalculée depuis les arrondis). */}
          <tr className="bg-[#fafbfd]">
            <td className={tdClass}>
              <b>Total général</b>
            </td>
            {aNombre && (
              <td className={`${tdClass} font-mono`}>
                <b>{formatEntier(totalN)}</b>
              </td>
            )}
            {aMontant && (
              <td className={`${tdClass} font-mono`}>
                <b>{montantF(totalMontant)}</b>
              </td>
            )}
            <td className={`${tdClass} font-mono`}>100%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
