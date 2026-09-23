import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { ImputationPage } from '@/pages/Imputation'

import { z } from 'zod'

export const Route = createFileRoute('/_authenticated/_agent/imputation')({
  beforeLoad: requireModule(MODULES.IMPUTATION),
  validateSearch: z.object({
    projetId: z.number().optional().catch(undefined),
  }),
  component: ImputationPage,
})
