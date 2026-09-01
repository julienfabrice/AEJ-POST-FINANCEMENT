import { createFileRoute } from '@tanstack/react-router'
import { GuichetsHomePage } from '@/pages/Guichets/GuichetsHomePage'

export const Route = createFileRoute('/_authenticated/_agent/guichets')({
  // TODO(perms) : garde désactivé, cohérent avec /dispositifs — rétablir avec
  // `beforeLoad: requireModule(MODULES.GUICHETS)` une fois le module confirmé.
  component: GuichetsHomePage,
})
