import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { LocalitesPage } from '@/pages/Localites/LocalitesPage'

export const Route = createFileRoute('/_authenticated/_agent/admin/localites')({
  beforeLoad: requireModule(MODULES.LOCALITES),
  component: LocalitesPage,
})
