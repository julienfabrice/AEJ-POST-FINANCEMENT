import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { ReferentielsPage } from '@/pages/Referentiels/ReferentielsPage'

export const Route = createFileRoute('/_authenticated/_agent/admin/referentiels')({
  beforeLoad: requireModule(MODULES.REFERENTIELS),
  component: ReferentielsPage,
})
