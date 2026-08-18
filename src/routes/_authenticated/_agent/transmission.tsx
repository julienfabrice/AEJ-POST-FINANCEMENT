import { createFileRoute } from '@tanstack/react-router'
import { TransmissionPage } from '@/pages/Transmission/TransmissionPage'

export const Route = createFileRoute('/_authenticated/_agent/transmission')({
  component: TransmissionPage,
})
