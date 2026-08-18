import { createFileRoute } from '@tanstack/react-router'
import { UtilisateursPage } from '@/pages/Utilisateurs/UtilisateursPage'

export const Route = createFileRoute('/_authenticated/_agent/admin/utilisateurs')({
  component: UtilisateursPage,
})
