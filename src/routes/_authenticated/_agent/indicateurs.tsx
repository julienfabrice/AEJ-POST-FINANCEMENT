import { createFileRoute } from '@tanstack/react-router'
import { IndicateursPage } from '@/pages/Indicateurs/IndicateursPage'

export const Route = createFileRoute('/_authenticated/_agent/indicateurs')({
  component: IndicateursPage,
})
