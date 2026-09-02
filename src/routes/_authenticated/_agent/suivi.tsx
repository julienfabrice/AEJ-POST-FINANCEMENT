import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { SuiviPage } from '@/pages/Suivi/SuiviPage'

export const Route = createFileRoute('/_authenticated/_agent/suivi')({
  beforeLoad: requireModule(MODULES.SUIVI),
  component: SuiviPage,
})
