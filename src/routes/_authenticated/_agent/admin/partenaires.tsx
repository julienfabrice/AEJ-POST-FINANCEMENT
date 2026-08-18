import { createFileRoute } from '@tanstack/react-router'
import { PartenairesPage } from '@/pages/Partenaires/PartenairesPage'

export const Route = createFileRoute('/_authenticated/_agent/admin/partenaires')({
  component: PartenairesPage,
})
