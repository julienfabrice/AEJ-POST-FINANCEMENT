import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { ProjetsPage } from '@/pages/Projets'

export const Route = createFileRoute('/_authenticated/_agent/projets')({
  beforeLoad: requireModule(MODULES.PROJETS),
  component: ProjetsPage,
})
