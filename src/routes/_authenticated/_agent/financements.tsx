import { createFileRoute } from '@tanstack/react-router'
import { FinancementsPage } from '@/pages/Financements'

export const Route = createFileRoute('/_authenticated/_agent/financements')({
  component: FinancementsPage,
})
