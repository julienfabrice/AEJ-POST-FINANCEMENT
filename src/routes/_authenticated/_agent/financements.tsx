import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { FinancementsPage } from '@/pages/Financements/FinancementsPage'

export const Route = createFileRoute('/_authenticated/_agent/financements')({
  beforeLoad: requireModule(MODULES.FINANCEMENTS),
  component: FinancementsPage,
})
