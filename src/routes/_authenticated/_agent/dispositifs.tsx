import { createFileRoute } from '@tanstack/react-router'
import { DispositifPage } from '@/pages/dispositifs/DispositifPage'

export const Route = createFileRoute('/_authenticated/_agent/dispositifs')({
  component: DispositifPage,
})
