import { createFileRoute } from '@tanstack/react-router'
import { UnitesPage } from '@/pages/Unites/UnitesPage'

export const Route = createFileRoute('/_authenticated/_agent/admin/unites')({
  component: UnitesPage,
})
