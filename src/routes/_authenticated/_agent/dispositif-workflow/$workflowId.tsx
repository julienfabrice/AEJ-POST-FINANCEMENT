import { createFileRoute } from '@tanstack/react-router'
import { DispositifWorkflowPage } from '@/pages/dispositif-workflow/DispositifWorkflowPage'

export const Route = createFileRoute('/_authenticated/_agent/dispositif-workflow/$workflowId')({
  component: DispositifWorkflowPage,
})
