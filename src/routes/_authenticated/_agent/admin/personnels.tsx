import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { PersonnelsPage } from '@/pages/Personnels/PersonnelsPage'

export const Route = createFileRoute('/_authenticated/_agent/admin/personnels')({
  beforeLoad: requireModule(MODULES.UTILISATEURS),
  component: PersonnelsPage,
})
