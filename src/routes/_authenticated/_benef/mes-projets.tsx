import { createFileRoute } from '@tanstack/react-router'
import { BenefProjetsPage } from '@/pages/Beneficiaire/BenefProjetsPage'

export const Route = createFileRoute('/_authenticated/_benef/mes-projets')({
  component: BenefProjetsPage,
})
