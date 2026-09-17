import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { TransmissionPage } from '@/pages/Transmission'

export const Route = createFileRoute('/_authenticated/_agent/transmission')({
  beforeLoad: requireModule(MODULES.TRANSMISSION),
  validateSearch: z.object({
    guichet_id: z.string().optional(),
    projet_id: z.string().optional(),
  }),
  component: TransmissionPage,
})

