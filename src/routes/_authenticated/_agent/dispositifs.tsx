import { createFileRoute } from '@tanstack/react-router'
import { DispostifsPage } from '@/pages/Dispostifs/DispostifsPage'

export const Route = createFileRoute('/_authenticated/_agent/dispositifs')({
  // TODO(perms) : garde désactivé — rétablir avec
  // `beforeLoad: requireModule(MODULES.DISPOSITIFS)` (imports à réajouter).
  component: DispostifsPage,
})
