import { createFileRoute } from '@tanstack/react-router'
import { ProjetsPage } from '@/pages/Projets'

export const Route = createFileRoute('/_authenticated/_agent/projets')({
  // TODO(perms) : garde désactivé — rétablir avec
  // `beforeLoad: requireModule(MODULES.PROJETS)` (imports à réajouter).
  component: ProjetsPage,
})
