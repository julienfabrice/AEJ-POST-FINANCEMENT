import { createFileRoute } from '@tanstack/react-router'
import { MODULES } from '@/constants/modules'
import { requireModule } from '@/lib/guards'
import { DispostifsPage } from '@/pages/Dispostifs/DispostifsPage'

export const Route = createFileRoute('/_authenticated/_agent/dispositifs')({
  beforeLoad: requireModule(MODULES.DISPOSITIFS),
  component: DispostifsPage,
})
