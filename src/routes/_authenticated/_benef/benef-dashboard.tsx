import { createFileRoute } from '@tanstack/react-router'
import { BenefDashboardPage } from '@/pages/Beneficiaire/BenefDashboardPage'

export const Route = createFileRoute('/_authenticated/_benef/benef-dashboard')({
  component: BenefDashboardPage,
})
