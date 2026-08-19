import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { UtilisateursPage } from '@/pages/Utilisateurs/UtilisateursPage'

export const Route = createFileRoute('/_authenticated/_agent/admin/utilisateurs')({
  beforeLoad: requireModule(MODULES.UTILISATEURS),
  component: UtilisateursPage,
})
