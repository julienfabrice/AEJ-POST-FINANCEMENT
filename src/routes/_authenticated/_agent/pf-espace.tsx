import { createFileRoute } from '@tanstack/react-router'
import { EspacePartenaireFinancierPage } from '@/pages/EspacePartenaireFinancier'

export const Route = createFileRoute('/_authenticated/_agent/pf-espace')({
  component: EspacePartenaireFinancierPage,
})
