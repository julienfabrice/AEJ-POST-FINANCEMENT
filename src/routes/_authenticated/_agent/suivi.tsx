import { createFileRoute } from '@tanstack/react-router'
import { SuiviPage } from '@/pages/Suivi/SuiviPage'

export const Route = createFileRoute('/_authenticated/_agent/suivi')({
  component: SuiviPage,
})
