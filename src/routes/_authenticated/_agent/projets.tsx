import { createFileRoute } from '@tanstack/react-router'
import { ProjetsPage } from '@/pages/Projets'

/** `?x=` absent ou vide ⇒ `undefined`, pour que le filtre ne parte pas du tout. */
const str = (v: unknown) => {
  const s = typeof v === 'string' ? v.trim() : ''
  return s === '' ? undefined : s
}

export interface ProjetsSearchParams {
  guichet_id?: string
}

export const Route = createFileRoute('/_authenticated/_agent/projets')({
  validateSearch: (s: Record<string, unknown>): ProjetsSearchParams => ({
    guichet_id: str(s.guichet_id),
  }),
  // TODO(perms) : garde désactivé — rétablir avec
  // `beforeLoad: requireModule(MODULES.PROJETS)` (imports à réajouter).
  component: ProjetsPage,
})
