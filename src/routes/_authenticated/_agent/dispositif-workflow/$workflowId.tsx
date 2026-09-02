import { createFileRoute } from '@tanstack/react-router'
import { DispositifWorkflowPage } from '@/pages/dispositif-workflow/DispositifWorkflowPage'
import { z } from 'zod'

export const Route = createFileRoute('/_authenticated/_agent/dispositif-workflow/$workflowId')({
  validateSearch: z.object({
    dispositifId: z.number().optional().catch(undefined),
  }),
  component: DispositifWorkflowPage,
})
