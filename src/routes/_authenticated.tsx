import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '@/layouts/AppLayout/AppLayout'

export const Route = createFileRoute('/_authenticated')({
  // TODO: beforeLoad: redirect to /login if not authenticated
  component: AppLayout,
})
