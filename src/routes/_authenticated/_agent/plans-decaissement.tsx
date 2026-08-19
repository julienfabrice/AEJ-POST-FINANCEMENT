import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { PlansDecaissementPage } from '@/pages/PlansDecaissement/PlansDecaissementPage'

export const Route = createFileRoute('/_authenticated/_agent/plans-decaissement')({
  beforeLoad: requireModule(MODULES.PLANS_DEC),
  component: PlansDecaissementPage,
})
