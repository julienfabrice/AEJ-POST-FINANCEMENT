import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { PartenairesPage } from '@/pages/Partenaires/PartenairesPage'

export const Route = createFileRoute('/_authenticated/_agent/admin/partenaires')({
  beforeLoad: requireModule(MODULES.PARTENAIRES),
  component: PartenairesPage,
})
