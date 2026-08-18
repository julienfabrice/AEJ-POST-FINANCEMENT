import { createFileRoute } from '@tanstack/react-router'
import { DashboardController } from '@/pages/Dashboard'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardController,
})
