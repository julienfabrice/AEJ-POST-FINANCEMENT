import { createFileRoute } from '@tanstack/react-router'
import { FinancementsPage } from '@/pages/Financements/FinancementsPage'

export const Route = createFileRoute('/_authenticated/_agent/financements')({
  component: FinancementsPage,
})
