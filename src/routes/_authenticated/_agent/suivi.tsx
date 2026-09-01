import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { SuiviEtExploitationPage } from '@/pages/SuiviEtExploitation'

export const Route = createFileRoute('/_authenticated/_agent/suivi')({
  beforeLoad: requireModule(MODULES.SUIVI),
  component: SuiviEtExploitationPage,
})
