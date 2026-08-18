import { createFileRoute } from '@tanstack/react-router'
import { LocalitesPage } from '@/pages/Localites/LocalitesPage'

export const Route = createFileRoute('/_authenticated/_agent/admin/localites')({
  component: LocalitesPage,
})
