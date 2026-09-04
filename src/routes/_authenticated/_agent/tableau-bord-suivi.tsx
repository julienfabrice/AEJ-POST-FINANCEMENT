import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { TableauBordSuiviPage } from '@/pages/TableauBordSuivi/TableauBordSuiviPage'

export const Route = createFileRoute('/_authenticated/_agent/tableau-bord-suivi')({
  beforeLoad: requireModule(MODULES.SUIVI),
  component: TableauBordSuiviPage,
})
