import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { TransmissionPage } from '@/pages/Transmission/TransmissionPage'

export const Route = createFileRoute('/_authenticated/_agent/transmission')({
  beforeLoad: requireModule(MODULES.TRANSMISSION),
  component: TransmissionPage,
})
