import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { WorkflowsPage } from '@/pages/Workflows'

export const Route = createFileRoute('/_authenticated/_agent/admin/workflows')({
  beforeLoad: requireModule(MODULES.WORKFLOWS),
  component: WorkflowsPage,
})
