import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { CadreResultatPage } from '@/pages/CadreResultat/CadreResultatPage'

/**
 * ⚠️ GARDE SUR `MODULES.SUIVI`, PAS SUR `MODULES.CADRE_RESULTAT`.
 *
 * `MODULES.CADRE_RESULTAT` existe bien (`src/constants/modules.ts`) et attend
 * son heure, mais `requireModule` s'appuie sur `can()`, qui ne connaît que les
 * modules renvoyés par `GET /auth/me`. Tant que le backend n'expose pas
 * `cadre_resultat` dans les permissions, un garde sur cette clé répondrait
 * `false` pour TOUS les profils : la route redirigerait systématiquement vers
 * le tableau de bord et l'écran serait livré inaccessible.
 *
 * Le cadre de résultat appartenant au même module fonctionnel « Suivi &
 * évaluation » que `/suivi`, le rattacher provisoirement à `MODULES.SUIVI`
 * donne exactement le bon public. La bascule sera un changement d'UNE LIGNE
 * ici, et d'une ligne dans l'entrée `cadre_resultat` de `AGENT_NAV_ITEMS`.
 */
export const Route = createFileRoute('/_authenticated/_agent/cadre-resultat')({
  beforeLoad: requireModule(MODULES.SUIVI),
  component: CadreResultatPage,
})
