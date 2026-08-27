import { createFileRoute } from '@tanstack/react-router'
import { RemboursementsPage } from '@/pages/Remboursements'

export const Route = createFileRoute('/_authenticated/_agent/remboursements')({
  component: RemboursementsPage,
})
