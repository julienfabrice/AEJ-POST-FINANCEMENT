import { createFileRoute } from '@tanstack/react-router'
import { RapportsPage } from '@/pages/Rapports/RapportsPage'

export const Route = createFileRoute('/_authenticated/_agent/rapports')({
  component: RapportsPage,
})
