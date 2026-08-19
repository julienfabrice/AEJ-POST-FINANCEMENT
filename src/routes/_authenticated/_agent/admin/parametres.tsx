import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { ParametresPage } from '@/pages/Parametres/ParametresPage'

export const Route = createFileRoute('/_authenticated/_agent/admin/parametres')({
  beforeLoad: requireModule(MODULES.PARAMETRES),
  component: ParametresPage,
})
