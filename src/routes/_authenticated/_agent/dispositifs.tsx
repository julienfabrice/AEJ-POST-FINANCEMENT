import { createFileRoute } from '@tanstack/react-router'
import { ProcedureGuichetPage } from '@/pages/procedure-guichet/ProcedureGuichetPage'

export const Route = createFileRoute('/_authenticated/_agent/dispositifs')({
  // TODO(perms) : garde désactivé — rétablir avec
  // `beforeLoad: requireModule(MODULES.DISPOSITIFS)` (imports à réajouter).
  component: ProcedureGuichetPage,
})
