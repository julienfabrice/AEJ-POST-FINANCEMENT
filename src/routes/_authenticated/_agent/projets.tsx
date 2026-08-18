import { createFileRoute } from '@tanstack/react-router'
import { ProjetsPage } from '@/pages/Projets/ProjetsPage'

export const Route = createFileRoute('/_authenticated/_agent/projets')({
  component: ProjetsPage,
})
