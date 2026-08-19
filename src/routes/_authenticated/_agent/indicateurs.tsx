import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { IndicateursPage } from '@/pages/Indicateurs/IndicateursPage'

export const Route = createFileRoute('/_authenticated/_agent/indicateurs')({
  beforeLoad: requireModule(MODULES.INDICATEURS),
  component: IndicateursPage,
})
