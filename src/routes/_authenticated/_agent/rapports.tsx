import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { RapportEtAnalysePage } from '@/pages/RapportEtAnalyse'

export const Route = createFileRoute('/_authenticated/_agent/rapports')({
  beforeLoad: requireModule(MODULES.RAPPORTS),
  component: RapportEtAnalysePage,
})
