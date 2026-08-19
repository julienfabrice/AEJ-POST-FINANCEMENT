import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { ProfilsPage } from '@/pages/Profils/ProfilsPage'

export const Route = createFileRoute('/_authenticated/_agent/admin/profils')({
  beforeLoad: requireModule(MODULES.PROFILS),
  component: ProfilsPage,
})
