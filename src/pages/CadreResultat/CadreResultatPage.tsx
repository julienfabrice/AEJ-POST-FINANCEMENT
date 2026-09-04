import { useState } from 'react'
import { Plus, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataGrid } from '@/components/ui/DataGrid'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PermissionGate } from '@/components/PermissionGate'
import { MODULES } from '@/constants/modules'

import { CadreFormModal } from './components/CadreFormModal'
import { CibleFormModal } from './components/CibleFormModal'
import { IndicateurCadreFormModal } from './components/IndicateurCadreFormModal'
import { NiveauFormModal } from './components/NiveauFormModal'
import { SuiviIndicateurFormModal } from './components/SuiviIndicateurFormModal'
import {
  CADRE_RESULTAT_ONGLET_KEYS,
  CADRE_RESULTAT_ONGLETS,
  type CadreResultatOngletKey,
  type ONGLET_CADRE_RESULTAT_T,
} from './constants'
import { useCadreResultatGrid } from './hooks/useCadreResultatGrid'
import { BandeauApiNonBranchee } from './UI/BandeauApiNonBranchee'
import { OngletAtteinte } from './UI/OngletAtteinte'

/**
 * CADRE DE RÉSULTAT — page d'assemblage du module (`/cadre-resultat`).
 *
 * Bâtie sur le gabarit de `src/pages/Suivi/SuiviPage.tsx`, le plus récent écran
 * à onglets du dépôt : mêmes classes d'onglets, même barre d'outils, même
 * squelette de chargement, même `Card` de grille. Aucune invention de style —
 * la maquette n'a pas d'écran « cadre de résultat », on reste donc strictement
 * dans son vocabulaire tel qu'il est déjà traduit en Tailwind ici.
 *
 * ══════════════════════════════════════════════════════════════════════
 *  DEUX FAMILLES D'ONGLETS, UNE SEULE DESCRIPTION
 * ══════════════════════════════════════════════════════════════════════
 * Le catalogue `CADRE_RESULTAT_ONGLETS` décrit SIX onglets de deux natures :
 *
 *  • CINQ onglets de SAISIE — une grille chacun, alimentée par
 *    `useCadreResultatGrid`, avec sa barre d'outils { recherche, compteur,
 *    bouton d'ajout }.
 *  • UN onglet de SYNTHÈSE — « Atteinte des cibles », qui ne saisit rien, ne
 *    se filtre pas au texte et lit lui-même ses trois ressources.
 *
 * La page ne code EN DUR aucune de ces deux listes : elle lit l'absence de
 * `boutonAjout` (et de `placeholderRecherche`, absent avec lui par contrat —
 * cf. `ONGLET_CADRE_RESULTAT_T`) comme le signal « onglet sans barre
 * d'outils ». Ajouter un onglet de synthèse demain se fait donc dans le
 * catalogue seul. Même montage que « Planification & taux » de la page
 * « Indicateurs & suivi », qui rend `PlanificationTab` sans barre d'outils.
 *
 * ⚠️ Le compteur n'est JAMAIS affiché sur l'onglet de synthèse, et c'est
 * volontaire : pour la clé `atteinte`, `useCadreResultatGrid` retombe sur sa
 * branche par défaut et renverrait la longueur de l'onglet « Niveaux ». Ne pas
 * rendre la barre d'outils règle le problème à la racine plutôt que par un
 * garde supplémentaire (documenté aussi dans `constants.ts`).
 *
 * ── Ordre d'ouverture ──
 * L'onglet affiché au premier rendu est le PREMIER du catalogue, lu à la
 * source plutôt que réécrit ici : le catalogue décide seul de l'ordre, la page
 * ne peut pas se désynchroniser de lui. `CADRE_RESULTAT_ONGLETS` n'est jamais
 * vide (constante littérale du module), mais l'accès indexé reste couvert par
 * un repli explicite pour ne pas dépendre de `noUncheckedIndexedAccess`.
 */
const ONGLET_INITIAL: CadreResultatOngletKey =
  CADRE_RESULTAT_ONGLETS[0]?.key ?? CADRE_RESULTAT_ONGLET_KEYS.ATTEINTE

/**
 * Compteur « N libellé », accordé en nombre.
 *
 * Le français met au SINGULIER à zéro comme à un (« 0 élément », « 1 élément »)
 * et ne passe au pluriel qu'à partir de deux : le seuil est donc `> 1`, et non
 * `!== 1` comme en anglais. C'est la raison d'être des deux champs
 * `compteurSingulier` / `compteurPluriel` du catalogue.
 */
function libelleCompteur(onglet: ONGLET_CADRE_RESULTAT_T, nombre: number): string {
  return `${nombre} ${nombre > 1 ? onglet.compteurPluriel : onglet.compteurSingulier}`
}

/**
 * Bouton d'ajout de l'onglet actif, enveloppé dans SA modale de création.
 *
 * Les cinq modales partagent la même forme d'appel — un `children` qui devient
 * le `DialogTrigger` — mais pas leur type de données : elles ne peuvent pas
 * être stockées dans une table de composants sans reperdre ce typage. Un
 * `switch` exhaustif sur la clé d'onglet reste donc la forme la plus sûre, et
 * la seule que le compilateur vérifie réellement.
 *
 * Le `default` couvre la clé `atteinte`, pour laquelle ce composant n'est de
 * toute façon jamais rendu (l'onglet n'a pas de barre d'outils) — et couvrira
 * tout onglet futur ajouté au catalogue sans modale : mieux vaut aucun bouton
 * qu'un bouton inerte.
 */
function BoutonCreationOnglet({ onglet }: { onglet: ONGLET_CADRE_RESULTAT_T }) {
  if (!onglet.boutonAjout) return null

  const declencheur = (
    <Button className="h-9">
      <Plus className="mr-2 h-4 w-4" />
      {onglet.boutonAjout}
    </Button>
  )

  switch (onglet.key) {
    case CADRE_RESULTAT_ONGLET_KEYS.CADRE:
      return <CadreFormModal>{declencheur}</CadreFormModal>
    case CADRE_RESULTAT_ONGLET_KEYS.INDICATEURS:
      return <IndicateurCadreFormModal>{declencheur}</IndicateurCadreFormModal>
    case CADRE_RESULTAT_ONGLET_KEYS.CIBLES:
      return <CibleFormModal>{declencheur}</CibleFormModal>
    case CADRE_RESULTAT_ONGLET_KEYS.SUIVIS:
      return <SuiviIndicateurFormModal>{declencheur}</SuiviIndicateurFormModal>
    case CADRE_RESULTAT_ONGLET_KEYS.NIVEAUX:
      return <NiveauFormModal>{declencheur}</NiveauFormModal>
    default:
      return null
  }
}

/**
 * Squelette de chargement de la grille — repris à l'identique de `SuiviPage`.
 *
 * Il reproduit la SILHOUETTE de la grille (une bande d'en-tête, huit lignes,
 * deux boutons d'action à droite) plutôt qu'un spinner centré : la page ne
 * bouge pas quand les données arrivent, et l'attente ne se lit pas comme une
 * page vide. Extrait en composant local uniquement pour garder lisible la
 * boucle qui rend les six onglets ; c'est du balisage de page, pas un rendu
 * partagé à mutualiser dans `components/`.
 */
function SqueletteGrille() {
  return (
    <div className="flex h-[calc(100vh-300px)] w-full flex-col">
      <div className="flex h-[48px] items-center gap-4 border-b border-[#E5EAF1] bg-[#fafbfd] px-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <div className="flex-1" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex-1 space-y-4 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-slate-50 py-2 last:border-0"
          >
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-5 w-36" />
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CadreResultatPage() {
  const [activeTab, setActiveTab] = useState<CadreResultatOngletKey>(ONGLET_INITIAL)
  const [searchQuery, setSearchQuery] = useState('')

  /**
   * Exercice affiché par l'onglet de synthèse — porté ICI, au-dessus des
   * onglets, et non dans `OngletAtteinte`.
   *
   * Radix démonte le contenu des `TabsContent` inactifs (aucun `forceMount`) :
   * un état local à l'onglet serait détruit dès que l'utilisateur part saisir
   * une réalisation et revient, et l'écran retomberait sur l'exercice le plus
   * récent sans qu'il ait rien demandé. `null` = « pas encore choisi », la
   * valeur effective étant alors dérivée des cibles disponibles.
   */
  const [anneeAtteinte, setAnneeAtteinte] = useState<number | null>(null)

  const { columnDefs, data, isLoading, isError, error, modalNode, fermerEdition } =
    useCadreResultatGrid(activeTab, searchQuery)

  return (
    <>
      {/* Modale d'ÉDITION de l'onglet actif, remontée par sa grille. Rendue
          hors des `TabsContent` : Radix démonte le contenu des onglets
          inactifs, et une Dialog démontée en pleine saisie disparaîtrait sans
          que l'utilisateur ait rien fermé. */}
      {modalNode}

      <div className="space-y-2">
        <div>
          <h1 className="text-2xl font-extrabold text-[#131C29]">Cadre de résultat</h1>
          <p className="mt-1 text-sm text-[#5A6B80]">
            Axes, effets et produits du programme — indicateurs, cibles annuelles et réalisations.
          </p>
        </div>

        {/* Bandeau « en attente de l'API ». Il décide LUI-MÊME de s'afficher
            (`CADRE_RESULTAT_API_PRETE`) : le jour du branchement il n'y a rien à
            retirer ici, et aucune seconde condition à ne pas oublier. */}
        <BandeauApiNonBranchee />

        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val as CadreResultatOngletKey)
            // Vue NEUVE à chaque changement d'onglet, comme partout dans le
            // dépôt : la recherche ne se transporte pas d'un onglet à l'autre…
            setSearchQuery('')
            // …et l'édition en cours est ABANDONNÉE. Sans cela, l'onglet quitté
            // garderait sa ligne en édition et rouvrirait sa modale tout seul au
            // retour — le `modalNode` est démonté, pas l'état qui l'arme
            // (cf. `useCadreResultatGrid`). Cinq onglets de saisie ici : le
            // risque est d'autant plus réel qu'il y a de modales dormantes.
            fermerEdition()
          }}
          className="w-full"
        >
          {/* Six onglets : le conteneur défile horizontalement plutôt que de
              faire déborder la page sur petit écran. */}
          <div className="no-scrollbar w-full overflow-x-auto">
            <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
              {CADRE_RESULTAT_ONGLETS.map((onglet) => (
                <TabsTrigger
                  key={onglet.key}
                  value={onglet.key}
                  className="!bg-transparent !shadow-none after:hidden px-4 py-2.5 text-[13.5px] font-semibold text-slate-500 border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B] hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none"
                >
                  {onglet.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {CADRE_RESULTAT_ONGLETS.map((onglet) => {
            // Un onglet sans bouton d'ajout est un onglet de SYNTHÈSE : ni
            // barre d'outils, ni grille (cf. le contrat de
            // `ONGLET_CADRE_RESULTAT_T`). Le catalogue est la seule source de
            // cette distinction — rien n'est codé en dur ici.
            const estSynthese = onglet.boutonAjout === undefined

            return (
              <TabsContent key={onglet.key} value={onglet.key} className="mt-0 outline-none">
                {estSynthese ? (
                  // « Atteinte des cibles » se rend seul : il lit ses trois
                  // ressources et gère son propre sélecteur d'exercice, le seul
                  // filtre qui ait un sens sur un rapprochement cible/réalisé.
                  <div className="my-4">
                    <OngletAtteinte annee={anneeAtteinte} onAnneeChange={setAnneeAtteinte} />
                  </div>
                ) : (
                  <>
                    <div className="my-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          placeholder={onglet.placeholderRecherche}
                          className="h-9 border-slate-200 bg-white pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <span className="text-[12.5px] whitespace-nowrap text-slate-500">
                        {isLoading ? 'Chargement...' : libelleCompteur(onglet, data.length)}
                      </span>
                      <div className="flex-1" />

                      {/* Création réservée au droit `c` du module « suivi » —
                          et non `cadre_resultat`, que `GET /auth/me` n'expose
                          pas encore : le bouton serait masqué pour tout le
                          monde. Même arbitrage que la garde de la route
                          (`routes/_authenticated/_agent/cadre-resultat.tsx`). */}
                      <PermissionGate module={MODULES.SUIVI} action="c">
                        <BoutonCreationOnglet onglet={onglet} />
                      </PermissionGate>
                    </div>

                    <Card className="p-0 overflow-hidden border-slate-200 rounded-lg shadow-sm">
                      {isLoading ? (
                        <SqueletteGrille />
                      ) : isError ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-16 text-red-600">
                          <span className="text-sm font-medium">
                            Impossible de charger les données
                          </span>
                          {error instanceof Error && (
                            <span className="text-xs text-red-500">{error.message}</span>
                          )}
                        </div>
                      ) : (
                        // Grille VIDE tant que l'API n'est pas branchée : les
                        // lectures sont `enabled: false` et renvoient `[]`.
                        // C'est le comportement nominal, expliqué par le
                        // bandeau ci-dessus — pas un état d'erreur.
                        <DataGrid
                          rowData={data}
                          columnDefs={columnDefs}
                          height="calc(100vh - 300px)"
                          rowHeight={55}
                          defaultColDef={{ sortable: true, filter: true, resizable: true }}
                          /*
                           * PAGINATION DÉSACTIVÉE SUR LE SEUL ONGLET HIÉRARCHIQUE.
                           *
                           * `DataGrid` impose `paginationPageSize={10}`. Sur les
                           * autres onglets c'est sans conséquence — ce sont des
                           * listes plates. Ici l'ordre des lignes EST la
                           * hiérarchie (parcours préfixe de `aplatirArbre`) :
                           * couper toutes les dix lignes séparerait des parents
                           * de leurs enfants d'une page à l'autre, et une
                           * indentation privée de sa racine ne veut plus rien
                           * dire. La grille défile déjà dans sa hauteur fixe,
                           * ce qui rend la pagination inutile ici.
                           */
                          pagination={activeTab !== CADRE_RESULTAT_ONGLET_KEYS.CADRE}
                        />
                      )}
                    </Card>
                  </>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </>
  )
}
