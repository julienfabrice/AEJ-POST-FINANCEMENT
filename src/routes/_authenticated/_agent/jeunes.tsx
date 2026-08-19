import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { JeunesPage } from '@/pages/Jeunes'

export const Route = createFileRoute('/_authenticated/_agent/jeunes')({
  beforeLoad: requireModule(MODULES.JEUNES),
  component: JeunesPage,
})
