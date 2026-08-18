import { createFileRoute } from '@tanstack/react-router'
import { PlansDecaissementPage } from '@/pages/PlansDecaissement/PlansDecaissementPage'

export const Route = createFileRoute('/_authenticated/_agent/plans-decaissement')({
  component: PlansDecaissementPage,
})
