import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { UnitesPage } from '@/pages/Unites/UnitesPage'

export const Route = createFileRoute('/_authenticated/_agent/admin/unites')({
  beforeLoad: requireModule(MODULES.UNITES),
  component: UnitesPage,
})
