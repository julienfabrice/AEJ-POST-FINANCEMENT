import { createFileRoute } from '@tanstack/react-router'
import { DispostifsPage } from '@/pages/Dispostifs/DispostifsPage'

export const Route = createFileRoute('/_authenticated/_agent/dispositifs')({
  component: DispostifsPage,
})
