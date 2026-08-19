import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/useAuthStore'

export const Route = createFileRoute('/_authenticated/_agent')({
  beforeLoad: () => {
    // Espace agent = personnel AEJ (`agence`) ou partenaire (`organisme`) ;
    // seul le promoteur (`entreprise`) est renvoyé vers son propre espace.
    if (useAuthStore.getState().space() === 'entreprise') {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: AgentLayout,
})

function AgentLayout() {
  return <Outlet />
}
