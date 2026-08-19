import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { PfEspacePage } from '@/pages/PfEspace/PfEspacePage'

export const Route = createFileRoute('/_authenticated/_agent/pf-espace')({
  beforeLoad: requireModule(MODULES.PF_ESPACE),
  component: PfEspacePage,
})
