import { createFileRoute } from '@tanstack/react-router'
import { ReferentielsPage } from '@/pages/Referentiels'

export const Route = createFileRoute('/_authenticated/_agent/admin/referentiels')({
  component: ReferentielsPage,
})
