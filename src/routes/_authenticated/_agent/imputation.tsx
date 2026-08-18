import { createFileRoute } from '@tanstack/react-router'
import { ImputationPage } from '@/pages/Imputation/ImputationPage'

export const Route = createFileRoute('/_authenticated/_agent/imputation')({
  component: ImputationPage,
})
