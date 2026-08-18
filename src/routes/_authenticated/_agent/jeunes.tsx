import { createFileRoute } from '@tanstack/react-router'
import { JeunesPage } from '@/pages/Jeunes/JeunesPage'

export const Route = createFileRoute('/_authenticated/_agent/jeunes')({
  component: JeunesPage,
})
