import { createFileRoute } from '@tanstack/react-router'
import { BenefPiecesPage } from '@/pages/Beneficiaire/BenefPiecesPage'

export const Route = createFileRoute('/_authenticated/_benef/mes-pieces')({
  component: BenefPiecesPage,
})
