import { createFileRoute } from '@tanstack/react-router'
import { ProfilsPage } from '@/pages/Profils/ProfilsPage'

export const Route = createFileRoute('/_authenticated/_agent/admin/profils')({
  component: ProfilsPage,
})
