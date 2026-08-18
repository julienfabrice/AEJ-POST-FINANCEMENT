import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '@/pages/Dashboard/DashboardPage'

export const Route = createFileRoute('/_authenticated/_agent/dashboard')({
  component: DashboardPage,
})
