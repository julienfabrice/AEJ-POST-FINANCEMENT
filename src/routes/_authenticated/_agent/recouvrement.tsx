import { createFileRoute } from '@tanstack/react-router'
import { RecouvrementPage } from '@/pages/Recouvrement/RecouvrementPage'

export const Route = createFileRoute('/_authenticated/_agent/recouvrement')({
  component: RecouvrementPage,
})
