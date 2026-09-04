import { toast } from 'sonner'
import { CHART_COLORS, libelleRapport, type RAPPORT_TYPE_T } from '../constants'
import type { RAPPORT_LIGNE_T } from '../hooks/useRapportData'
import { enteteNb, formatEntier, formatMillions, montantF, partPourcent } from './format'

/**
 * FICHE DE SYNTHÈSE IMPRIMABLE
 * ============================
 * Portage TypeScript de `ficheSyntheseHTML` / `genererFicheSynthese`
 * (maquette l. 8065-8175). Le document est AUTONOME : police système
 * (Arial/Helvetica), monospace « Courier New », CSS embarqué, `@media print`
 * inclus. Aucune ressource distante n'est requise hormis le logo, servi par
 * l'API elle-même.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * 🔒 SÉCURITÉ — pourquoi `escapeHtml` est OBLIGATOIRE ici
 * ══════════════════════════════════════════════════════════════════════════
 * Ce module produit une CHAÎNE HTML, écrite telle quelle dans une fenêtre par
 * `document.write`. React et son échappement automatique ne protègent plus
 * rien à ce stade. Or toutes les valeurs interpolées viennent de la base :
 * libellés de secteurs, noms d'agences, raisons sociales d'entreprises, nom de
 * l'utilisateur connecté, intitulés de la configuration, URL de logo. Un seul
 * `<script>` ou `"` mal placé dans une raison sociale suffirait à injecter du
 * code dans une fenêtre de même origine que l'application.
 * RÈGLE ABSOLUE : **aucune** valeur dynamique n'entre dans le document sans
 * passer par `escapeHtml`. Les seules chaînes injectées brutes sont des
 * littéraux de ce fichier et les couleurs de `CHART_COLORS`, constantes du code.
 */

/* ------------------------------------------------------------------ *
 * Échappement                                                         *
 * ------------------------------------------------------------------ */

/**
 * Neutralise les cinq caractères qui peuvent sortir d'un contexte texte ou
 * d'un attribut HTML. Couvre aussi bien `<div>{valeur}</div>` que
 * `<img src="{valeur}">` — d'où l'échappement des guillemets simples ET
 * doubles.
 */
const escapeHtml = (valeur: unknown): string =>
  String(valeur ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/* ------------------------------------------------------------------ *
 * Entrées                                                             *
 * ------------------------------------------------------------------ */

export interface FICHE_FILTRES_T {
  /** Libellés DÉJÀ résolus par l'écran (« Tous les guichets », « ABENGOUROU »…). */
  guichet: string
  region: string
  statut: string
}

export interface FICHE_CONFIG_T {
  /** `intitule_structure` / `sigle_structure` de `/configurations`. */
  intituleStructure: string
  /** `intitule_systeme` / `sigle_systeme`. */
  intituleSysteme: string
  sigleSysteme: string
  /**
   * `logo_systeme_url` : URL ABSOLUE prête à l'emploi renvoyée par l'API.
   * `null` quand la configuration n'a pas encore été chargée — le bloc logo est
   * alors simplement omis, jamais remplacé par une image de substitution.
   */
  logoUrl: string | null
}

export interface FICHE_PARAMS_T {
  rapport: RAPPORT_TYPE_T
  lignes: RAPPORT_LIGNE_T[]
  totalN: number
  totalMontant: number
  aMontant: boolean
  /**
   * L'API a-t-elle fourni un DÉNOMBREMENT ? (cf. `aNombre` dans
   * `useRapportData`). Faux uniquement sur les rapports « par agence » / « par
   * région », seuls à fusionner deux agrégats distincts. Ce document est
   * IMPRIMÉ et circule hors de l'application : un « 0 micro-projet » ou un
   * « montant moyen : 0 F » y serait lu comme un fait mesuré, sans que son
   * lecteur ait le moindre moyen de savoir que la mesure était indisponible.
   */
  aNombre: boolean
  filtres: FICHE_FILTRES_T
  /** Prénom + nom de l'utilisateur connecté, ou « — ». */
  auteur: string
  /** Libellé du rôle (pas son code) — vide si inconnu. */
  role: string
  config: FICHE_CONFIG_T
}

/* ------------------------------------------------------------------ *
 * Accords français                                                    *
 * ------------------------------------------------------------------ */

/**
 * Nom de ce qui est dénombré, au singulier et au pluriel.
 * La maquette écrivait « micro-projet(s) » en dur ; trois rapports du catalogue
 * comptent des EMPLOIS, où cette formulation serait fausse. L'unité vient donc
 * du catalogue (`uniteN`), seule source de vérité de ce qui est mesuré.
 */
const nomUnite = (uniteN: string): { sing: string; plur: string } =>
  uniteN === 'emplois'
    ? { sing: 'emploi', plur: 'emplois' }
    : { sing: 'micro-projet', plur: 'micro-projets' }

/**
 * Singulier DIRECTEMENT dérivé de `uniteN` : « dossiers » → « dossier »,
 * « emplois » → « emploi ».
 *
 * Réservé aux ÉTIQUETTES DE KPI, où il doit rester cohérent avec ses voisines.
 * Le 3e carton de la maquette écrit « Montant moyen / dossier » (l. 8151) et
 * jouxte le 1er, « Dossiers concernés » : employer le synonyme « micro-projet »
 * de `nomUnite` faisait cohabiter deux vocabulaires sur deux cartons adjacents.
 * `nomUnite` reste en revanche le bon outil pour le paragraphe NARRATIF, où la
 * maquette écrit bien « micro-projet(s) » (l. 8063).
 */
const singulierUnite = (uniteN: string): string =>
  uniteN.endsWith('s') ? uniteN.slice(0, -1) : uniteN

/* ------------------------------------------------------------------ *
 * Paragraphe narratif                                                 *
 * ------------------------------------------------------------------ */

/**
 * Reprend la tournure de `ficheNarrative` (maquette l. 8064-8070), ajustée à la
 * mesure réellement employée.
 *
 * ── Deux ajustements ──
 * 1. Sans montant, la phrase ne parle plus « du montant engagé » mais « du
 *    total » : promettre un montant qu'aucun endpoint ne sait produire serait
 *    précisément l'erreur que l'arbitrage interdit. Une phrase supplémentaire
 *    dit explicitement pourquoi le montant est absent.
 * 2. Le participe de la maquette est CONSERVÉ (« représenté(e)s ») ; seul son
 *    accord figé au féminin (« guichet(s) représentée(s) ») devient
 *    « représenté(e)s », valable pour les six dimensions du catalogue.
 *
 * Le HTML de retour contient des `<b>` volontaires ; toutes les valeurs
 * dynamiques y sont DÉJÀ échappées.
 */
function ficheNarrative(p: FICHE_PARAMS_T): string {
  const { lignes, totalN, totalMontant, aMontant, aNombre, rapport } = p
  if (!lignes.length) {
    return 'Aucune donnée ne correspond aux filtres sélectionnés pour ce périmètre.'
  }

  const unite = nomUnite(rapport.uniteN)
  const dim = rapport.libelleDimension.toLowerCase()
  const top = lignes[0]
  const total = aMontant ? totalMontant : totalN
  const pct = partPourcent(aMontant ? (top.montant ?? 0) : top.n, total)

  const pluriel = totalN > 1
  const phrases: string[] = []

  if (aNombre) {
    phrases.push(
      `Sur le périmètre filtré, <b>${escapeHtml(formatEntier(totalN))}</b> ` +
        `${escapeHtml(pluriel ? unite.plur : unite.sing)} ${pluriel ? 'ont' : 'a'} été ` +
        `recensé${pluriel ? 's' : ''}` +
        (aMontant
          ? ` pour un montant total engagé de <b>${escapeHtml(montantF(totalMontant))}</b>.`
          : '.'),
    )
  } else {
    // Dénombrement indisponible : la phrase s'en tient au montant, seule mesure
    // réellement lue, et le dit explicitement plutôt que d'écrire « 0 dossier ».
    phrases.push(
      `Sur le périmètre filtré, un montant total engagé de ` +
        `<b>${escapeHtml(montantF(totalMontant))}</b> a été recensé sur ` +
        `<b>${escapeHtml(formatEntier(lignes.length))}</b> ${escapeHtml(dim)}(s).`,
    )
    phrases.push(
      `La source ${escapeHtml(rapport.sourceLabel)} n'a fourni aucun dénombrement ` +
        `exploitable pour ce périmètre : le nombre de ${escapeHtml(rapport.uniteN)} ` +
        `n'est volontairement pas indiqué, il n'est pas connu.`,
    )
  }

  phrases.push(
    `La catégorie « <b>${escapeHtml(top.label)}</b> » concentre à elle seule ` +
      `<b>${pct}%</b> ${aMontant ? 'du montant engagé' : 'du total'}` +
      // Le détail entre parenthèses ne s'écrit que si le dénombrement existe.
      (aNombre
        ? ` (${escapeHtml(formatEntier(top.n))} ${escapeHtml(top.n > 1 ? unite.plur : unite.sing)})`
        : '') +
      `, sur un total de <b>${escapeHtml(formatEntier(lignes.length))}</b> ${escapeHtml(dim)}(s) représenté(e)s.`,
  )

  if (!aMontant) {
    phrases.push(
      `Aucun montant n'est agrégeable sur cette dimension : la source ` +
        `${escapeHtml(rapport.sourceLabel)} ne produit qu'un dénombrement. ` +
        `Le rapport s'exprime donc en ${escapeHtml(rapport.uniteN)} et en part relative.`,
    )
  }

  phrases.push(`Le détail chiffré par ${escapeHtml(dim)} figure dans le tableau ci-dessous.`)

  return phrases.join(' ')
}

/* ------------------------------------------------------------------ *
 * Génération du document                                              *
 * ------------------------------------------------------------------ */

/** Feuille de style embarquée — reprise de la maquette (l. 8085-8131). */
const FICHE_CSS = `
*{box-sizing:border-box}
body{font-family:Arial,Helvetica,sans-serif;color:#131C29;margin:0;background:#eef1f5}
.toolbar{position:sticky;top:0;background:#131C29;color:#fff;display:flex;gap:10px;align-items:center;padding:12px 22px;z-index:9}
.toolbar b{font-size:13px;letter-spacing:.04em;text-transform:uppercase;opacity:.7;margin-right:auto}
.toolbar button{font-family:inherit;cursor:pointer;border:none;border-radius:7px;padding:9px 16px;font-size:13px;font-weight:600}
.toolbar .pri{background:#E7722B;color:#fff}
.toolbar .gh{background:rgba(255,255,255,.12);color:#fff}
.sheet{max-width:900px;margin:22px auto;background:#fff;padding:40px 46px;box-shadow:0 8px 30px rgba(18,28,41,.12)}
.fhead{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;border-bottom:3px solid #E7722B;padding-bottom:18px;margin-bottom:22px}
.fhead .org{display:flex;gap:12px;align-items:center}
.fhead .org img{height:46px;width:auto}
.fhead .org b{display:block;font-size:14px}
.fhead .org span{display:block;font-size:11px;color:#5A6B80}
.fhead .meta{text-align:right}
.fhead .tag{display:inline-block;background:#FBEADE;color:#C85E18;font-size:10.5px;font-weight:700;letter-spacing:.1em;padding:3px 9px;border-radius:20px;text-transform:uppercase}
.fhead h1{font-size:20px;margin:8px 0 4px;letter-spacing:-.01em}
.fhead .sub{font-size:11.5px;color:#5A6B80}
.ffilters{display:flex;gap:0;border:1px solid #E5EAF1;border-radius:8px;overflow:hidden;margin-bottom:22px}
.ffilters div{flex:1;padding:10px 14px;border-right:1px solid #E5EAF1}
.ffilters div:last-child{border-right:none}
.ffilters label{display:block;font-size:9.5px;text-transform:uppercase;letter-spacing:.08em;color:#8595A8;margin-bottom:3px}
.ffilters b{font-size:13px}
.fkpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px}
.fkpi{border:1px solid #E5EAF1;border-radius:8px;padding:12px 14px;border-top:3px solid #E7722B}
.fkpi:nth-child(2){border-top-color:#20A83A}.fkpi:nth-child(3){border-top-color:#2D6BD4}.fkpi:nth-child(4){border-top-color:#131C29}
.fkpi .lab{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#8595A8;margin-bottom:4px}
.fkpi .val{font-size:18px;font-weight:800}
.fkpi .val.txt{font-size:13px;line-height:1.3;word-break:break-word}
.fnote{font-size:10.5px;color:#8595A8;font-style:italic;margin-bottom:16px}
.fnarr{background:#FBEADE;border-left:4px solid #E7722B;padding:14px 16px;font-size:12.5px;line-height:1.6;border-radius:0 6px 6px 0;margin-bottom:22px}
.fsec h2{font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#131C29;border-bottom:1px solid #E5EAF1;padding-bottom:8px;margin:26px 0 12px}
.fbar{display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:11.5px}
.fbar-lb{width:150px;flex:none;color:#5A6B80;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fbar-track{flex:1;height:9px;background:#EEF2F7;border-radius:5px;overflow:hidden}
.fbar-fill{height:100%;border-radius:5px}
.fbar-v{width:56px;flex:none;text-align:right;font-family:monospace}
table{width:100%;border-collapse:collapse;font-size:12px}
thead{display:table-header-group}
th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#8595A8;padding:8px 10px;border-bottom:2px solid #E5EAF1}
td{padding:8px 10px;border-bottom:1px solid #EEF2F7}
tr{break-inside:avoid}
tfoot td{font-weight:800;background:#FAFBFD}
.fsw{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:6px}
.mono{font-family:'Courier New',monospace}
.fempty{font-size:12px;color:#8595A8;font-style:italic}
.ffoot{margin-top:30px;padding-top:14px;border-top:1px solid #E5EAF1;font-size:10.5px;color:#8595A8;display:flex;justify-content:space-between;gap:16px}
@media print{.toolbar{display:none}body{background:#fff}.sheet{box-shadow:none;margin:0;max-width:none;padding:14mm}@page{margin:12mm}}
`

/** Les quatre KPI, adaptés aux mesures réellement disponibles. */
function ficheKpis(p: FICHE_PARAMS_T): string {
  const { lignes, totalN, totalMontant, aMontant, aNombre, rapport } = p
  // « Dossiers concernés » (maquette) devient « Emplois concernés » quand c'est
  // un emploi qui est compté : le libellé suit la mesure, jamais l'inverse.
  const uniteMaj = rapport.uniteN.charAt(0).toUpperCase() + rapport.uniteN.slice(1)

  const kpi = (lab: string, val: string, texte = false) =>
    `<div class="fkpi"><div class="lab">${escapeHtml(lab)}</div>` +
    `<div class="val${texte ? ' txt' : ''}">${escapeHtml(val)}</div></div>`

  if (aMontant && aNombre) {
    // Les quatre KPI de la maquette, disponibles tels quels.
    const moyen = totalN ? totalMontant / totalN : 0
    return (
      kpi(`${uniteMaj} concernés`, formatEntier(totalN)) +
      kpi('Montant total engagé', montantF(totalMontant)) +
      // « Montant moyen / dossier » (maquette l. 8151) — même mot que le 1er KPI
      // « Dossiers concernés » juste à côté, cf. `singulierUnite`.
      kpi(`Montant moyen / ${singulierUnite(rapport.uniteN)}`, montantF(Math.round(moyen))) +
      kpi(`${rapport.libelleDimension}(s) représenté(e)s`, formatEntier(lignes.length))
    )
  }

  const top = lignes[0]

  if (aMontant) {
    /**
     * Montants sans dénombrement. Les deux KPI qui dépendent du nombre sont
     * REMPLACÉS, pas neutralisés : « Micro-projets concernés » vaudrait 0 et
     * « Montant moyen / micro-projet » se calculerait sur une division par
     * zéro, affichée « 0 F ». Deux chiffres faux sur un document imprimé.
     */
    return (
      kpi('Montant total engagé', montantF(totalMontant)) +
      kpi(`${rapport.libelleDimension}(s) représenté(e)s`, formatEntier(lignes.length)) +
      kpi('Catégorie la plus dotée', top ? top.label : '—', true) +
      kpi(
        'Part de cette catégorie',
        `${partPourcent(top?.montant ?? 0, totalMontant)}%`,
      )
    )
  }

  // Sans montant, les deux KPI monétaires n'ont plus d'objet : ils sont
  // REMPLACÉS par deux lectures de la répartition, et non laissés à « 0 F ».
  // (Le cas « ni montant ni dénombrement » ne produit aucune ligne : le moteur
  // écarte les lignes dont les deux mesures sont nulles, et les deux boutons de
  // sortie sont désactivés sur une liste vide.)
  const pct = top ? partPourcent(top.n, totalN) : 0
  return (
    kpi(`${uniteMaj} concernés`, formatEntier(totalN)) +
    kpi('Catégories représentées', formatEntier(lignes.length)) +
    kpi('Catégorie la plus représentée', top ? top.label : '—', true) +
    kpi('Part de cette catégorie', `${pct}%`)
  )
}

/** Barres de la fiche : couleur pleine `CHART_COLORS`, largeur à 1 décimale. */
function ficheBarres(p: FICHE_PARAMS_T): string {
  const { lignes, aMontant } = p
  if (!lignes.length) return '<div class="fempty">Aucune donnée</div>'

  const mesure = (l: RAPPORT_LIGNE_T) => (aMontant ? (l.montant ?? 0) : l.n)
  const max = Math.max(...lignes.map(mesure), 1)

  return lignes
    .map((ligne, i) => {
      const valeur = mesure(ligne)
      const largeur = ((valeur / max) * 100).toFixed(1)
      // `CHART_COLORS` est une constante du code : pas de valeur utilisateur
      // dans l'attribut `style`, donc pas de vecteur d'injection par ce biais.
      return (
        `<div class="fbar"><span class="fbar-lb">${escapeHtml(ligne.label)}</span>` +
        `<div class="fbar-track"><div class="fbar-fill" style="width:${largeur}%;background:${CHART_COLORS[i % CHART_COLORS.length]}"></div></div>` +
        `<span class="fbar-v">${escapeHtml(aMontant ? formatMillions(valeur) : formatEntier(valeur))}</span></div>`
      )
    })
    .join('')
}

/** Tableau de la fiche : mêmes colonnes adaptatives que l'écran. */
function ficheTableau(p: FICHE_PARAMS_T): string {
  const { lignes, totalN, totalMontant, aMontant, aNombre, rapport } = p
  const total = aMontant ? totalMontant : totalN

  const corps = lignes
    .map((ligne, i) => {
      const cellules =
        `<td><span class="fsw" style="background:${CHART_COLORS[i % CHART_COLORS.length]}"></span>${escapeHtml(ligne.label)}</td>` +
        (aNombre ? `<td class="mono">${escapeHtml(formatEntier(ligne.n))}</td>` : '') +
        (aMontant ? `<td class="mono">${escapeHtml(montantF(ligne.montant ?? 0))}</td>` : '') +
        `<td class="mono">${partPourcent(aMontant ? (ligne.montant ?? 0) : ligne.n, total)}%</td>`
      return `<tr>${cellules}</tr>`
    })
    .join('')

  // Mêmes colonnes adaptatives que l'écran et que le CSV : les trois sorties
  // doivent montrer exactement les mêmes mesures, sinon elles se contredisent.
  return (
    '<table><thead><tr>' +
    `<th>${escapeHtml(rapport.libelleDimension)}</th>` +
    (aNombre ? `<th>${escapeHtml(enteteNb(rapport.uniteN))}</th>` : '') +
    (aMontant ? '<th>Montant engagé</th>' : '') +
    '<th>Part</th></tr></thead>' +
    `<tbody>${corps}</tbody>` +
    '<tfoot><tr><td>Total général</td>' +
    (aNombre ? `<td class="mono">${escapeHtml(formatEntier(totalN))}</td>` : '') +
    (aMontant ? `<td class="mono">${escapeHtml(montantF(totalMontant))}</td>` : '') +
    '<td class="mono">100%</td></tr></tfoot></table>'
  )
}

/**
 * Construit le document complet. Exportée séparément de l'ouverture de fenêtre
 * pour rester testable et inspectable sans effet de bord.
 */
export function ficheSyntheseHTML(p: FICHE_PARAMS_T): string {
  const maintenant = new Date()
  const dateLong = maintenant.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const heure = maintenant.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const { config, filtres, rapport } = p

  /**
   * Titre du document. Même arbitrage que le titre de la carte à l'écran : il
   * suit la MESURE réellement fournie. Une fiche IMPRIMÉE intitulée
   * « Financement engagé par région » alors qu'elle ne contient que des nombres
   * de dossiers circulerait hors de l'application sans que son lecteur puisse
   * lever l'ambiguïté (cf. `labelSansMontant` dans le catalogue).
   */
  const titre = libelleRapport(rapport, p.aMontant)

  const bloc = (titre: string, contenu: string) =>
    `<div class="fsec"><h2>${escapeHtml(titre)}</h2>${contenu}</div>`

  return [
    '<!doctype html><html lang="fr"><head><meta charset="utf-8">',
    `<title>Fiche de synthèse — ${escapeHtml(titre)}</title>`,
    `<style>${FICHE_CSS}</style></head><body>`,

    // Barre d'outils — masquée à l'impression par la règle `@media print`.
    '<div class="toolbar no-print"><b>Aperçu — fiche de synthèse</b>',
    '<button class="gh" onclick="window.close()">Fermer</button>',
    '<button class="pri" onclick="window.print()">Imprimer / Exporter en PDF</button></div>',

    '<div class="sheet">',

    // En-tête : identité réelle issue de `/configurations`, pas d'un logo figé.
    '<div class="fhead"><div class="org">',
    config.logoUrl ? `<img src="${escapeHtml(config.logoUrl)}" alt="logo">` : '',
    `<div><b>${escapeHtml(config.intituleStructure)}</b>`,
    `<span>${escapeHtml(config.intituleSysteme)}</span></div></div>`,
    '<div class="meta"><span class="tag">Fiche de synthèse</span>',
    `<h1>${escapeHtml(titre)}</h1>`,
    `<div class="sub">Générée le ${escapeHtml(dateLong)} à ${escapeHtml(heure)} · par ${escapeHtml(p.auteur)}`,
    p.role ? ` — ${escapeHtml(p.role)}` : '',
    '</div></div></div>',

    // Bandeau des filtres : les libellés sont ceux affichés à l'écran, y compris
    // les valeurs par défaut « Tous les guichets » / « Toutes les régions ».
    '<div class="ffilters">',
    `<div><label>Guichet</label><b>${escapeHtml(filtres.guichet)}</b></div>`,
    `<div><label>Région</label><b>${escapeHtml(filtres.region)}</b></div>`,
    `<div><label>Étape / statut</label><b>${escapeHtml(filtres.statut)}</b></div>`,
    '</div>',

    `<div class="fkpis">${ficheKpis(p)}</div>`,

    // Mention explicite de l'indisponibilité du montant : la fiche circule hors
    // de l'application, son lecteur n'a pas le contexte de l'écran.
    p.aMontant
      ? '<div class="fnote">Source des chiffres : ' + escapeHtml(rapport.sourceLabel) + '.</div>'
      : '<div class="fnote">Le montant engagé n\'est pas agrégeable sur cette dimension : ' +
        escapeHtml(rapport.sourceLabel) +
        ` ne produit qu'un dénombrement. Les chiffres ci-dessous sont exprimés en ${escapeHtml(rapport.uniteN)} et en part relative.</div>`,

    `<div class="fnarr">${ficheNarrative(p)}</div>`,

    bloc(`Répartition — ${rapport.libelleDimension}`, ficheBarres(p)),
    bloc('Détail chiffré', ficheTableau(p)),

    '<div class="ffoot">',
    `<span>Document généré automatiquement par ${escapeHtml(config.intituleSysteme)} — données issues du périmètre filtré au moment de la génération.</span>`,
    `<span>${escapeHtml(config.sigleSysteme)}</span>`,
    '</div>',

    '</div></body></html>',
  ].join('')
}

/**
 * Ouvre la fiche dans un nouvel onglet.
 *
 * ── Correction assumée vs maquette ──
 * La maquette émettait le toast de succès INCONDITIONNELLEMENT, y compris quand
 * la pop-up était bloquée : l'utilisateur voyait « Fiche de synthèse générée »
 * suivi de « Autorisez les pop-ups… ». Ici le succès n'est annoncé que s'il a
 * réellement eu lieu.
 */
export function genererFicheSynthese(p: FICHE_PARAMS_T): void {
  const fenetre = window.open('', '_blank')
  if (!fenetre) {
    toast.error('Autorisez les pop-ups pour générer la fiche de synthèse.')
    return
  }
  fenetre.document.open()
  fenetre.document.write(ficheSyntheseHTML(p))
  fenetre.document.close()
  toast.success('Fiche de synthèse générée')
}
