import { createFileRoute } from '@tanstack/react-router'
import { BenefRemboursementsPage } from '@/pages/Beneficiaire/BenefRemboursementsPage'

export const Route = createFileRoute('/_authenticated/_benef/mes-remboursements')({
  component: BenefRemboursementsPage,
})
