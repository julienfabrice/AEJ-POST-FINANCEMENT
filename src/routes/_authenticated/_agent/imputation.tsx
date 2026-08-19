import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { ImputationPage } from '@/pages/Imputation/ImputationPage'

export const Route = createFileRoute('/_authenticated/_agent/imputation')({
  beforeLoad: requireModule(MODULES.IMPUTATION),
  component: ImputationPage,
})
