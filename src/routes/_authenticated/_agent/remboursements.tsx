import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { RemboursementsPage } from '@/pages/Remboursements/RemboursementsPage'

export const Route = createFileRoute('/_authenticated/_agent/remboursements')({
  beforeLoad: requireModule(MODULES.REMBOURSEMENTS),
  component: RemboursementsPage,
})
