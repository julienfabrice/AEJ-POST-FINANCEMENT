import { createFileRoute } from '@tanstack/react-router'
import { WorkflowsPage } from '@/pages/Workflows/WorkflowsPage'

export const Route = createFileRoute('/_authenticated/_agent/admin/workflows')({
  component: WorkflowsPage,
})
