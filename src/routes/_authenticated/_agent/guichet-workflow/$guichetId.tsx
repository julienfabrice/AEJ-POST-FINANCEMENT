import { createFileRoute } from '@tanstack/react-router'
import { GuichetWorkflowPage } from '@/pages/guichet-workflow/GuichetWorkflowPage'

export const Route = createFileRoute('/_authenticated/_agent/guichet-workflow/$guichetId')({
  component: GuichetWorkflowPage,
})
