import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { RecouvrementPage } from '@/pages/Recouvrement/RecouvrementPage'

export const Route = createFileRoute('/_authenticated/_agent/recouvrement')({
  beforeLoad: requireModule(MODULES.RECOUVREMENT),
  component: RecouvrementPage,
})
