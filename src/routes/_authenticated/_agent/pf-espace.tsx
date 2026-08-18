import { createFileRoute } from '@tanstack/react-router'
import { PfEspacePage } from '@/pages/PfEspace/PfEspacePage'

export const Route = createFileRoute('/_authenticated/_agent/pf-espace')({
  component: PfEspacePage,
})
