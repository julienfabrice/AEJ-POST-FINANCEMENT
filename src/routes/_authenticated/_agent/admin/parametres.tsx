import { createFileRoute } from '@tanstack/react-router'
import { ParametresPage } from '@/pages/Parametres/ParametresPage'

export const Route = createFileRoute('/_authenticated/_agent/admin/parametres')({
  component: ParametresPage,
})
