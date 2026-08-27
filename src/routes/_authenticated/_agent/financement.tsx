import { createFileRoute } from '@tanstack/react-router'
import { FinancementPage } from '@/pages/Financement'

export const Route = createFileRoute('/_authenticated/_agent/financement')({
  component: FinancementPage,
})
