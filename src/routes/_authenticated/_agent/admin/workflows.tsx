import { createFileRoute } from '@tanstack/react-router'
import { WorkflowsPage } from '@/pages/Workflows'

export const Route = createFileRoute('/_authenticated/_agent/admin/workflows')({
  component: WorkflowsPage,
})
